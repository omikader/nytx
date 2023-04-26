import React from "react";
import moment from "moment";
import { useQuery } from "@apollo/client";

import QueryResult from "../api/query-result";
import RangeRadioButtonGroup from "../components/RangeRadioButtonGroup";
import RatingLineChart from "../components/RatingLineChart";
import { GetLeaderboards, LEADERBOARDS } from "../api/get-leaderboards";

export default function RatingsChartPage() {
  const [range, setRange] = React.useState("1,w");
  const endDate = moment();
  const startDate = endDate
    .clone()
    .subtract(...range.split(","))
    .format("YYYY-MM-DD");

  const { loading, error, data } = useQuery<GetLeaderboards>(LEADERBOARDS, {
    variables: { start: startDate, end: endDate.format("YYYY-MM-DD") },
  });

  return (
    <div className="uk-flex uk-flex-column uk-flex-middle">
      <div>
        <RangeRadioButtonGroup range={range} onChange={setRange} />
      </div>
      <div
        uk-height-viewport="offset-top: true"
        className="uk-height-large uk-width-1-1"
      >
        <QueryResult loading={loading} error={error}>
          <RatingLineChart data={data!} />
        </QueryResult>
      </div>
    </div>
  );
}
