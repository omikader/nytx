import { Api, StackContext, use } from "sst/constructs";

import { ApiKeyStack } from "./ApiKeyStack";
import { DynamoStack } from "./DynamoStack";

export const ApolloStack = ({ app, stack }: StackContext) => {
  const { NYT_S } = use(ApiKeyStack);
  const { table } = use(DynamoStack);

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
        bind: [table, NYT_S],
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
