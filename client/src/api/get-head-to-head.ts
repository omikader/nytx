import { gql } from "@apollo/client";

export const HEAD2HEAD = gql`
  query GetHeadToHeadRecord($name1: String!, $name2: String!) {
    headToHeadRecord(name1: $name1, name2: $name2) {
      wins
      losses
      ties
    }
  }
`;

export interface GetHead2Head {
  headToHeadRecord: GetHead2Head_record;
}

export interface GetHead2Head_record {
  wins: number;
  losses: number;
  ties: number;
}