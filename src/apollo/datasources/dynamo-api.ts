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

  fetchUserMetrics = async (userName: string, tableName?: string) => {
    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "#n = :name",
      ExpressionAttributeNames: {
        "#n": "name",
      },
      ExpressionAttributeValues: {
        ":name": { S: userName },
      },
    });

    const output = await this.client.send(command);
    return output.Items?.map((item) => unmarshall(item)) || [];
  };

  fetchUserMetricsInDateRange = async (
    userName: string,
    start: string,
    end: string,
    tableName?: string
  ) => {
    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "#n = :name AND #d BETWEEN :start AND :end",
      ExpressionAttributeNames: {
        "#n": "name",
        "#d": "date",
      },
      ExpressionAttributeValues: {
        ":name": { S: userName },
        ":start": { S: start },
        ":end": { S: end },
      },
    });

    const output = await this.client.send(command);
    return output.Items?.map((item) => unmarshall(item)) || [];
  };

  fetchMetricsInDateRange = async (
    year: string,
    start: string,
    end: string,
    tableName?: string
  ) => {
    const command = new QueryCommand({
      TableName: tableName,
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
