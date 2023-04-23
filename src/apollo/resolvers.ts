import moment from "moment";
import { Table } from "@serverless-stack/node/table";

import { DynamoAPI } from "./datasources/dynamo-api";

const { Scores, Ratings } = Table;

interface IDataSources {
  dynamoAPI: DynamoAPI;
}

export const resolvers = {
  Query: {
    users: async (
      _: unknown,
      __: unknown,
      { dataSources }: { dataSources: IDataSources }
    ) => {
      const users = await dataSources.dynamoAPI.fetchUsers();
      return users.map(({ name, gamesPlayed, currentStreak, maxStreak }) => ({
        name,
        gamesPlayed,
        currentStreak,
        maxStreak,
      }));
    },
    userScores: async (
      _: unknown,
      { name }: { name: string },
      { dataSources }: { dataSources: IDataSources }
    ) => {
      const scores = await dataSources.dynamoAPI.fetchUserMetrics(
        name,
        Scores.tableName
      );
      return scores.map(({ name, date, time, rank }) => ({
        user: { name },
        date,
        time,
        rank,
      }));
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
        Scores.tableName
      );
      return scores.map(({ name, date, time, rank }) => ({
        user: { name },
        date,
        time,
        rank,
      }));
    },
    userRatings: async (
      _: unknown,
      { name }: { name: string },
      { dataSources }: { dataSources: IDataSources }
    ) => {
      const ratings = await dataSources.dynamoAPI.fetchUserMetrics(
        name,
        Ratings.tableName
      );
      return ratings.map(({ name, date, mu, sigma, eta }) => ({
        user: { name },
        date,
        mu,
        sigma,
        eta,
      }));
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
        Ratings.tableName
      );
      return ratings.map(({ name, date, mu, sigma, eta }) => ({
        user: { name },
        date,
        mu,
        sigma,
        eta,
      }));
    },
    latestRatings: async (
      _: unknown,
      __: unknown,
      { dataSources }: { dataSources: IDataSources }
    ) => {
      const users = await dataSources.dynamoAPI.fetchUsers();
      const ratings = await dataSources.dynamoAPI.fetchLatestUserRatings(users);
      return users.map(
        ({ name, gamesPlayed, lastPlay, currentStreak, maxStreak }) => {
          const rating = ratings.find((rating) => rating.name.S === name)!;
          return {
            user: {
              name,
              gamesPlayed,
              currentStreak,
              maxStreak,
            },
            date: lastPlay,
            mu: rating.mu.N,
            sigma: rating.sigma.N,
            eta: rating.eta.N,
          };
        }
      );
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
            Scores.tableName
          )
        );
        ratingQueries.push(
          dataSources.dynamoAPI.fetchMetricsInDateRange(
            iter.format("YYYY"),
            start,
            end,
            Ratings.tableName
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
              ).map(([date, { scores, ratings }]) => ({
                date,
                scores,
                ratings,
              }))
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
        dataSources.dynamoAPI.fetchUserMetrics(name1, Scores.tableName),
        dataSources.dynamoAPI.fetchUserMetrics(name2, Scores.tableName),
      ];
      return await Promise.all(queries).then(([response1, response2]) => {
        let i = 0;
        let j = 0;
        const record = {
          wins: 0,
          losses: 0,
          ties: 0,
          stats1: { avg: 0, first: 0, second: 0, third: 0 },
          stats2: { avg: 0, first: 0, second: 0, third: 0 },
        };
        while (i < response1.length && j < response2.length) {
          const score1 = response1[i];
          const score2 = response2[j];
          if (score1.date < score2.date) {
            i++;
          } else if (score1.date > score2.date) {
            j++;
          } else {
            i++, j++;
            record.stats1.avg += score1.time_s;
            record.stats2.avg += score2.time_s;
            if (score1.rank === 1) record.stats1.first += 1;
            if (score1.rank === 2) record.stats1.second += 1;
            if (score1.rank === 3) record.stats1.third += 1;
            if (score2.rank === 1) record.stats2.first += 1;
            if (score2.rank === 2) record.stats2.second += 1;
            if (score2.rank === 3) record.stats2.third += 1;
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
        if (total > 0) {
          record.stats1.avg /= total;
          record.stats2.avg /= total;
        }
        return record;
      });
    },
  },
};
