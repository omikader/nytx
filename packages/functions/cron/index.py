import os
from datetime import datetime

import boto3
import requests
from bs4 import BeautifulSoup
from trueskill import MU, Rating, SIGMA, rate


URL = "https://www.nytimes.com/puzzles/leaderboards"
TABLE = os.environ["SST_Table_tableName_Table"]


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
                TableName=TABLE,
                Key={"pk": {"S": f"PLAYER#{name}"}, "sk": {"S": "#"}},
                UpdateExpression="SET currentStreak = :val",
                ExpressionAttributeValues={":val": {"N": "0"}},
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
            rank = rows[-1]["rank"]

        rows.append(
            {
                "name": name,
                "date": date.strftime("%Y-%m-%d"),
                "dow": date.isoweekday(),
                "time": time,
                "seconds": seconds,
                "rank": rank,
            }
        )

    # Get current players
    players = dynamodb.batch_get_item(
        RequestItems={
            TABLE: {
                "Keys": [
                    {"pk": {"S": f'PLAYER#{row["name"]}'}, "sk": {"S": "#"}}
                    for row in rows
                ]
            }
        }
    )["Responses"][TABLE]

    # Update player data for those who played today
    for row in rows:
        player = next(
            (
                player
                for player in players
                if player["pk"]["S"] == f'PLAYER#{row["name"]}'
            ),
            {"currentStreak": {"N": 0}, "maxStreak": {"N": 0}},
        )

        current_streak = int(player["currentStreak"]["N"]) + 1
        max_streak = max(int(player["maxStreak"]["N"]), current_streak)

        dynamodb.update_item(
            TableName=TABLE,
            Key={"pk": {"S": f'PLAYER#{row["name"]}'}, "sk": {"S": "#"}},
            UpdateExpression="ADD gamesPlayed :val SET lastPlay = :d, currentStreak = :cs, maxStreak = :ms",
            ExpressionAttributeValues={
                ":val": {"N": "1"},
                ":d": {"S": row["date"]},
                ":cs": {"N": str(current_streak)},
                ":ms": {"N": str(max_streak)},
            },
        )

    # Get current TrueSkill ratings
    ratings = (
        players
        and dynamodb.batch_get_item(
            RequestItems={
                TABLE: {
                    "Keys": [
                        {
                            "pk": {"S": f'SCORE#{player["pk"]["S"].split("#")[1]}'},
                            "sk": {"S": f'DATE#{player["lastPlay"]["S"]}'},
                        }
                        for player in players
                    ]
                }
            }
        )["Responses"][TABLE]
    )

    # Calculate new TrueSkill ratings
    new_ratings = rate(
        [
            (
                Rating(
                    *next(
                        (
                            (float(rating["mu"]["N"]), float(rating["sigma"]["N"]))
                            for rating in ratings
                            if rating["pk"]["S"] == f'SCORE#{row["name"]}'
                        ),
                        (MU, SIGMA),
                    )
                ),
            )
            for row in rows
        ],
        ranks=[row["rank"] for row in rows],
    )

    # Save new data
    dynamodb.batch_write_item(
        RequestItems={
            TABLE: [
                {
                    "PutRequest": {
                        "Item": {
                            "pk": {"S": f'SCORE#{row["name"]}'},
                            "sk": {"S": f'DATE#{row["date"]}'},
                            "dow": {"N": str(row["dow"])},
                            "time": {"S": row["time"]},
                            "seconds": {"N": str(row["seconds"])},
                            "rank": {"N": str(row["rank"])},
                            "mu": {"N": str(rating.mu)},
                            "sigma": {"N": str(rating.sigma)},
                            "eta": {"N": str(rating.exposure)},
                        }
                    }
                }
                for row, (rating,) in zip(rows, new_ratings)
            ]
        }
    )
