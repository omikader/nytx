from datetime import datetime

from dynamo import get_players, get_ratings, save_data
from ratings import compute_ratings
from scrape import scrape


def handler(event, context):
    date, scores = scrape()

    # Exit early if there are no scores to report
    if not scores:
        return

    # Only use 'LastPlay' rating if it's from this month
    player_data = get_players(scores)
    player_data_with_recent_ratings = [
        player
        for player in player_data
        if datetime.fromisoformat(player["LastPlay"]["S"]).month == date.month
    ]

    # Get current TrueSkill ratings
    rating_data = (
        player_data_with_recent_ratings
        # Skip fetch to refresh ratings monthly
        and date.day != 1
        and get_ratings(player_data_with_recent_ratings)
    )

    # Compute updated TrueSkill ratings
    ratings = compute_ratings(scores, rating_data)

    # Save new players, scores and ratings
    save_data(scores, ratings, player_data, date)
