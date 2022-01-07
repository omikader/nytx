import React from "react";
import moment from "moment";
import { useQuery } from "@apollo/client";

import InnerLineChart from "./InnerLineChart";
import logo from "../logo.svg";
import { GetHistory, HISTORY } from "../util/graphql";

export default function RangedLineChart() {
  const [range, setRange] = React.useState([1, "w"]);

  const startDate = moment()
    .subtract(...range)
    .format("YYYY-MM-DD");

  const { loading, error, data } = useQuery<GetHistory>(HISTORY, {
    variables: { start: startDate },
  });

  if (loading) return <img src={logo} className="App-logo" alt="logo" />;
  if (error) return <p>Error! ${error.message}</p>;

  return (
    <div>
      <div>
        <input
          type="radio"
          onChange={(_) => setRange([1, "w"])}
          checked={range[0] === 1 && range[1] === "w"}
        />
        1W
        <input
          type="radio"
          onChange={(_) => setRange([1, "M"])}
          checked={range[0] === 1 && range[1] === "M"}
        />
        1M
        <input
          type="radio"
          onChange={(_) => setRange([3, "M"])}
          checked={range[0] === 3 && range[1] === "M"}
        />
        3M
      </div>
      <div style={{ height: "90vh", width: "90vw" }}>
        <InnerLineChart data={data!} />
      </div>
    </div>
  );
}
