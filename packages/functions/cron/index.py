import os
from datetime import datetime
from decimal import Decimal

import boto3
import requests
from bs4 import BeautifulSoup
from trueskill import MU, Rating, SIGMA, rate


URL = "https://www.nytimes.com/puzzles/leaderboards"
USERS_TABLE = os.environ["SST_Table_tableName_Users"]
SCORES_TABLE = os.environ["SST_Table_tableName_Scores"]
RATINGS_TABLE = os.environ["SST_Table_tableName_Ratings"]


def handler(event, context):
    # Load secret
    ssm = boto3.client("ssm")
    parameter = ssm.get_parameters(Names=["/sst/nytx/prod/Secret/NYT_S/value"], WithDecryption=True)
    secret = parameter["Parameters"][0]["Value"]

    # Scrape
    response = requests.get(URL, cookies={"NYT-S": secret})
    soup = BeautifulSoup(response.text, "html.parser")

    # Parse the response and save the scores
    puzzle_date = soup.find("h3", "lbd-type__date").string
    date = datetime.strptime(puzzle_date, "%A, %B %d, %Y")
    dynamodb = boto3.resource("dynamodb")

    ranks = {}
    no_ranks = []
    scores_table = dynamodb.Table(SCORES_TABLE)
    with scores_table.batch_writer() as batch:
        for score in soup.find_all("div", class_="lbd-score"):
            if "no-rank" in score.attrs["class"]:
                name = score.find("p", class_="lbd-score__name")
                no_ranks.append((name.string or next(name.children)).rstrip())
                continue

            for child in score.children:
                class_ = child["class"][0]
                if class_ == "lbd-score__rank":
                    try:
                        rank = int(child.string)
                    except TypeError:  # Tie, rank is same as previous user
                        pass
                if class_ == "lbd-score__name":
                    name = (child.string or next(child.children)).rstrip()
                elif class_ == "lbd-score__time":
                    time = str(child.string)
                    time_s = sum(
                        int(segment) * 60**i
                        for i, segment in enumerate(reversed(time.split(":")))
                    )

            ranks[name] = rank
            batch.put_item(
                Item={
                    "name": name,
                    "date": date.strftime("%Y-%m-%d"),
                    "year": date.year,
                    "time": time,
                    "time_s": time_s,
                    "rank": rank,
                }
            )

    # Update user data
    users_response = dynamodb.batch_get_item(
        RequestItems={USERS_TABLE: {"Keys": [{"name": name} for name in ranks]}}
    )["Responses"][USERS_TABLE]
    users_table = dynamodb.Table(USERS_TABLE)
    for name in ranks:
        try:
            user = next(user for user in users_response if user["name"] == name)
            current_streak = user["currentStreak"] + 1
            max_streak = (
                current_streak
                if current_streak > user["maxStreak"]
                else user["maxStreak"]
            )
        except StopIteration:
            current_streak = 1
            max_streak = 1
        finally:
            users_table.update_item(
                Key={"name": name},
                UpdateExpression="ADD gamesPlayed :val SET lastPlay = :d, currentStreak = :cs, maxStreak = :ms",
                ExpressionAttributeValues={
                    ":val": 1,
                    ":d": date.strftime("%Y-%m-%d"),
                    ":cs": current_streak,
                    ":ms": max_streak,
                },
            )
    for name in no_ranks:
        users_table.update_item(
            Key={"name": name},
            UpdateExpression="SET currentStreak = :val",
            ExpressionAttributeValues={
                ":val": 0,
            },
        )

    # Get users' current TrueSkill ratings
    ratings_response = (
        users_response
        and dynamodb.batch_get_item(
            RequestItems={
                RATINGS_TABLE: {
                    "Keys": [
                        {"name": user["name"], "date": user["lastPlay"]}
                        for user in users_response
                    ]
                }
            }
        )["Responses"][RATINGS_TABLE]
    )

    # Calculate new TrueSkill rankings
    ratings = rate(
        [
            (
                Rating(
                    *next(
                        (
                            (float(rating["mu"]), float(rating["sigma"]))
                            for rating in ratings_response
                            if rating["name"] == name
                        ),
                        (MU, SIGMA),
                    )
                ),
            )
            for name in ranks
        ],
        ranks=ranks.values(),
    )

    # Update users' TrueSkill ratings
    ratings_table = dynamodb.Table(RATINGS_TABLE)
    with ratings_table.batch_writer() as batch:
        for name, (rating,) in zip(ranks, ratings):
            batch.put_item(
                Item={
                    "name": name,
                    "date": date.strftime("%Y-%m-%d"),
                    "year": date.year,
                    "mu": Decimal(str(rating.mu)),
                    "sigma": Decimal(str(rating.sigma)),
                    "eta": Decimal(str(rating.exposure)),
                }
            )
