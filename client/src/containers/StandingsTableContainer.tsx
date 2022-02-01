import { useQuery } from "@apollo/client";

import Spinner from "../components/Spinner";
import StandingsTable from "../components/StandingsTable";
import logo from "../logo.svg";
import { GetLatestRatings, LATEST_RATINGS } from "../api/graphql";

export default function StandingsTableContainer() {
  const { loading, error, data } = useQuery<GetLatestRatings>(LATEST_RATINGS);

  if (loading) return <Spinner src={logo} alt="logo" />;
  if (error) return <p>Error! ${error.message}</p>;
  return <StandingsTable data={data!} />;
}
