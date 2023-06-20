import { chain, isUndefined, lowerCase, reject } from "lodash";
import { useState } from "react";

import { ExcludeMidisToggle } from "./ExcludeMidisToggle";
import { HeadToHeadSelector } from "./HeadToHeadSelector";
import { HeadToHeadTable } from "./HeadToHeadTable";
import { usePuzzle } from "../../hooks";

export const HeadToHeadPage = () => {
  const [name1, setName1] = useState<string>();
  const [name2, setName2] = useState<string>();
  const [excludeMidis, flipExcludeMidis] = useState(false);

  const { activeLeaderboard } = usePuzzle();

  const options = chain(activeLeaderboard)
    .map("name")
    .orderBy(lowerCase)
    .value();

  return (
    <div className="flex flex-col md:flex-row justify-center gap-5">
      <div className="card shadow-2xl">
        <div className="card-body">
          <form className="join join-vertical gap-5">
            <HeadToHeadSelector
              options={reject(options, (name) => name === name2)}
              label="Choose player one"
              defaultValue="Choose a player..."
              handleChange={setName1}
            />

            <HeadToHeadSelector
              options={reject(options, (name) => name === name1)}
              label="Choose player two"
              defaultValue="Choose a another..."
              handleChange={setName2}
            />

            <ExcludeMidisToggle
              excludeMidis={excludeMidis}
              handleChange={flipExcludeMidis}
            />
          </form>
        </div>
      </div>

      {!isUndefined(name1) && !isUndefined(name2) && (
        <>
          <div className="divider md:divider-horizontal" />
          <div className="card shadow-2xl grow">
            <div className="card-body">
              <HeadToHeadTable
                name1={name1}
                name2={name2}
                excludeMidis={excludeMidis}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
