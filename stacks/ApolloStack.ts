import { Api, StackContext, use } from "sst/constructs";

import { DynamoStack } from "./DynamoStack";

export const ApolloStack = ({ app, stack }: StackContext) => {
  const { usersTable, scoresTable, ratingsTable } = use(DynamoStack);

  // 'GET /' route needed for Apollo Studio
  const api = new Api(stack, "ApolloApi", {
    routes: {
      "GET /": {
        type: "graphql",
        function: "packages/functions/api/src/index.handler",
      },
      "POST /": {
        type: "graphql",
        function: "packages/functions/api/src/index.handler",
      },
    },
    defaults: {
      function: {
        bind: [usersTable, scoresTable, ratingsTable],
      },
    },
    ...(app.stage === "prod" && {
      customDomain: {
        domainName: "api.nytx.omikader.com",
        hostedZone: "omikader.com",
      },
    }),
  });

  stack.addOutputs({ ApiEndpoint: api.customDomainUrl ?? api.url });

  return { api };
};
