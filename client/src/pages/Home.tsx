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

const Item = styled.div`
  margin: auto;
`;

export default function Home() {
  const [range, setRange] = React.useState("1,w");
  const onChange = (newRange: string) => {
    setRange(newRange);
  };

  return (
    <Container>
      <Item>
        <RangeRadioButtonGroup range={range} onChange={onChange} />
      </Item>
      <Item>
        {range[0] === "0" && <StandingsTableContainer />}
        {range[0] !== "0" && <RatingLineChartContainer range={range} />}
      </Item>
    </Container>
  );
}
