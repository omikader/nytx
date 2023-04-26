import { Cron, Function, StackContext, use } from "@serverless-stack/resources";

import { ApiKeyStack } from "./ApiKeyStack";
import { DynamoStack } from "./DynamoStack";

export const CronStack = ({ stack }: StackContext) => {
  const { usersTable, scoresTable, ratingsTable } = use(DynamoStack);
  const { apikey } = use(ApiKeyStack);

  const lambda = new Function(stack, "Lambda", {
    srcPath: "packages/functions/cron",
    handler: "index.handler",
    runtime: "python3.8",
    bind: [usersTable, scoresTable, ratingsTable],
    environment: {
      USERS_TABLE: usersTable.tableName,
      SCORES_TABLE: scoresTable.tableName,
      RATINGS_TABLE: ratingsTable.tableName,
      NYTX: apikey.secretValue.toString(),
    },
  });

  new Cron(stack, "WeekdayCron", {
    schedule: "cron(55 1 ? * TUE-SAT *)",
    job: lambda,
  });

  new Cron(stack, "WeekendCron", {
    schedule: "cron(55 21 ? * SAT-SUN *)",
    job: lambda,
  });
};
