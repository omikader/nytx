import DynamoAPI from "./datasources/dynamo-api";

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

export default resolvers;
