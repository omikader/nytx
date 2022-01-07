import { gql } from "@apollo/client";

export interface GetHistory_history_score {
  name: string;
  time: number;
}

export interface GetHistory_history {
  date: string;
  scores: GetHistory_history_score[];
}

export interface GetHistory {
  history: GetHistory_history[];
}

export const HISTORY = gql`
  query GetHistory($start: String!, $end: String) {
    history(start: $start, end: $end) {
      date
      scores {
        name
        time
      }
    }
  }
`;
