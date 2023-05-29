import { isNull } from "lodash";
import { useContext } from "react";

import { PuzzleContext } from "../contexts";

export const usePuzzle = () => {
  const context = useContext(PuzzleContext);

  if (isNull(context)) {
    throw new Error("usePuzzle must be used within <PuzzleContext.Provider>");
  }

  return context;
};
