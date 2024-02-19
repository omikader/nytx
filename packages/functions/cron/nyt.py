import json
from dataclasses import dataclass
from datetime import datetime
from typing import List, Tuple

import boto3
import requests
from bs4 import BeautifulSoup

import dynamo

URL = "https://www.nytimes.com/puzzles/leaderboards"


@dataclass
class Score:
    name: str
    rank: int
    time: str
    seconds: int


def scrape() -> Tuple[datetime, List[Score]]:
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
    pz_content = soup.find("div", class_="pz-content").find("script").string
    data = json.loads(pz_content.split(" = ")[1])
    date = datetime.strptime(data["displayDate"], "%A, %B %d, %Y")

    # Parse the scores
    scores = []
    for score in data["scoreList"]:
        name = score["name"]

        if not score["finished"]:
            dynamo.clear_player_streak(name)
        else:
            time = score["solveTime"]
            seconds = sum(
                int(segment) * 60**i
                for i, segment in enumerate(reversed(time.split(":")))
            )

            try:
                rank = int(score["rank"])
            except TypeError:  # Tie, rank is same as previous player
                rank = scores[-1].rank

            scores.append(Score(name, rank, time, seconds))

    # Correct 'rank' if there are any NYT glitches
    if scores:
        for score in scores:
            score.rank = score.rank - (scores[0].rank - 1)

    return date, scores
