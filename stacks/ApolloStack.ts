import {
  ApolloApi,
  App,
  Stack,
  StackProps,
  Table,
} from "@serverless-stack/resources";

export interface ApolloStackProps extends StackProps {
  usersTable: Table;
  scoresTable: Table;
  ratingsTable: Table;
}

export default class ApolloStack extends Stack {
  readonly api;

  constructor(scope: App, id: string, props?: ApolloStackProps) {
    super(scope, id, props);

    const { usersTable, scoresTable, ratingsTable } = props!;

    this.api = new ApolloApi(this, "ApolloApi", {
      customDomain:
        scope.stage === "prod"
          ? { domainName: "api.nytx.omikader.com", hostedZone: "omikader.com" }
          : undefined,
      defaultFunctionProps: {
        environment: {
          USERS_TABLE: usersTable.tableName,
          SCORES_TABLE: scoresTable.tableName,
          RATINGS_TABLE: ratingsTable.tableName,
        },
      },
      server: "src/apollo/index.handler",
    });

    // Allow the API to access the tables
    this.api.attachPermissions([
      [usersTable.dynamodbTable, "grantReadData"],
      [scoresTable.dynamodbTable, "grantReadData"],
      [ratingsTable.dynamodbTable, "grantReadData"],
    ]);

    // Show the API endpoint in the output
    this.addOutputs({ ApiEndpoint: this.api.customDomainUrl || this.api.url });
  }
}
