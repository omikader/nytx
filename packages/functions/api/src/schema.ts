import { gql } from "apollo-server-lambda";

export const typeDefs = gql`
  type Query {
    "Fetch all users"
    users: [User]!
    "Fetch all of a user's scores"
    userScores(name: String!): [Score]!
    "Fetch a user's scores within a YYYY-MM-DD date range"
    userScoresInDateRange(name: String!, start: String!, end: String!): [Score]!
    "Fetch all of a user's ratings"
    userRatings(name: String!): [Rating]!
    "Fetch a user's ratings within a YYYY-MM-DD date range"
    userRatingsInDateRange(
      name: String!
      start: String!
      end: String!
    ): [Rating]!
    "Fetch the latest recorded rating value for all users"
    latestRatings: [Rating]!
    "Fetch all user leaderboards within a YYYY-MM-DD date range"
    leaderboards(start: String!, end: String!): [Leaderboard]!
    "Count the number of times a user finished a rank or better"
    countUserFinishesAboveK(name: String!, rank: Int!): Int!
    "Fetch the head-to-head record between two users"
    headToHeadRecord(name1: String!, name2: String!): Entry!
  }

  "A user represents an entity that solves NYT mini puzzles"
  type User {
    "the name of the user"
    name: String!
    "the number of completed puzzles by the user"
    gamesPlayed: Int
    "the current number of consecutively completed puzzles by the user"
    currentStreak: Int
    "the maximum number of consecutively completed puzzles by the user"
    maxStreak: Int
  }

  "A score is the user data from a given puzzle"
  type Score {
    "the user who achieved the score"
    user: User!
    "the date of the score, in YYYY-MM-DD format"
    date: String!
    "the time to finish the puzzle, as a duration string"
    time: String!
    "the user rank amongst all users who finished the puzzle"
    rank: Int!
  }

  "A rating is the TrueSkill rating for a particular user on a particular date"
  type Rating {
    "the user to which the rating belongs"
    user: User!
    "the date of the rating, in YYYY-MM-DD format"
    date: String!
    "the rating mean"
    mu: Float!
    "the rating uncertainty"
    sigma: Float!
    "the conservative TrueSkill estimate"
    eta: Float!
  }

  "A leaderboard is a collection of all puzzle metrics from a single date"
  type Leaderboard {
    "the puzzle date, in YYYY-MM-DD format"
    date: String!
    "the users scores associated with the puzzle"
    scores: [Score]!
    "the updated user ratings after the puzzle"
    ratings: [Rating]!
  }

  "A record represents the head-to-head standings between name1 and name2"
  type Entry {
    "the number of head-to-head victories for name1"
    wins: Int!
    "the number of head-to-head losses for name1"
    losses: Int!
    "the number of ties between name1 and name2"
    ties: Int!
    "the stats for name1 on all common puzzles"
    stats1: Stats!
    "the stats for name2 on all common puzzles"
    stats2: Stats!
  }

  "Stats are metadata for a particular user on a set of puzzles"
  type Stats {
    "the average time to complete a set of puzzles"
    avg: Float!
    "the number of first place finishes on a set of puzzles"
    first: Int!
    "the number of second place finishes on a set of puzzles"
    second: Int!
    "the number of third place finishes on a set of puzzles"
    third: Int!
  }
`;