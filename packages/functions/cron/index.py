import os
from dataclasses import dataclass
from datetime import datetime

import boto3
import requests
from bs4 import BeautifulSoup
from trueskill import MU, Rating, SIGMA, rate


URL = "https://www.nytimes.com/puzzles/leaderboards"
TABLE_NAME = os.environ["SST_Table_tableName_Entity"]


@dataclass
class Score:
    name: str
    rank: int
    time: str
    seconds: int


def handler(event, context):
    # Load secret
    ssm = boto3.client("ssm")
    parameters = ssm.get_parameters(
        Names=["/sst/nytx/prod/Secret/NYT_S/value"], WithDecryption=True
    )

    # Scrape
    secret = parameters["Parameters"][0]["Value"]
    response = requests.get(URL, cookies={"NYT-S": secret})
    soup = BeautifulSoup(response.text, "html.parser")

    # Parse the date
    puzzle_date = soup.find("h3", "lbd-type__date").string
    date = datetime.strptime(puzzle_date, "%A, %B %d, %Y")
    date_str = date.strftime("%Y-%m-%d")

    # Parse the scores
    scores = []
    dynamodb = boto3.client("dynamodb")
    for score in soup.find_all("div", class_="lbd-score"):
        name_tag = score.find("p", class_="lbd-score__name")
        name = (name_tag.string or next(name_tag.children)).rstrip()

        if (
            "no-rank" in score.attrs["class"]
            or score.find("a", class_="lbd-score__link") is not None
        ):
            dynamodb.update_item(
                TableName=TABLE_NAME,
                Key={"PK": {"S": f"PLAYER#{name}"}, "SK": {"S": "#"}},
                UpdateExpression="SET Streak = :zero",
                ExpressionAttributeValues={":zero": {"N": "0"}},
            )
            continue

        time = score.find("p", class_="lbd-score__time").string
        seconds = sum(
            int(segment) * 60**i
            for i, segment in enumerate(reversed(time.split(":")))
        )

        try:
            rank = int(score.find("p", class_="lbd-score__rank").string)
        except TypeError:  # Tie, rank is same as previous player
            rank = scores[-1].rank

        scores.append(Score(name, rank, time, seconds))

    # Exit early if there are no scores to report
    if not scores:
        return

    # Correct ranking data if there were any NYT glitches
    for score in scores:
        score.rank = score.rank - (scores[0].rank - 1)

    # Get player data
    player_data = dynamodb.batch_get_item(
        RequestItems={
            TABLE_NAME: {
                "Keys": [
                    {"PK": {"S": f"PLAYER#{score.name}"}, "SK": {"S": "#"}}
                    for score in scores
                ]
            }
        }
    )["Responses"][TABLE_NAME]

    # Update player data
    for score in scores:
        pk = f"PLAYER#{score.name}"
        player = next(
            (player for player in player_data if player["PK"]["S"] == pk),
            {"Streak": {"N": 0}, "MaxStreak": {"N": 0}},
        )

        streak = int(player["Streak"]["N"]) + 1
        max_streak = max(int(player["MaxStreak"]["N"]), streak)

        dynamodb.update_item(
            TableName=TABLE_NAME,
            Key={"PK": {"S": pk}, "SK": {"S": "#"}},
            UpdateExpression="ADD #total :one SET LastPlay = :date, Streak = :s, MaxStreak = :ms",
            ExpressionAttributeNames={"#total": "Total"},
            ExpressionAttributeValues={
                ":one": {"N": "1"},
                ":date": {"S": date_str},
                ":s": {"N": str(streak)},
                ":ms": {"N": str(max_streak)},
            },
        )

    # Get current TrueSkill ratings
    rating_data = (
        player_data
        # Skip fetch on the first day of the month to refresh ratings monthly
        and date.day != 1
        and dynamodb.batch_get_item(
            RequestItems={
                TABLE_NAME: {
                    "Keys": [
                        {
                            "PK": {"S": f'SCORE#{player["PK"]["S"].split("#")[1]}'},
                            "SK": {"S": f'DATE#{player["LastPlay"]["S"]}'},
                        }
                        for player in player_data
                        # Only use 'LastPlay' rating if it's from this month
                        if player.get("LastPlay", {}).get("S", "")[5:7] == date_str[5:7]
                    ]
                }
            }
        )["Responses"][TABLE_NAME]
    )

    # Create 'Rating' objects
    ratings = [
        (
            Rating(
                *next(
                    (
                        (float(rating["Mu"]["N"]), float(rating["Sigma"]["N"]))
                        for rating in rating_data
                        if rating["PK"]["S"] == f"SCORE#{score.name}"
                    ),
                    (MU, SIGMA),
                )
            ),
        )
        for score in scores
    ]

    # Calculate new TrueSkill ratings -- skip if only 1 player played
    new_ratings = (
        ratings
        if len(ratings) == 1
        else rate(ratings, ranks=[score.rank for score in scores])
    )

    # Write updated scores and ratings
    dynamodb.batch_write_item(
        RequestItems={
            TABLE_NAME: [
                {
                    "PutRequest": {
                        "Item": {
                            "PK": {"S": f"SCORE#{score.name}"},
                            "SK": {"S": f"DATE#{date_str}"},
                            "GSI1PK": {"S": f"YEAR#{date.year}"},
                            "GSI1SK": {"S": f"DATE#{date_str}"},
                            "Time": {"S": score.time},
                            "Seconds": {"N": str(score.seconds)},
                            "Rank": {"N": str(score.rank)},
                            "Mu": {"N": str(rating.mu)},
                            "Sigma": {"N": str(rating.sigma)},
                            "Eta": {"N": str(rating.exposure)},
                            # GSI2 is a sparse index for excluding midi results
                            **(
                                {
                                    "GSI2PK": {"S": f"SCORE#{score.name}"},
                                    "GSI2SK": {"S": f"DATE#{date_str}"},
                                }
                                if date.isoweekday() != 6
                                else {}
                            ),
                        }
                    }
                }
                for score, (rating,) in zip(scores, new_ratings)
            ]
        }
    )
