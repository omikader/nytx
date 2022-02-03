import moment from "moment";

import DynamoAPI from "./datasources/dynamo-api";

interface IDataSources {
  dynamoAPI: DynamoAPI;
}

const resolvers = {
  Query: {
    userScores: async (
      _: unknown,
      { name }: { name: string },
      { dataSources }: { dataSources: IDataSources }
    ) => {
      const scores = await dataSources.dynamoAPI.fetchUserScores(name);

      return scores.map(({ name, date, time, rank }) => {
        return {
          user: { name },
          date,
          time,
          rank,
        };
      });
    },
    userScoresInDateRange: async (
      _: unknown,
      { name, start, end }: { name: string; start: string; end: string },
      { dataSources }: { dataSources: IDataSources }
    ) => {
      if (start > end) return [];

      const scores = await dataSources.dynamoAPI.fetchUserScoresInDateRange(
        name,
        start,
        end
      );

      return scores.map(({ name, date, time, rank }) => {
        return {
          user: { name },
          date,
          time,
          rank,
        };
      });
    },
    leaderboards: async (
      _: unknown,
      { start, end }: { start: string; end: string },
      { dataSources }: { dataSources: IDataSources }
    ) => {
      if (start > end) return [];

      const queries = [];
      for (
        let iter = moment(start).startOf("year");
        iter.isBefore(moment(end).endOf("year"));
        iter.add(1, "year")
      ) {
        queries.push(
          dataSources.dynamoAPI.fetchScoresInDateRange(
            iter.format("YYYY"),
            start,
            end
          )
        );
      }

      return await Promise.all(queries).then((responses) =>
        responses
          .map((scores) =>
            Object.entries(
              scores.reduce((acc, { name, date, time, rank }) => {
                const group = acc[date] || [];
                group.push({ user: { name }, date, time, rank });
                acc[date] = group;
                return acc;
              }, {})
            ).map(([date, scores]) => {
              return { date, scores };
            })
          )
          .flat(1)
      );
    },
    userRatings: async (
      _: unknown,
      { name }: { name: string },
      { dataSources }: { dataSources: IDataSources }
    ) => {
      const ratings = await dataSources.dynamoAPI.fetchUserRatings(name);

      return ratings.map(({ name, date, mu, sigma, eta }) => {
        return {
          user: { name },
          date,
          mu,
          sigma,
          eta,
        };
      });
    },
    userRatingsInDateRange: async (
      _: unknown,
      { name, start, end }: { name: string; start: string; end: string },
      { dataSources }: { dataSources: IDataSources }
    ) => {
      if (start > end) return [];

      const ratings = await dataSources.dynamoAPI.fetchUserRatingsInDateRange(
        name,
        start,
        end
      );

      return ratings.map(({ name, date, mu, sigma, eta }) => {
        return {
          user: { name },
          date,
          mu,
          sigma,
          eta,
        };
      });
    },
    latestRatings: async (
      _: unknown,
      __: unknown,
      { dataSources }: { dataSources: IDataSources }
    ) => {
      const users = await dataSources.dynamoAPI.fetchUsers();
      const ratings = await dataSources.dynamoAPI.fetchLatestUserRatings(users);

      return users.map(({ name, gamesPlayed, lastPlay }) => {
        const rating = ratings.find((rating) => rating.name.S === name)!;
        return {
          user: {
            name,
            gamesPlayed,
          },
          date: lastPlay,
          mu: rating.mu.N,
          sigma: rating.sigma.N,
          eta: rating.eta.N,
        };
      });
    },
    ratings: async (
      _: unknown,
      { start, end }: { start: string; end: string },
      { dataSources }: { dataSources: IDataSources }
    ) => {
      if (start > end) return [];

      const queries = [];
      for (
        let iter = moment(start).startOf("year");
        iter.isBefore(moment(end).endOf("year"));
        iter.add(1, "year")
      ) {
        queries.push(
          dataSources.dynamoAPI.fetchRatingsInDateRange(
            iter.format("YYYY"),
            start,
            end
          )
        );
      }

      return await Promise.all(queries).then((responses) =>
        responses
          .map((ratings) =>
            ratings.map(({ name, date, mu, sigma, eta }) => {
              return {
                user: { name },
                date,
                mu,
                sigma,
                eta,
              };
            })
          )
          .flat(1)
      );
    },
    countUserFinishesAboveK: async (
      _: unknown,
      { name, rank }: { name: string; rank: number },
      { dataSources }: { dataSources: IDataSources }
    ) => {
      return await dataSources.dynamoAPI.countUserFinishesAboveK(name, rank);
    },
    headToHeadRecord: async (
      _: unknown,
      { name1, name2 }: { name1: string; name2: string },
      { dataSources }: { dataSources: IDataSources }
    ) => {
      const queries = [
        dataSources.dynamoAPI.fetchUserScores(name1),
        dataSources.dynamoAPI.fetchUserScores(name2),
      ];

      return await Promise.all(queries).then(([response1, response2]) => {
        let i = 0;
        let j = 0;
        const record = { wins: 0, losses: 0, ties: 0 };

        while (i < response1.length && j < response2.length) {
          const score1 = response1[i];
          const score2 = response2[j];
          if (score1.date < score2.date) {
            i++;
          } else if (score1.date > score2.date) {
            j++;
          } else {
            i++, j++;
            if (score1.rank < score2.rank) {
              record.wins += 1;
            } else if (score1.rank > score2.rank) {
              record.losses += 1;
            } else {
              record.ties += 1;
            }
          }
        }

        return record;
      });
    },
  },
};

export default resolvers;
