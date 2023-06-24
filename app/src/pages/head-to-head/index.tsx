import { isNull } from "lodash";
import { useState } from "react";

import { HeadToHeadChart } from "./HeadToHeadChart";
import { HeadToHeadForm } from "./HeadToHeadForm";

export const Component = () => {
  const [name1, setName1] = useState<string | null>(null);
  const [name2, setName2] = useState<string | null>(null);
  const [excludeMidis, flipExcludeMidis] = useState(false);

  return (
    <div className="flex justify-center">
      <div className="card shadow-2xl w-fit">
        <div className="card-body flex flex-col md:flex-row place-items-center gap-5">
          <HeadToHeadForm
            name1={name1}
            name2={name2}
            excludeMidis={excludeMidis}
            handleChangeName1={setName1}
            handleChangeName2={setName2}
            handleFlipExcludeMidis={flipExcludeMidis}
          />

          {!isNull(name1) && !isNull(name2) && (
            <>
              <div className="divider md:divider-horizontal" />

              <div className="grow">
                <HeadToHeadChart
                  name1={name1}
                  name2={name2}
                  excludeMidis={excludeMidis}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

Component.displayName = "HeadToHeadPage";
