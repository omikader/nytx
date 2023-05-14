import { ApolloServer } from "@apollo/server";
import {
  handlers,
  startServerAndCreateLambdaHandler,
} from "@as-integrations/aws-lambda";

import { DynamoAPI } from "./datasources/dynamo-api";
import { resolvers } from "./resolvers";
import { typeDefs } from "./schema";

export interface IContext {
  dataSources: {
    dynamoAPI: DynamoAPI;
  };
}

const server = new ApolloServer<IContext>({
  typeDefs,
  resolvers,
});

export const handler = startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
  {
    context: async () => {
      return {
        dataSources: {
          dynamoAPI: new DynamoAPI(),
        },
      };
    },
  }
);
