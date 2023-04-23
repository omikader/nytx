import { Api, StackContext, use } from "@serverless-stack/resources";

import { DynamoStack } from "./DynamoStack";

export const ApolloStack = ({ app, stack }: StackContext) => {
  const { usersTable, scoresTable, ratingsTable } = use(DynamoStack);

  const api = new Api(stack, "ApolloApi", {
    routes: {
      "POST /": {
        type: "graphql",
        function: "src/apollo/index.handler",
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
