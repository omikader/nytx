import { gql } from "apollo-server-lambda";

export const typeDefs = gql`
  type Query {
    "Query for fetching all puzzle results within a date range"
    history(start: String!, end: String): [Leaderboard]!
    "Query for fetching all puzzle results for a specific user within a date range"
    userHistory(name: String!, start: String!, end: String): [Leaderboard]!
  }

  "A leaderboard has a the puzzle results for a given date"
  type Leaderboard {
    "the date of the puzzle, in YYYY-MM-DD form"
    date: String!
    "the list of completed scores for that puzzle"
    scores: [Score]!
  }

  "A score is a user's name and time for a given puzzle"
  type Score {
    "the name of the user"
    name: String!
    "the completion time, in seconds"
    time: Int!
  }
`;
