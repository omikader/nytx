import gql from "graphql-tag";

export const typeDefs = gql`
  scalar DateTime

  type Query {
    activeLeaderboard: [Score!]!
    headToHead(name1: String!, name2: String!, excludeMidis: Boolean!): Series!
    leaderboard(date: String!): [Score!]!
    nextPuzzleDateTime: DateTime!
    player(name: String!, excludeMidis: Boolean!): Player!
    ratings: [Rating!]!
  }

  type Player {
    name: String!
    lastPlay: String
    gamesPlayed: Int!
    streak: Int!
    maxStreak: Int!
    bestScore: Score
    worstScore: Score
    averageTime: String
  }

  type Score {
    name: String!
    date: String!
    time: String!
    rank: String!
    seconds: Int!
  }

  type Rating {
    name: String!
    date: String!
    mu: Float!
    sigma: Float!
    eta: Float!
  }

  type Series {
    wins: Int!
    losses: Int!
    ties: Int!
    stats1: Stats!
    stats2: Stats!
  }

  type Stats {
    avg: String!
  }
`;
