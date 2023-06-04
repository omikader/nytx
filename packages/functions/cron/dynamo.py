import os
from datetime import datetime
from typing import Any, Dict, List, Tuple

import boto3
from botocore.exceptions import ClientError
from trueskill import Rating

import scrape

TABLE_NAME = os.environ["SST_Table_tableName_Entity"]
DYNAMODB = boto3.client("dynamodb")


def clear_player_streak(name: str) -> None:
    try:
        DYNAMODB.update_item(
            TableName=TABLE_NAME,
            Key={"PK": {"S": f"PLAYER#{name}"}, "SK": {"S": "#"}},
            UpdateExpression="SET Streak = :zero",
            ExpressionAttributeValues={":zero": {"N": "0"}},
            ConditionExpression=f"attribute_exists(Streak)",
        )
    except ClientError as e:
        if e.response["Error"]["Code"] == "ConditionalCheckFailedException":
            return


def get_players(scores: List[scrape.Score]) -> None:
    return DYNAMODB.batch_get_item(
        RequestItems={
            TABLE_NAME: {
                "Keys": [
                    {"PK": {"S": f"PLAYER#{score.name}"}, "SK": {"S": "#"}}
                    for score in scores
                ]
            }
        }
    )["Responses"][TABLE_NAME]


def get_ratings(player_data: Dict[str, Any]) -> Dict[str, Any]:
    return DYNAMODB.batch_get_item(
        RequestItems={
            TABLE_NAME: {
                "Keys": [
                    {
                        "PK": {"S": f'SCORE#{player["PK"]["S"].split("#")[1]}'},
                        "SK": {"S": f'DATE#{player["LastPlay"]["S"]}'},
                    }
                    for player in player_data
                ]
            }
        }
    )["Responses"][TABLE_NAME]


def format_player_updates(
    scores: List[scrape.Score], player_data: Dict[str, Any], date: datetime
) -> None:
    updates = []
    date_str = date.strftime("%Y-%m-%d")
    for score in scores:
        pk = f"PLAYER#{score.name}"
        player = next(
            (player for player in player_data if player["PK"]["S"] == pk),
            {"Streak": {"N": 0}, "MaxStreak": {"N": 0}},
        )

        streak = int(player["Streak"]["N"]) + 1
        max_streak = max(int(player["MaxStreak"]["N"]), streak)

        updates.append(
            {
                "Update": {
                    "TableName": TABLE_NAME,
                    "Key": {"PK": {"S": pk}, "SK": {"S": "#"}},
                    "UpdateExpression": "ADD #total :one SET LastPlay = :date, Streak = :s, MaxStreak = :ms",
                    "ExpressionAttributeNames": {"#total": "Total"},
                    "ExpressionAttributeValues": {
                        ":one": {"N": "1"},
                        ":date": {"S": date_str},
                        ":s": {"N": str(streak)},
                        ":ms": {"N": str(max_streak)},
                    },
                }
            }
        )

    return updates


def format_score_writes(
    scores: List[scrape.Score], ratings: List[Tuple[Rating]], date: datetime
) -> None:
    date_str = date.strftime("%Y-%m-%d")
    return (
        {
            "Put": {
                "TableName": TABLE_NAME,
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
        for score, (rating,) in zip(scores, ratings)
    )


def save_data(
    scores: List[scrape.Score],
    ratings: List[Tuple[Rating]],
    player_data: Dict[str, Any],
    date: datetime,
) -> None:
    DYNAMODB.transact_write_items(
        TransactItems=[
            *format_player_updates(scores, player_data, date),
            *format_score_writes(scores, ratings, date),
        ]
    )
