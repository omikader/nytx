import { chain, uniq } from "lodash";
import { useQuery } from "@apollo/client";

import { Error, Loader } from "../../components";
import { RatingLineChart } from "./chart";
import { graphql } from "../../gql";

const RATINGS_QUERY_DOCUMENT = graphql(`
  query Ratings {
    ratings {
      name
      date
      eta
    }
  }
`);

export const Component = () => {
  const { loading, error, data } = useQuery(RATINGS_QUERY_DOCUMENT);

  if (error) {
    return <Error error={error} />;
  }

  if (loading || !data) {
    return <Loader />;
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
