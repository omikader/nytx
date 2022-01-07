import { ApolloServer } from "apollo-server-lambda";

import DynamoAPI from "./datasources/dynamo-api";
import { typeDefs } from "./schema";

interface IDataSources {
  dynamoAPI: DynamoAPI;
}

const resolvers = {
  Query: {
    history: async (
      _: unknown,
      { start, end }: { start: string; end?: string },
      { dataSources }: { dataSources: IDataSources }
    ) => {
      const response = await dataSources.dynamoAPI.fetchHistory(start, end);
      const groupByDate = response.reduce((acc, item) => {
        const scores = acc[item.date] || [];
        scores.push({ name: item.name, time: item.time });
        acc[item.date] = scores;
        return acc;
      }, {});

      return Object.entries(groupByDate).map(([date, scores]) => {
        return { date, scores };
      });
    },
    userHistory: async (
      _: unknown,
      { name, start, end }: { name: string; start: string; end?: string },
      { dataSources }: { dataSources: IDataSources }
    ) => {
      const response = await dataSources.dynamoAPI.fetchUserHistory(
        name,
        start,
        end
      );

      return response.map(({ date, ...scoreKeys }) => {
        return { date, scores: [scoreKeys] };
      });
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    dynamoAPI: new DynamoAPI(process.env.TABLE_NAME as string),
  }),
});

export const handler = server.createHandler();
