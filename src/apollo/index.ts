import { ApolloServer } from "apollo-server-lambda";

import { DynamoAPI } from "./datasources/dynamo-api";
import { resolvers } from "./resolvers";
import { typeDefs } from "./schema";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    dynamoAPI: new DynamoAPI(),
  }),
});

export const handler = server.createHandler();
