import json
import os
from datetime import datetime

import boto3
import requests
from bs4 import BeautifulSoup


URL = "https://www.nytimes.com/puzzles/leaderboards"
COOKIES = json.loads(os.environ["NYTX"])
TABLE_NAME = os.environ["TABLE_NAME"]


def handler(event, context):
    response = requests.get(URL, cookies=COOKIES)
    soup = BeautifulSoup(response.text, "html.parser")
    puzzle_date = soup.find("h3", "lbd-type__date").string
    date = datetime.strptime(puzzle_date, "%A, %B %d, %Y")
    ttl = date.replace(year=date.year + 1, day=date.day + 1).timestamp()

    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.Table(TABLE_NAME)
    with table.batch_writer() as batch:
        for score in soup.find_all("div", class_="lbd-score"):
            if "no-rank" in score.attrs["class"]:
                continue
            for child in score.children:
                class_ = child["class"][0]
                if class_ == "lbd-score__name":
                    name = child.string or next(child.children)
                elif class_ == "lbd-score__time":
                    time = child.string.split(":")
                    time_s = 60 * int(time[0]) + int(time[1])

            item = {
                "name": name.rstrip(),
                "date": date.strftime("%Y-%m-%d"),
                "time": time_s,
                "ttl": int(ttl),
            }
            print(f"Putting item: {item}")
            batch.put_item(Item=item)
