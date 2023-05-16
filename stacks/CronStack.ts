import { Cron, Function, StackContext, use } from "sst/constructs";

import { ApiKeyStack } from "./ApiKeyStack";
import { DynamoStack } from "./DynamoStack";

export const CronStack = ({ stack }: StackContext) => {
  const { usersTable, scoresTable, ratingsTable } = use(DynamoStack);
  const { NYT_S } = use(ApiKeyStack);

  const lambda = new Function(stack, "Lambda", {
    handler: "packages/functions/cron/index.handler",
    runtime: "python3.8",
    bind: [usersTable, scoresTable, ratingsTable, NYT_S],
    // https://stackoverflow.com/questions/65653103/aws-system-manager-getparameters-permission-being-implicitly-denied/71949841#71949841
    permissions: ["kms:Decrypt"],
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
