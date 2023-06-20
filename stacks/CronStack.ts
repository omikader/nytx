import { Cron, Function, StackContext, use } from "sst/constructs";

import { ApiKeyStack } from "./ApiKeyStack";
import { DynamoStack } from "./DynamoStack";

export const CronStack = ({ stack }: StackContext) => {
  const { NYT_S } = use(ApiKeyStack);
  const { table } = use(DynamoStack);

  const lambda = new Function(stack, "Lambda", {
    handler: "packages/functions/cron/index.handler",
    runtime: "python3.8",
    bind: [table, NYT_S],
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
