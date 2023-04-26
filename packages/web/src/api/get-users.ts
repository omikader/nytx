import { gql } from "@apollo/client";

export const USERS = gql`
  query GetUsers {
    users {
      name
      gamesPlayed
      currentStreak
      maxStreak
    }
  }
`;

export interface GetUsers {
  users: GetUsers_user[];
}

export interface GetUsers_user {
  name: string;
  gamesPlayed: number;
  currentStreak: number;
  maxStreak: number;
}
