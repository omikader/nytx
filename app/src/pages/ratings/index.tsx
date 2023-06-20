import { chain, uniq } from "lodash";
import { useQuery } from "@apollo/client";

import { ApolloErrorToast, Spinner } from "../../components";
import { RatingLineChart } from "./RatingLineChart";
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
    return <ApolloErrorToast error={error} />;
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
    <div className="h-[calc(100vh-120px)] text-center">
      <RatingLineChart data={chartData} labels={labels} />
    </div>
  );
};

Component.displayName = "RatingsPage";
