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

export const LEADERBOARDS = gql`
  query GetLeaderboards($start: String!, $end: String!) {
    leaderboards(start: $start, end: $end) {
      date
      ratings {
        user {
          name
        }
        eta
      }
    }
  }
`;

export interface GetLeaderboards {
  leaderboards: GetLeaderboards_leaderboard[];
}

export interface GetLeaderboards_leaderboard {
  date: string;
  ratings: GetLeaderboards_rating[];
}

export interface GetLeaderboards_rating {
  user: GetLeaderboards_user;
  eta: number;
}

export interface GetLeaderboards_user {
  name: string;
}
