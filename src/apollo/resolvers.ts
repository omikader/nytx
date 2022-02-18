import moment from "moment";

import DynamoAPI from "./datasources/dynamo-api";

interface IDataSources {
  dynamoAPI: DynamoAPI;
}

const resolvers = {
  Query: {
    users: async (
      _: unknown,
      __: unknown,
      { dataSources }: { dataSources: IDataSources }
    ) => {
      const users = await dataSources.dynamoAPI.fetchUsers();
      return users.map(({ name, gamesPlayed, currentStreak, maxStreak }) => {
        return {
          name,
          gamesPlayed,
          currentStreak,
          maxStreak,
        };
      });
    },
    userScores: async (
      _: unknown,
      { name }: { name: string },
      { dataSources }: { dataSources: IDataSources }
    ) => {
      const scores = await dataSources.dynamoAPI.fetchUserMetrics(
        name,
        process.env.SCORES_TABLE
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
    userScoresInDateRange: async (
      _: unknown,
      { name, start, end }: { name: string; start: string; end: string },
      { dataSources }: { dataSources: IDataSources }
    ) => {
      if (start > end) return [];

      const scores = await dataSources.dynamoAPI.fetchUserMetricsInDateRange(
        name,
        start,
        end,
        process.env.SCORES_TABLE
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
    userRatings: async (
      _: unknown,
      { name }: { name: string },
      { dataSources }: { dataSources: IDataSources }
    ) => {
      const ratings = await dataSources.dynamoAPI.fetchUserMetrics(
        name,
        process.env.RATINGS_TABLE
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
    userRatingsInDateRange: async (
      _: unknown,
      { name, start, end }: { name: string; start: string; end: string },
      { dataSources }: { dataSources: IDataSources }
    ) => {
      if (start > end) return [];

      const ratings = await dataSources.dynamoAPI.fetchUserMetricsInDateRange(
        name,
        start,
        end,
        process.env.RATINGS_TABLE
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
    leaderboards: async (
      _: unknown,
      { start, end }: { start: string; end: string },
      { dataSources }: { dataSources: IDataSources }
    ) => {
      if (start > end) return [];

      const scoreQueries = [];
      const ratingQueries = [];
      for (
        let iter = moment(start).startOf("year");
        iter.isBefore(moment(end).endOf("year"));
        iter.add(1, "year")
      ) {
        scoreQueries.push(
          dataSources.dynamoAPI.fetchMetricsInDateRange(
            iter.format("YYYY"),
            start,
            end,
            process.env.SCORES_TABLE
          )
        );
        ratingQueries.push(
          dataSources.dynamoAPI.fetchMetricsInDateRange(
            iter.format("YYYY"),
            start,
            end,
            process.env.RATINGS_TABLE
          )
        );
      }
      return await Promise.all([...scoreQueries, ...ratingQueries]).then(
        (responses) =>
          responses
            .slice(0, responses.length / 2)
            .map((scores, i) =>
              Object.entries(
                scores.reduce((acc, { name, date, time, rank }, j) => {
                  const group = acc[date] || { scores: [], ratings: [] };
                  group.scores.push({
                    user: { name },
                    date,
                    time,
                    rank,
                  });
                  const { mu, sigma, eta } =
                    responses[responses.length / 2 + i][j];
                  group.ratings.push({
                    user: { name },
                    date,
                    mu,
                    sigma,
                    eta,
                  });
                  acc[date] = group;
                  return acc;
                }, {})
              ).map(([date, { scores, ratings }]) => {
                return { date, scores, ratings };
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
        dataSources.dynamoAPI.fetchUserMetrics(name1, process.env.SCORES_TABLE),
        dataSources.dynamoAPI.fetchUserMetrics(name2, process.env.SCORES_TABLE),
      ];
      return await Promise.all(queries).then(([response1, response2]) => {
        let i = 0;
        let j = 0;
        const record = { wins: 0, losses: 0, ties: 0, avg1: 0, avg2: 0 };
        while (i < response1.length && j < response2.length) {
          const score1 = response1[i];
          const score2 = response2[j];
          if (score1.date < score2.date) {
            i++;
          } else if (score1.date > score2.date) {
            j++;
          } else {
            i++, j++;
            record.avg1 += score1.time_s;
            record.avg2 += score2.time_s;
            if (score1.rank < score2.rank) {
              record.wins += 1;
            } else if (score1.rank > score2.rank) {
              record.losses += 1;
            } else {
              record.ties += 1;
            }
          }
        }
        const total = record.wins + record.losses + record.ties;
        record.avg1 /= total;
        record.avg2 /= total;
        return record;
      });
    },
  },
};

export default resolvers;
