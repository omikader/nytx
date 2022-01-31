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
  usersTable: Table;
  scoresTable: Table;
  ratingsTable: Table;
  apikey: ISecret;
}

export default class CronStack extends Stack {
  constructor(scope: App, id: string, props?: CronStackProps) {
    super(scope, id, props);

    const { usersTable, scoresTable, ratingsTable, apikey } = props!;

    const lambda = new Function(this, "Lambda", {
      srcPath: "src/cron",
      handler: "index.handler",
      runtime: "python3.8",
      environment: {
        USERS_TABLE: usersTable.tableName,
        SCORES_TABLE: scoresTable.tableName,
        RATINGS_TABLE: ratingsTable.tableName,
        NYTX: apikey.secretValue.toString(),
      },
    });

    // Allow the lambda to access the tables
    lambda.attachPermissions([
      [usersTable.dynamodbTable, "grantReadWriteData"],
      [scoresTable.dynamodbTable, "grantWriteData"],
      [ratingsTable.dynamodbTable, "grantReadWriteData"],
    ]);

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
