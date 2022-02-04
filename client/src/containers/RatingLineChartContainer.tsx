import moment from "moment";
import styled from "styled-components";
import { useQuery } from "@apollo/client";

import RatingLineChart from "../components/RatingLineChart";
import Spinner from "../components/Spinner";
import logo from "../logo.svg";
import { GetLeaderboards, LEADERBOARDS } from "../api/graphql";

const Parent = styled.div`
  width: 90vw;
  height: 90vh;
`;

export default function RatingLineChartContainer({ range }: { range: string }) {
  const endDate = moment();
  const startDate = endDate
    .clone()
    .subtract(...range.split(","))
    .format("YYYY-MM-DD");

  const { loading, error, data } = useQuery<GetLeaderboards>(LEADERBOARDS, {
    variables: { start: startDate, end: endDate.format("YYYY-MM-DD") },
  });

  if (loading) return <Spinner src={logo} alt="logo" />;
  if (error) return <p>Error! ${error.message}</p>;

  return (
    <Parent>
      <RatingLineChart
        data={data!.leaderboards.map(({ date, ratings }) => {
          return {
            date,
            ...ratings.reduce(
              (acc: { [name: string]: number }, { user, eta }) => {
                acc[user.name] = eta;
                return acc;
              },
              {}
            ),
          };
        })}
      />
    </Parent>
  );
}
