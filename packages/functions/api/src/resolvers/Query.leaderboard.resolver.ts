import { QueryResolvers } from "./types";
import { parseKey } from "../util";

export const leaderboard: QueryResolvers["leaderboard"] = async (
  _,
  { date },
  { dataSources }
) => {
  const scores = await dataSources.dynamoAPI.fetchLeaderboardByDate(date);
  return scores
    .sort((a, b) => a.Rank - b.Rank || a.PK - b.PK)
    .map((score) => ({
      name: parseKey(score.PK),
      date,
      time: score.Time,
      rank: score.Rank,
      seconds: score.Seconds,
    }));
};
