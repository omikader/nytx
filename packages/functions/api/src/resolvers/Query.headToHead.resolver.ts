import { size } from "lodash";

import { QueryResolvers } from "./types";
import { START, ZONE, toHHMMSS } from "../util";

export const headToHead: QueryResolvers["headToHead"] = async (
  _,
  { name1, name2, excludeMidis },
  { dataSources }
) => {
  const end = new Date().toLocaleDateString("en-US", { timeZone: ZONE });
  const params = { start: START, end, excludeMidis };

  const [scores1, scores2] = await Promise.all([
    dataSources.dynamoAPI.fetchPlayerScoresInDateRange({
      name: name1,
      ...params,
    }),
    dataSources.dynamoAPI.fetchPlayerScoresInDateRange({
      name: name2,
      ...params,
    }),
  ]);

  const sk = excludeMidis ? "GSI2SK" : "SK";

  let i = 0;
  let j = 0;
  let wins = 0;
  let ties = 0;
  let losses = 0;
  let avg1 = 0;
  let avg2 = 0;

  while (i < size(scores1) && j < size(scores2)) {
    const score1 = scores1[i];
    const score2 = scores2[j];

    if (score1[sk] < score2[sk]) {
      i++;
    } else if (score1[sk] > score2[sk]) {
      j++;
    } else {
      i++;
      j++;

      avg1 += score1.Seconds;
      avg2 += score2.Seconds;
      if (score1.Rank < score2.Rank) {
        wins += 1;
      } else if (score1.Rank > score2.Rank) {
        losses += 1;
      } else {
        ties += 1;
      }
    }
  }

  const commonGamesPlayed = wins + ties + losses;
  if (commonGamesPlayed > 0) {
    avg1 /= commonGamesPlayed;
    avg2 /= commonGamesPlayed;
  }

  return {
    wins,
    losses,
    ties,
    stats1: { avg: toHHMMSS(avg1) },
    stats2: { avg: toHHMMSS(avg2) },
  };
};
