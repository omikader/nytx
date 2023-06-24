import { Dispatch, SetStateAction } from "react";
import { chain, lowerCase, reject } from "lodash";

import { ExcludeMidisToggle } from "./ExcludeMidisToggle";
import { HeadToHeadSelector } from "./HeadToHeadSelector";
import { usePuzzle } from "../../hooks";

interface IProps {
  name1: string | null;
  name2: string | null;
  excludeMidis: boolean;
  handleChangeName1: Dispatch<SetStateAction<string | null>>;
  handleChangeName2: Dispatch<SetStateAction<string | null>>;
  handleFlipExcludeMidis: Dispatch<SetStateAction<boolean>>;
}

export const HeadToHeadForm = ({
  name1,
  name2,
  excludeMidis,
  handleChangeName1,
  handleChangeName2,
  handleFlipExcludeMidis,
}: IProps) => {
  const { activeLeaderboard } = usePuzzle();

  const options = chain(activeLeaderboard)
    .map("name")
    .orderBy(lowerCase)
    .value();

  return (
    <form className="join join-vertical gap-5">
      <HeadToHeadSelector
        options={reject(options, (name) => name === name2)}
        label="Choose player one"
        defaultValue="Choose a player..."
        handleChange={handleChangeName1}
        style="select-primary"
      />

      <HeadToHeadSelector
        options={reject(options, (name) => name === name1)}
        label="Choose player two"
        defaultValue="Choose a another..."
        handleChange={handleChangeName2}
        style="select-secondary"
      />

      <ExcludeMidisToggle
        excludeMidis={excludeMidis}
        handleChange={handleFlipExcludeMidis}
      />
    </form>
  );
};
