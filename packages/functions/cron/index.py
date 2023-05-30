import os
from datetime import datetime

import boto3
import requests
from bs4 import BeautifulSoup
from trueskill import MU, Rating, SIGMA, rate


URL = "https://www.nytimes.com/puzzles/leaderboards"
TABLE_NAME = os.environ["SST_Table_tableName_Entity"]


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

    # Parse Date
    puzzle_date = soup.find("h3", "lbd-type__date").string
    date = datetime.strptime(puzzle_date, "%A, %B %d, %Y")
    date_str = date.strftime("%Y-%m-%d")

    rows = []
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
            rank = rows[-1]["Rank"]

        rows.append(
            {
                "Name": name,
                "Time": time,
                "Seconds": seconds,
                "Rank": rank,
            }
        )

    # Get current players
    players = dynamodb.batch_get_item(
        RequestItems={
            TABLE_NAME: {
                "Keys": [
                    {"PK": {"S": f'PLAYER#{row["Name"]}'}, "SK": {"S": "#"}}
                    for row in rows
                ]
            }
        }
    )["Responses"][TABLE_NAME]

    # Update player data for those who played today
    for row in rows:
        try:
            player = next(
                (
                    player
                    for player in players
                    if player["PK"]["S"] == f'PLAYER#{row["Name"]}'
                )
            )
            streak = int(player["Streak"]["N"]) + 1
            max_streak = max(int(player["MaxStreak"]["N"]), streak)
        except (StopIteration, KeyError):
            streak = 1
            max_streak = 1
        finally:
            dynamodb.update_item(
                TableName=TABLE_NAME,
                Key={"PK": {"S": f'PLAYER#{row["Name"]}'}, "SK": {"S": "#"}},
                UpdateExpression="ADD #total :one SET LastPlay = :date, Streak = :s, MaxStreak = :ms",
                ExpressionAttributeNames={"#total": "Total"},
                ExpressionAttributeValues={
                    ":one": {"N": "1"},
                    ":date": {"S": date_str},
                    ":s": {"N": str(streak)},
                    ":ms": {"N": str(max_streak)},
                },
            )

    # Get current TrueSkill ratings -- refresh each month
    ratings = (
        players
        and date.day != 1
        and dynamodb.batch_get_item(
            RequestItems={
                TABLE_NAME: {
                    "Keys": [
                        {
                            "PK": {"S": f'SCORE#{player["PK"]["S"].split("#")[1]}'},
                            "SK": {"S": f'DATE#{player["LastPlay"]["S"]}'},
                        }
                        for player in players
                        if "LastPlay" in player
                    ]
                }
            }
        )["Responses"][TABLE_NAME]
    )

    # Calculate new TrueSkill ratings
    new_ratings = rate(
        [(Rating(),)] * len(rows)
        if not ratings
        else [
            (
                Rating(
                    *next(
                        (
                            (float(rating["Mu"]["N"]), float(rating["Sigma"]["N"]))
                            for rating in ratings
                            if rating["PK"]["S"] == f'SCORE#{row["Name"]}'
                        ),
                        (MU, SIGMA),
                    )
                ),
            )
            for row in rows
        ],
        ranks=[row["Rank"] for row in rows],
    )

    # Save new data -- create sparse index for excluding midis
    dynamodb.batch_write_item(
        RequestItems={
            TABLE_NAME: [
                {
                    "PutRequest": {
                        "Item": {
                            "PK": {"S": f'SCORE#{row["Name"]}'},
                            "SK": {"S": f"DATE#{date_str}"},
                            "GSI1PK": {"S": f"YEAR#{date.year}"},
                            "GSI1SK": {"S": f"DATE#{date_str}"},
                            "Time": {"S": row["Time"]},
                            "Seconds": {"N": str(row["Seconds"])},
                            "Rank": {"N": str(row["Rank"])},
                            "Mu": {"N": str(rating.mu)},
                            "Sigma": {"N": str(rating.sigma)},
                            "Eta": {"N": str(rating.exposure)},
                            **(
                                {
                                    "GSI2PK": {"S": f'SCORE#{row["Name"]}'},
                                    "GSI2SK": {"S": f"DATE#{date_str}"},
                                }
                                if date.isoweekday() != 6
                                else {}
                            ),
                        }
                    }
                }
                for row, (rating,) in zip(rows, new_ratings)
            ]
        }
    )
