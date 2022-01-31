import json
import os
from datetime import datetime
from decimal import Decimal

import boto3
import requests
from bs4 import BeautifulSoup
from trueskill import Rating, rate


URL = "https://www.nytimes.com/puzzles/leaderboards"
COOKIES = json.loads(os.environ["NYTX"])
USERS_TABLE = os.environ["USERS_TABLE"]
SCORES_TABLE = os.environ["SCORES_TABLE"]
RATINGS_TABLE = os.environ["RATINGS_TABLE"]


def handler(event, context):
    # Scrape
    response = requests.get(URL, cookies=COOKIES)
    soup = BeautifulSoup(response.text, "html.parser")

    # Parse the response and save the scores
    puzzle_date = soup.find("h3", "lbd-type__date").string
    date = datetime.strptime(puzzle_date, "%A, %B %d, %Y")
    ranks = {}

    dynamodb = boto3.resource("dynamodb")
    scores_table = dynamodb.Table(SCORES_TABLE)
    with scores_table.batch_writer() as batch:
        for score in soup.find_all("div", class_="lbd-score"):
            if "no-rank" in score.attrs["class"]:
                break

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

            ranks[name] = rank
            batch.put_item(
                Item={
                    "name": name,
                    "date": date.strftime("%Y-%m-%d"),
                    "year": date.year,
                    "time": time,
                    "rank": rank,
                }
            )

    # Get users' current TrueSkill ratings
    users_response = dynamodb.batch_get_item(
        RequestItems={USERS_TABLE: {"Keys": [{"name": name} for name in ranks]}}
    )["Responses"][USERS_TABLE]
    ratings_response = users_response and dynamodb.batch_get_item(
        RequestItems={
            RATINGS_TABLE: {
                "Keys": [
                    {"name": user["name"], "date": user["lastPlay"]}
                    for user in users_response
                ]
            }
        }
    )["Responses"][RATINGS_TABLE]

    ratings = []
    for name in ranks:
        try:
            rating = Rating(
                *next(
                    (float(rating["mu"]), float(rating["sigma"]))
                    for rating in ratings_response
                    if rating["name"] == name
                )
            )
        except StopIteration:
            rating = Rating()

        ratings.append((rating,))

    # Calculate new TrueSkill ratings
    ratings = rate(ratings, ranks=ranks.values())

    # Update users' TrueSkill ratings
    users_table = dynamodb.Table(USERS_TABLE)
    ratings_table = dynamodb.Table(RATINGS_TABLE)
    with ratings_table.batch_writer() as batch:
        for name, (rating,) in zip(ranks, ratings):
            batch.put_item(
                Item={
                    "name": name,
                    "date": date.strftime("%Y-%m-%d"),
                    "mu": Decimal(str(rating.mu)),
                    "sigma": Decimal(str(rating.sigma)),
                    "eta": Decimal(str(rating.exposure)),
                }
            )

            users_table.update_item(
                Key={"name": name},
                UpdateExpression="ADD gamesPlayed :val SET lastPlay = :d",
                ExpressionAttributeValues={
                    ":val": 1,
                    ":d": date.strftime("%Y-%m-%d"),
                },
            )