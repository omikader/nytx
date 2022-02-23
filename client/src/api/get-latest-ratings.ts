import { gql } from "@apollo/client";

export const LATEST_RATINGS = gql`
  query GetLatestRatings {
    latestRatings {
      user {
        name
        gamesPlayed
        currentStreak
        maxStreak
      }
      mu
      sigma
      eta
    }
  }
`;

export interface GetLatestRatings {
  latestRatings: GetLatestRatings_rating[];
}

export interface GetLatestRatings_rating {
  user: GetLatestRatings_user;
  mu: number;
  sigma: number;
  eta: number;
}
export interface GetLatestRatings_user {
  name: string;
  gamesPlayed: number;
  currentStreak: number;
  maxStreak: number;
}
