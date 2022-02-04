import React from "react";
import styled from "styled-components";

import RangeRadioButtonGroup from "../components/RangeRadioButtonGroup";
import RatingLineChartContainer from "../containers/RatingLineChartContainer";
import StandingsTableContainer from "../containers/StandingsTableContainer";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1vh;
`;

export default function Home() {
  const [range, setRange] = React.useState("1,w");
  const onChange = (newRange: string) => {
    setRange(newRange);
  };

  return (
    <Container>
      <RangeRadioButtonGroup range={range} onChange={onChange} />
      {range === "1,d" && <StandingsTableContainer />}
      {range !== "1,d" && <RatingLineChartContainer range={range} />}
    </Container>
  );
}
