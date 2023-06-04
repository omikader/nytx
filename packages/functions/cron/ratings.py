from typing import Any, Dict, List, Union

from trueskill import MU, Rating, SIGMA, rate

import scrape


def compute_ratings(
    scores: List[scrape.Score], rating_data: Union[bool, List[Dict[str, Any]]]
) -> List[Rating]:
    ratings = (
        [(Rating(),)] * len(scores)
        if not rating_data
        else [
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
    )

    return (
        ratings
        if len(ratings) == 1
        else rate(ratings, ranks=[score.rank for score in scores])
    )
