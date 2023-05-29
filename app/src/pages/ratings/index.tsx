import { chain, uniq } from "lodash";
import { useQuery } from "@apollo/client";

import { RatingLineChart } from "./chart";
import { Spinner } from "../../components/Spinner";
import { graphql } from "../../gql";

const RATINGS_QUERY_DOCUMENT = graphql(`
  query Ratings {
    ratings {
      name
      date
      mu
      sigma
      eta
    }
  }
`);

export const Component = () => {
  const { loading, error, data } = useQuery(RATINGS_QUERY_DOCUMENT);

  if (error) {
    return (
      <div className="uk-alert-danger uk-padding-small" uk-alert="true">
        <p className="uk-margin-remove-bottom">Error! {error.message}</p>
      </div>
    );
  }

  if (loading || !data) {
    return <Spinner />;
  }

  const chartData = chain(data.ratings)
    .groupBy("date")
    .entries()
    .map(([date, ratings]) => ({
      date,
      ...ratings.reduce<Record<string, number>>(
        (acc, { name, eta }) => ({ ...acc, [name]: eta }),
        {}
      ),
    }))
    .value();

  const labels = uniq(data.ratings.map(({ name }) => name));

  return (
    <div
      uk-height-viewport="offset-top: true"
      className="uk-height-large uk-width-1-1"
    >
      <RatingLineChart data={chartData} labels={labels} />
    </div>
  );
};

Component.displayName = "RatingsPage";
