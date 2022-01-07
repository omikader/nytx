import {
  App,
  Cron,
  Function,
  Stack,
  StackProps,
  Table,
} from "@serverless-stack/resources";
import { ISecret } from "aws-cdk-lib/aws-secretsmanager";

export interface CronStackProps extends StackProps {
  table: Table;
  apikey: ISecret;
}

export default class CronStack extends Stack {
  constructor(scope: App, id: string, props?: CronStackProps) {
    super(scope, id, props);

    const { table, apikey } = props!;

    const lambda = new Function(this, "Lambda", {
      srcPath: "src/cron",
      handler: "index.handler",
      runtime: "python3.8",
      environment: {
        TABLE_NAME: table.tableName,
        NYTX: apikey.secretValue.toString(),
      },
    });

    // Allow the lambda to access the table
    lambda.attachPermissions([table, "grantWriteData"]);

    new Cron(this, "WeekdayCron", {
      schedule: "cron(55 2 ? * TUE-SAT *)",
      job: lambda,
    });

    new Cron(this, "WeekendCron", {
      schedule: "cron(55 22 ? * SAT-SUN *)",
      job: lambda,
    });
  }
}
