import * as React from "react";
import { useQuery } from "@apollo/client";

import { Error, Spinner } from "../components";
import { PuzzleContextQuery } from "../gql/graphql";
import { graphql } from "../gql";

const PUZZLE_CONTEXT_QUERY_DOCUMENT = graphql(`
  query PuzzleContext {
    nextPuzzleDateTime
    activeLeaderboard {
      name
      date
      time
      rank
    }
  }
`);

interface IProps {
  children: React.ReactNode;
}

export interface PuzzleContextType {
  activeLeaderboard: PuzzleContextQuery["activeLeaderboard"];
  nextPuzzleDateTime: PuzzleContextQuery["nextPuzzleDateTime"];
}

export const PuzzleContext = React.createContext<PuzzleContextType | null>(
  null
);

export const PuzzleProvider = ({ children }: IProps) => {
  const { loading, error, data } = useQuery(PUZZLE_CONTEXT_QUERY_DOCUMENT);

  if (error) {
    return <Error error={error} />;
  }

  if (loading || !data) {
    return <Spinner />;
  }

  return (
    <PuzzleContext.Provider value={{ ...data }}>
      {children}
    </PuzzleContext.Provider>
  );
};
