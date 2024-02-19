import { QueryResolvers } from "./types";
import { fromHHMMSS } from "../util";

export const activeLeaderboard: QueryResolvers["activeLeaderboard"] = async (
  _,
  __,
  { dataSources }
) => {
  const root = await dataSources.newYorkTimesAPI.fetchLeaderboard();

  const pzContent = root
    .querySelector(".pz-content")
    ?.querySelector("script")?.innerHTML;

  if (!pzContent) {
    return [];
  }

  const data = JSON.parse(pzContent.split(" = ")[1]);
  return data.scoreList.map((score: any) => {
    return {
      name: score.name,
      date: data.displayDate,
      time: score.solveTime ?? "--",
      rank: score.rank ?? "•",
      seconds: fromHHMMSS(score.solveTime),
    };
  });
};
