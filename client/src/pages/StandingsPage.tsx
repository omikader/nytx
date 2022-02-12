import { useQuery } from "@apollo/client";

import QueryResult from "../api/query-result";
import StandingsTable from "../components/StandingsTable";
import { GetLatestRatings, LATEST_RATINGS } from "../api/get-latest-ratings";

export default function StandingsPage() {
  const { loading, error, data } = useQuery<GetLatestRatings>(LATEST_RATINGS);

  return (
    <QueryResult loading={loading} error={error}>
      <StandingsTable data={data!} />
    </QueryResult>
  );
}
