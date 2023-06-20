import { useQuery } from "@apollo/client";

import { ApolloErrorToast, Spinner } from "../../components";
import { graphql } from "../../gql";

const HEAD_TO_HEAD_QUERY_DOCUMENT = graphql(`
  query HeadToHead($name1: String!, $name2: String!, $excludeMidis: Boolean!) {
    headToHead(name1: $name1, name2: $name2, excludeMidis: $excludeMidis) {
      wins
      losses
      ties
      stats1 {
        avg
      }
      stats2 {
        avg
      }
    }
  }
`);

interface IProps {
  name1: string;
  name2: string;
  excludeMidis: boolean;
}

export const HeadToHeadTable = ({ name1, name2, excludeMidis }: IProps) => {
  const { loading, error, data } = useQuery(HEAD_TO_HEAD_QUERY_DOCUMENT, {
    variables: { name1, name2, excludeMidis },
  });

  if (error) {
    return <ApolloErrorToast error={error} />;
  }

  if (loading || !data) {
    return <Spinner />;
  }

  return (
    <table className="table table-fixed text-center">
      <thead>
        <tr>
          <th>{name1}</th>
          <th />
          <th>{name2}</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>{data.headToHead.wins}</td>
          <td>Wins</td>
          <td>{data.headToHead.losses}</td>
        </tr>

        <tr>
          <td>{data.headToHead.losses}</td>
          <td>Losses</td>
          <td>{data.headToHead.wins}</td>
        </tr>

        <tr>
          <td>{data.headToHead.ties}</td>
          <td>Ties</td>
          <td>{data.headToHead.ties}</td>
        </tr>

        <tr>
          <td>{data.headToHead.stats1.avg}</td>
          <td>Average Time</td>
          <td>{data.headToHead.stats2.avg}</td>
        </tr>
      </tbody>
    </table>
  );
};
