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
    puzzle_date = soup.find("h3", "lbd-type__date").string
    date = datetime.strptime(puzzle_date, "%A, %B %d, %Y")

    # Parse the scores
    scores = []
    for score in soup.find_all("div", class_="lbd-score"):
        name_tag = score.find("p", class_="lbd-score__name")
        name = (name_tag.string or next(name_tag.children)).rstrip()

        if (
            "no-rank" in score.attrs["class"]
            or score.find("a", class_="lbd-score__link") is not None
        ):
            dynamo.clear_player_streak(name)
        else:
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

    # Correct 'rank' if there are any NYT glitches
    if scores:
        for score in scores:
            score.rank = score.rank - (scores[0].rank - 1)

    return date, scores
