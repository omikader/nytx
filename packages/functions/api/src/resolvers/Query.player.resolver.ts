import { GraphQLError } from "graphql";
import { first, isNull, last, orderBy } from "lodash";

import { QueryResolvers } from "./types";
import { START, ZONE, parseKey } from "../util";

export const player: QueryResolvers["player"] = async (
  _,
  { name, excludeMidis },
  { dataSources }
) => {
  const end = new Date().toLocaleDateString("en-US", { timeZone: ZONE });

  const [player, scores] = await Promise.all([
    dataSources.dynamoAPI.fetchPlayerByName(name),
    dataSources.dynamoAPI.fetchPlayerScoresInDateRange({
      name,
      start: START,
      end,
      excludeMidis,
    }),
  ]);

  if (isNull(player)) {
    throw new GraphQLError("Could not find player");
  }

  const sk = excludeMidis ? "GSI2SK" : "SK";
  const sortedScores = orderBy(scores, "Seconds");
  const bestScore = first(sortedScores);
  const worstScore = last(sortedScores);

  return {
    name,
    lastPlay: player.LastPlay ?? 0,
    gamesPlayed: player.Total ?? 0,
    streak: player.Streak ?? 0,
    maxStreak: player.MaxStreak ?? 0,
    ...(bestScore && {
      bestScore: {
        name,
        date: parseKey(bestScore[sk]),
        time: bestScore.Time,
        rank: bestScore.Rank,
      },
    }),
    ...(worstScore && {
      worstScore: {
        name,
        date: parseKey(worstScore[sk]),
        time: worstScore.Time,
        rank: worstScore.Rank,
      },
    }),
  };
};
