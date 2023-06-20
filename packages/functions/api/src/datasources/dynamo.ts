import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { Table } from "sst/node/table";
import { isUndefined } from "lodash";
import { match } from "ts-pattern";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const {
  Entity: { tableName: TableName },
} = Table;

export class DynamoAPI {
  readonly client: DynamoDBClient;

  constructor() {
    this.client = new DynamoDBClient({ region: process.env.AWS_REGION });
  }

  fetchPlayerByName = async (name: string) => {
    const command = new QueryCommand({
      TableName,
      KeyConditionExpression: `#PK = :pk AND #SK = :sk`,
      ProjectionExpression: "#Total,#LastPlay,#Streak,#MaxStreak",
      ExpressionAttributeNames: {
        "#PK": "PK",
        "#SK": "SK",
        "#Total": "Total",
        "#LastPlay": "LastPlay",
        "#Streak": "Streak",
        "#MaxStreak": "MaxStreak",
      },
      ExpressionAttributeValues: {
        ":pk": { S: `PLAYER#${name}` },
        ":sk": { S: "#" },
      },
    });

    const output = await this.client.send(command);
    const player = output.Items?.[0];
    return isUndefined(player) ? null : unmarshall(player);
  };

  fetchPlayerScoresInDateRange = async ({
    name,
    start,
    end,
    excludeMidis,
  }: {
    name: string;
    start: string;
    end: string;
    excludeMidis?: boolean | null;
  }) => {
    const commandParams = match({ excludeMidis })
      .with({ excludeMidis: true }, () => ({
        IndexName: "GSI2",
        ExpressionAttributeNames: {
          "#PK": "GSI2PK",
          "#SK": "GSI2SK",
          "#Time": "Time",
          "#Seconds": "Seconds",
          "#Rank": "Rank",
        },
      }))
      .otherwise(() => ({
        ExpressionAttributeNames: {
          "#PK": "PK",
          "#SK": "SK",
          "#Time": "Time",
          "#Seconds": "Seconds",
          "#Rank": "Rank",
        },
      }));

    const command = new QueryCommand({
      TableName,
      ...commandParams,
      KeyConditionExpression: "#PK = :pk AND #SK BETWEEN :start AND :end",
      ProjectionExpression: "#SK,#Time,#Seconds,#Rank",
      ExpressionAttributeValues: {
        ":pk": { S: `SCORE#${name}` },
        ":start": { S: `DATE#${start}` },
        ":end": { S: `DATE#${end}` },
      },
    });

    const output = await this.client.send(command);
    return output.Items?.map((item) => unmarshall(item)) ?? [];
  };

  fetchRatingsInDateRange = async (start: string, end: string) => {
    const year = start.slice(0, 4);

    const command = new QueryCommand({
      TableName,
      IndexName: "GSI1",
      KeyConditionExpression: "#PK = :pk AND #SK BETWEEN :start AND :end",
      ProjectionExpression: "#SK,#Name,#Mu,#Sigma,#Eta",
      ExpressionAttributeNames: {
        "#PK": "GSI1PK",
        "#SK": "GSI1SK",
        "#Name": "PK",
        "#Mu": "Mu",
        "#Sigma": "Sigma",
        "#Eta": "Eta",
      },
      ExpressionAttributeValues: {
        ":pk": { S: `YEAR#${year}` },
        ":start": { S: `DATE#${start}` },
        ":end": { S: `DATE#${end}` },
      },
    });

    const output = await this.client.send(command);
    return output.Items?.map((item) => unmarshall(item)) ?? [];
  };

  fetchLeaderboardByDate = async (date: string) => {
    const year = date.slice(0, 4);

    const command = new QueryCommand({
      TableName,
      IndexName: "GSI1",
      KeyConditionExpression: "#PK = :pk AND #SK = :sk",
      ProjectionExpression: "#Name,#Time,#Rank,#Seconds",
      ExpressionAttributeNames: {
        "#PK": "GSI1PK",
        "#SK": "GSI1SK",
        "#Name": "PK",
        "#Time": "Time",
        "#Rank": "Rank",
        "#Seconds": "Seconds",
      },
      ExpressionAttributeValues: {
        ":pk": { S: `YEAR#${year}` },
        ":sk": { S: `DATE#${date}` },
      },
    });

    const output = await this.client.send(command);
    return output.Items?.map((item) => unmarshall(item)) ?? [];
  };
}
