import { GraphQLApi, StackContext, use } from "@serverless-stack/resources";

import { DynamoStack } from "./DynamoStack";

export const ApolloStack = ({ app, stack }: StackContext) => {
  const { usersTable, scoresTable, ratingsTable } = use(DynamoStack);

  const api = new GraphQLApi(stack, "ApolloApi", {
    server: "src/apollo/index.handler",
    defaults: {
      function: {
        environment: {
          USERS_TABLE: usersTable.tableName,
          SCORES_TABLE: scoresTable.tableName,
          RATINGS_TABLE: ratingsTable.tableName,
        },
      },
    },
    ...(app.stage === "prod" && {
      customDomain: {
        domainName: "api.nytx.omikader.com",
        hostedZone: "omikader.com",
      },
    }),
  });

  // Allow the API to access the tables
  // Attached separately due to https://github.com/serverless-stack/sst/issues/1832
  api.attachPermissions([usersTable, "grantReadData"]);
  api.attachPermissions([scoresTable, "grantReadData"]);
  api.attachPermissions([ratingsTable, "grantReadData"]);

  stack.addOutputs({ ApiEndpoint: api.customDomainUrl ?? api.url });

  return { api };
};
