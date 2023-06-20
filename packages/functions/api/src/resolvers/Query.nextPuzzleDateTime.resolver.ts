import { DateTime } from "luxon";
import { P, match } from "ts-pattern";

import { QueryResolvers } from "./types";
import { ZONE } from "../util";

export const nextPuzzleDateTime: QueryResolvers["nextPuzzleDateTime"] = () => {
  const now = DateTime.now().setZone(ZONE);

  // ISO weekday, 1-7, where 1 is Monday and 7 is Sunday
  const params = match(now)
    .with({ weekday: P.union(6, 7), hour: P.lt(18) }, () => ({ hour: 18 }))
    .with({ weekday: 6 }, () => ({ weekday: 7, hour: 18 }))
    .with({ weekday: 7 }, ({ weekNumber }) => ({
      weekNumber: weekNumber + 1,
      weekday: 1,
      hour: 22,
    }))
    .with({ hour: P.lt(22) }, () => ({ hour: 22 }))
    .otherwise(({ weekday }) => ({ weekday: weekday + 1, hour: 22 }));

  return DateTime.fromObject(params, { zone: ZONE }).toJSDate();
};
