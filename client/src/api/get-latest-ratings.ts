import { gql } from "@apollo/client";

export const LATEST_RATINGS = gql`
  query GetLatestRatings {
    latestRatings {
      user {
        name
        gamesPlayed
      }
      date
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
  date: string;
  mu: number;
  sigma: number;
  eta: number;
}
export interface GetLatestRatings_user {
  name: string;
  gamesPlayed: number;
}
