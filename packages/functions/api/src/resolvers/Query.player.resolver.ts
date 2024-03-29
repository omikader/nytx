import { first, last, meanBy, orderBy } from "lodash";

import { QueryResolvers } from "./types";
import { START, ZONE, parseKey, toHHMMSS } from "../util";

export const player: QueryResolvers["player"] = async (
  _,
  { name, excludeMidis },
  { dataSources }
) => {
  const end = new Date().toLocaleDateString("en-CA", { timeZone: ZONE });

  const [player, scores] = await Promise.all([
    dataSources.dynamoAPI.fetchPlayerByName(name),
    dataSources.dynamoAPI.fetchPlayerScoresInDateRange({
      name,
      start: START,
      end,
      excludeMidis,
    }),
  ]);

  const averageTime = meanBy(scores, "Seconds");
  const sortedScores = orderBy(scores, "Seconds");
  const bestScore = first(sortedScores);
  const worstScore = last(sortedScores);
  const sk = excludeMidis ? "GSI2SK" : "SK";

  return {
    name,
    lastPlay: player?.LastPlay,
    gamesPlayed: player?.Total ?? 0,
    streak: player?.Streak ?? 0,
    maxStreak: player?.MaxStreak ?? 0,
    ...(averageTime && { averageTime: toHHMMSS(averageTime) }),
    ...(bestScore && {
      bestScore: {
        name,
        date: parseKey(bestScore[sk]),
        time: bestScore.Time,
        rank: bestScore.Rank,
        seconds: bestScore.Seconds,
      },
    }),
    ...(worstScore && {
      worstScore: {
        name,
        date: parseKey(worstScore[sk]),
        time: worstScore.Time,
        rank: worstScore.Rank,
        seconds: worstScore.Seconds,
      },
    }),
  };
};
