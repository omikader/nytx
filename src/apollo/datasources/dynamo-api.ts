import {
  BatchGetItemCommand,
  DynamoDBClient,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { DataSource } from "apollo-datasource";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export default class DynamoAPI extends DataSource {
  readonly client: DynamoDBClient;

  constructor() {
    super();
    this.client = new DynamoDBClient({ region: process.env.AWS_REGION });
  }

  fetchUsers = async () => {
    const command = new ScanCommand({ TableName: process.env.USERS_TABLE });
    const output = await this.client.send(command);
    return output.Items?.map((item) => unmarshall(item)) || [];
  };

  fetchUserScores = async (name: string) => {
    const command = new QueryCommand({
      TableName: process.env.SCORES_TABLE,
      KeyConditionExpression: "#n = :name",
      ExpressionAttributeNames: {
        "#n": "name",
      },
      ExpressionAttributeValues: {
        ":name": { S: name },
      },
    });

    const output = await this.client.send(command);
    return output.Items?.map((item) => unmarshall(item)) || [];
  };

  fetchUserScoresInDateRange = async (
    name: string,
    start: string,
    end: string
  ) => {
    const command = new QueryCommand({
      TableName: process.env.SCORES_TABLE,
      KeyConditionExpression: "#n = :name AND #d BETWEEN :start AND :end",
      ExpressionAttributeNames: {
        "#n": "name",
        "#d": "date",
      },
      ExpressionAttributeValues: {
        ":name": { S: name },
        ":start": { S: start },
        ":end": { S: end },
      },
    });

    const output = await this.client.send(command);
    return output.Items?.map((item) => unmarshall(item)) || [];
  };

  fetchScoresInDateRange = async (year: string, start: string, end: string) => {
    const command = new QueryCommand({
      TableName: process.env.SCORES_TABLE,
      IndexName: "yearDateIndex",
      KeyConditionExpression: "#y = :year AND #d BETWEEN :start AND :end",
      ExpressionAttributeNames: {
        "#y": "year",
        "#d": "date",
      },
      ExpressionAttributeValues: {
        ":year": { N: year },
        ":start": { S: start },
        ":end": { S: end },
      },
    });

    const output = await this.client.send(command);
    return output.Items?.map((item) => unmarshall(item)) || [];
  };

  fetchUserRatings = async (name: string) => {
    const command = new QueryCommand({
      TableName: process.env.RATINGS_TABLE,
      KeyConditionExpression: "#n = :name",
      ExpressionAttributeNames: {
        "#n": "name",
      },
      ExpressionAttributeValues: {
        ":name": { S: name },
      },
    });

    const output = await this.client.send(command);
    return output.Items?.map((item) => unmarshall(item)) || [];
  };

  fetchUserRatingsInDateRange = async (
    name: string,
    start: string,
    end: string
  ) => {
    const command = new QueryCommand({
      TableName: process.env.RATINGS_TABLE,
      KeyConditionExpression: "#n = :name AND #d BETWEEN :start and :end",
      ExpressionAttributeNames: {
        "#n": "name",
        "#d": "date",
      },
      ExpressionAttributeValues: {
        ":name": { S: name },
        ":start": { S: start },
        ":end": { S: end },
      },
    });

    const output = await this.client.send(command);
    return output.Items?.map((item) => unmarshall(item)) || [];
  };

  fetchLatestUserRatings = async (users: { [key: string]: any }[]) => {
    const keys = users.map(({ name, lastPlay }) => {
      return { ["name"]: { S: name }, ["date"]: { S: lastPlay } };
    });

    const command = new BatchGetItemCommand({
      RequestItems: {
        [process.env.RATINGS_TABLE as string]: { Keys: keys },
      },
    });
    const output = await this.client.send(command);
    return output.Responses?.[process.env.RATINGS_TABLE as string] || [];
  };

  countUserFinishesAboveK = async (name: string, rank: number) => {
    const command = new QueryCommand({
      TableName: process.env.SCORES_TABLE,
      KeyConditionExpression: "#n = :name",
      FilterExpression: "#r <= :rank",
      ExpressionAttributeNames: {
        "#n": "name",
        "#r": "rank",
      },
      ExpressionAttributeValues: {
        ":name": { S: name },
        ":rank": { N: rank.toString() },
      },
    });

    const output = await this.client.send(command);
    return output.Count || 0;
  };
}
