import { chain, isUndefined, lowerCase, reject } from "lodash";
import { useState } from "react";

import { ExcludeMidisToggle } from "./toggle";
import { HeadToHeadSelector } from "./selector";
import { HeadToHeadTable } from "./table";
import { usePuzzle } from "../../hooks";

export const HeadToHeadPage = () => {
  const { activeLeaderboard } = usePuzzle();
  const [excludeMidis, flipExcludeMidis] = useState(false);
  const [name1, setName1] = useState<string>();
  const [name2, setName2] = useState<string>();

  const options = chain(activeLeaderboard)
    .map("name")
    .orderBy(lowerCase)
    .value();

  return (
    <div>
      <form className="join join-vertical">
        <HeadToHeadSelector
          options={reject(options, (name) => name === name2)}
          caption="Choose a player..."
          handleChange={setName1}
        />
        <HeadToHeadSelector
          options={reject(options, (name) => name === name1)}
          caption="Choose another..."
          handleChange={setName2}
        />
        <ExcludeMidisToggle
          excludeMidis={excludeMidis}
          handleChange={flipExcludeMidis}
        />
      </form>

      {!isUndefined(name1) && !isUndefined(name2) && (
        <HeadToHeadTable
          name1={name1}
          name2={name2}
          excludeMidis={excludeMidis}
        />
      )}
    </div>
  );
};
