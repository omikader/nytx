import { gql } from "@apollo/client";

export interface User {
  name: string;
  gamesPlayed?: number;
}

export interface Rating {
  user: User;
  date: string;
  mu: number;
  sigma: number;
  eta: number;
}

export interface GetRatings {
  ratings: Rating[];
}

export interface GetLatestRatings {
  latestRatings: Rating[];
}

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

export const RATINGS = gql`
  query GetRatings($start: String!, $end: String!) {
    ratings(start: $start, end: $end) {
      user {
        name
      }
      date
      mu
      sigma
      eta
    }
  }
`;
