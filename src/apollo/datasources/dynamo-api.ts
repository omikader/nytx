import { DataSource } from "apollo-datasource";
import {
  DynamoDBClient,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export default class DynamoAPI extends DataSource {
  readonly client: DynamoDBClient;

  constructor() {
    super();
    this.client = new DynamoDBClient({ region: process.env.AWS_REGION });
  }

  fetchHistory = async (start: string, end?: string) => {
    const parsedEnd = end || new Date().toLocaleDateString("en-CA");
    if (start > parsedEnd) return [];

    const command = new ScanCommand({
      TableName: process.env.SCORES_TABLE,
      FilterExpression: "#dt BETWEEN :start AND :end",
      ExpressionAttributeNames: { "#dt": "date" },
      ExpressionAttributeValues: {
        ":start": { S: start },
        ":end": { S: parsedEnd },
      },
    });

    const output = await this.client.send(command);
    return output.Items?.map((item) => unmarshall(item)) || [];
  };

  fetchUserHistory = async (name: string, start: string, end?: string) => {
    const parsedEnd = end || new Date().toLocaleDateString("en-CA");
    if (start > parsedEnd) return [];

    const command = new QueryCommand({
      TableName: process.env.SCORES_TABLE,
      KeyConditionExpression: "#n = :name AND #dt BETWEEN :start AND :end",
      ExpressionAttributeNames: { "#n": "name", "#dt": "date" },
      ExpressionAttributeValues: {
        ":name": { S: name },
        ":start": { S: start },
        ":end": { S: parsedEnd },
      },
    });

    const output = await this.client.send(command);
    return output.Items?.map((item) => unmarshall(item)) || [];
  };
}
