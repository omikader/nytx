import { QueryResolvers } from "./types";
import { fromHHMMSS } from "../util";

export const activeLeaderboard: QueryResolvers["activeLeaderboard"] = async (
  _,
  __,
  { dataSources }
) => {
  const root = await dataSources.newYorkTimesAPI.fetchLeaderboard();

  const date = root.querySelector(".lbd-type__date")?.innerText;
  if (!date) {
    return [];
  }

  const scores = root.querySelectorAll(".lbd-score");
  return scores.map((score) => {
    const name = score.querySelector(".lbd-score__name")?.innerText ?? "";
    const rank = score.querySelector(".lbd-score__rank")?.innerText ?? "•";
    const time = score.querySelector(".lbd-score__time")?.innerText ?? "--";
    return {
      name: name.substring(0, name.lastIndexOf(" ")),
      date,
      time,
      rank,
      seconds: fromHHMMSS(time),
    };
  });
};
