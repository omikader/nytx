import { useQuery } from "@apollo/client";

import { Spinner } from "../../components/Spinner";
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
    return (
      <div className="uk-alert-danger uk-padding-small" uk-alert="true">
        <p className="uk-margin-remove-bottom">Error! {error.message}</p>
      </div>
    );
  }

  if (loading || !data) {
    return <Spinner />;
  }

  return (
    <table className="uk-table uk-table-divider">
      <thead>
        <tr>
          <th className="uk-width-small uk-text-center">{name1}</th>
          <th className="uk-width-small" />
          <th className="uk-width-small uk-text-center">{name2}</th>
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
          <td>Avg. Time</td>
          <td>{data.headToHead.stats2.avg}</td>
        </tr>
      </tbody>
    </table>
  );
};
