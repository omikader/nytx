import { DateTime } from "luxon";
import { P, match } from "ts-pattern";

import { QueryResolvers } from "./types";
import { ZONE } from "../util";

export const nextPuzzleDateTime: QueryResolvers["nextPuzzleDateTime"] = () => {
  const now = DateTime.now().setZone(ZONE);

  // ISO weekday, 1-7, where 1 is Monday and 7 is Sunday
  const params = match({ weekday: now.weekday, time: now.toFormat("HH:mm") })
    .with({ weekday: P.union(6, 7), time: P.when((t) => t < "18:00") }, () => ({
      hour: 18,
    }))
    .with({ weekday: 6 }, () => ({
      weekday: 7,
      hour: 18,
    }))
    .with({ weekday: 7 }, () => ({
      weekNumber: now.weekNumber + 1,
      weekday: 1,
      hour: 22,
    }))
    .with({ time: P.when((t) => t < "22:00") }, () => ({
      hour: 22,
    }))
    .otherwise(({ weekday }) => ({
      weekday: weekday + 1,
      hour: 22,
    }));

  return DateTime.fromObject(params, { zone: ZONE }).toJSDate();
};
