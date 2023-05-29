import * as React from "react";
import { useQuery } from "@apollo/client";

import { PuzzleContextQuery } from "../gql/graphql";
import { Spinner } from "../components/Spinner";
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
    return (
      <div className="uk-alert-danger uk-padding-small" uk-alert="true">
        <p className="uk-margin-remove-bottom">Error! {error.message}</p>
      </div>
    );
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
