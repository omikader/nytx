import React from "react";
import moment from "moment";
import styled from "styled-components";
import { useQuery } from "@apollo/client";

import QueryResult from "../api/query-result";
import RangeRadioButtonGroup from "../components/RangeRadioButtonGroup";
import RatingLineChart from "../components/RatingLineChart";
import { GetLeaderboards, LEADERBOARDS } from "../api/get-leaderboards";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1vh;
`;

const Parent = styled.div`
  height: 90vh;
  width: 90vw;
`;

export default function RatingsPage() {
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
    <Container>
      <RangeRadioButtonGroup range={range} onChange={setRange} />
      <QueryResult loading={loading} error={error}>
        <Parent>
          <RatingLineChart data={data!} />
        </Parent>
      </QueryResult>
    </Container>
  );
}
