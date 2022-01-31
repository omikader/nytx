import { App } from "@serverless-stack/resources";

import ApiKeyStack from "./ApiKeyStack";
import ApolloStack from "./ApolloStack";
import ClientStack from "./ClientStack";
import CronStack from "./CronStack";
import DynamoStack from "./DynamoStack";

export default function main(app: App): void {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: "nodejs14.x",
  });

  const apiKeyStack = new ApiKeyStack(app, "ApiKeyStack");

  const dynamoStack = new DynamoStack(app, "DynamoStack");

  new CronStack(app, "CronStack", {
    usersTable: dynamoStack.usersTable,
    scoresTable: dynamoStack.scoresTable,
    ratingsTable: dynamoStack.ratingsTable,
    apikey: apiKeyStack.apikey,
  });

  const apiStack = new ApolloStack(app, "ApolloStack", {
    usersTable: dynamoStack.usersTable,
    scoresTable: dynamoStack.scoresTable,
    ratingsTable: dynamoStack.ratingsTable,
  });

  new ClientStack(app, "ClientStack", {
    api: apiStack.api,
  });
}
