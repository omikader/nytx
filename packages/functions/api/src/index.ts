import { ApolloServer } from "@apollo/server";
import {
  handlers,
  startServerAndCreateLambdaHandler,
} from "@as-integrations/aws-lambda";

import { IContext, context } from "./datasources";
import { resolvers } from "./resolvers";
import { typeDefs } from "./schema";

const server = new ApolloServer<IContext>({
  typeDefs,
  resolvers,
});

export const handler = startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
  { context }
);
