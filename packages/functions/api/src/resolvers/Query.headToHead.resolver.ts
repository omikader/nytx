import { intersectionBy, zipWith } from "lodash";

import { QueryResolvers } from "./types";
import { START, ZONE } from "../util";

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
  const commonScores1 = intersectionBy(scores1, scores2, sk);
  const commonScores2 = intersectionBy(scores2, scores1, sk);

  return zipWith(
    commonScores1,
    commonScores2,
    ({ Rank: rank1 }, { Rank: rank2 }) => ({ rank1, rank2 })
  ).reduce(
    (acc, { rank1, rank2 }) => {
      if (rank1 < rank2) return { ...acc, wins: acc.wins + 1 };
      if (rank1 > rank2) return { ...acc, losses: acc.losses + 1 };
      return { ...acc, ties: acc.ties + 1 };
    },
    { wins: 0, losses: 0, ties: 0 }
  );
};
