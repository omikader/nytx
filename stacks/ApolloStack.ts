import {
  ApolloApi,
  App,
  Stack,
  StackProps,
  Table,
} from "@serverless-stack/resources";

export interface ApolloStackProps extends StackProps {
  table: Table;
}

export default class ApolloStack extends Stack {
  readonly api;

  constructor(scope: App, id: string, props?: ApolloStackProps) {
    super(scope, id, props);

    const { table } = props!;

    this.api = new ApolloApi(this, "ApolloApi", {
      customDomain:
        scope.stage === "prod"
          ? { domainName: "api.nytx.omikader.com", hostedZone: "omikader.com" }
          : undefined,
      defaultFunctionProps: {
        environment: {
          TABLE_NAME: table.tableName,
        },
      },
      server: "src/apollo/index.handler",
    });

    // Allow the API to access the table
    this.api.attachPermissions([table, "grantReadData"]);

    // Show the API endpoint in the output
    this.addOutputs({ ApiEndpoint: this.api.customDomainUrl || this.api.url });
  }
}
