import { Config } from "sst/node/config";
import { parse } from "node-html-parser";

export class NewYorkTimesAPI {
  fetchLeaderboard = async () => {
    const response = await fetch(
      "https://www.nytimes.com/puzzles/leaderboards",
      { headers: { cookie: `NYT-S=${Config["NYT-S"]}` } }
    );

    return parse(await response.text());
  };
}
