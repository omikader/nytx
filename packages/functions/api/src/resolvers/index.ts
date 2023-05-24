import { GraphQLDateTime } from "graphql-scalars";

import { Resolvers } from "./types";
import { activeLeaderboard } from "./Query.activeLeaderboard.resolver";
import { headToHead } from "./Query.headToHead.resolver";
import { leaderboard } from "./Query.leaderboard.resolver";
import { nextPuzzleDateTime } from "./Query.nextPuzzleDateTime.resolver";
import { player } from "./Query.player.resolver";
import { ratings } from "./Query.ratings.resolver";

export const resolvers: Resolvers = {
  DateTime: GraphQLDateTime,
  Query: {
    activeLeaderboard,
    headToHead,
    leaderboard,
    nextPuzzleDateTime,
    player,
    ratings,
  },
};
