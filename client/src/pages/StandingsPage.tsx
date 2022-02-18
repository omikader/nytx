import { useQuery } from "@apollo/client";

import QueryResult from "../api/query-result";
import StandingsTable from "../components/StandingsTable";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { GetLatestRatings, LATEST_RATINGS } from "../api/get-latest-ratings";

export default function StandingsPage() {
  const { width } = useWindowDimensions();
  const { loading, error, data } = useQuery<GetLatestRatings>(LATEST_RATINGS);

  return (
    <div>
      <QueryResult loading={loading} error={error}>
        <StandingsTable data={data!} />
      </QueryResult>
      {width < 640 && (
        <a
          href="#"
          className="uk-icon-button uk-position-bottom-right uk-position-fixed uk-margin-small-right uk-margin-small-bottom"
          uk-totop="true"
          uk-scroll="true"
        />
      )}
    </div>
  );
}
