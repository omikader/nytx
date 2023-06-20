import * as React from "react";
import { ApolloQueryResult, useQuery } from "@apollo/client";

import { ApolloErrorToast, Spinner } from "../components";
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

export interface PuzzleContextType {
  activeLeaderboard: PuzzleContextQuery["activeLeaderboard"];
  nextPuzzleDateTime: PuzzleContextQuery["nextPuzzleDateTime"];
  refetch: () => Promise<ApolloQueryResult<PuzzleContextQuery>>;
}

export const PuzzleContext = React.createContext<PuzzleContextType | null>(
  null
);

interface IProps {
  children: React.ReactNode;
}

export const PuzzleProvider = ({ children }: IProps) => {
  const { loading, error, data, refetch } = useQuery(
    PUZZLE_CONTEXT_QUERY_DOCUMENT,
    { fetchPolicy: "no-cache" }
  );

  if (error) {
    return <ApolloErrorToast error={error} />;
  }

  if (loading || !data) {
    return (
      <div className="flex h-screen justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <PuzzleContext.Provider value={{ ...data, refetch }}>
      {children}
    </PuzzleContext.Provider>
  );
};
