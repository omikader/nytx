import * as React from "react";

import { PuzzleQuery, usePuzzleQuery } from "../../hooks";
import { Spinner } from "../../components/Spinner";

interface IProps {
  children: React.ReactNode;
}

export interface PuzzleContextType {
  activeLeaderboard: PuzzleQuery["activeLeaderboard"];
  nextPuzzleDateTime: PuzzleQuery["nextPuzzleDateTime"];
}

export const PuzzleContext = React.createContext<PuzzleContextType | null>(
  null
);

export const PuzzleProvider = ({ children }: IProps) => {
  const { loading, error, data } = usePuzzleQuery();

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
