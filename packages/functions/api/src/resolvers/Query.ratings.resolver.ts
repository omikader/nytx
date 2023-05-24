import { DateTime } from "luxon";
import { isNull } from "lodash";

import { QueryResolvers } from "./types";
import { ZONE, parseKey } from "../util";

export const ratings: QueryResolvers["ratings"] = async (
  _,
  __,
  { dataSources }
) => {
  const now = DateTime.now().setZone(ZONE);
  const start = now.startOf("month").toISODate();
  const end = now.endOf("month").toISODate();

  if (isNull(start) || isNull(end)) {
    return [];
  }

  const ratings = await dataSources.dynamoAPI.fetchRatingsInDateRange(
    start,
    end
  );

  return ratings.map((rating) => ({
    name: parseKey(rating.PK),
    date: parseKey(rating.GSI1SK),
    mu: rating.Mu,
    sigma: rating.Sigma,
    eta: rating.Eta,
  }));
};
