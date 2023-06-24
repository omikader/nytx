import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { map } from "lodash";
import { useQuery } from "@apollo/client";

import { ApolloErrorToast, Spinner } from "../../components";
import { graphql } from "../../gql";

const HEAD_TO_HEAD_QUERY_DOCUMENT = graphql(`
  query HeadToHead($name1: String!, $name2: String!, $excludeMidis: Boolean!) {
    headToHead(name1: $name1, name2: $name2, excludeMidis: $excludeMidis) {
      wins
      losses
      ties
    }
  }
`);

interface IProps {
  name1: string;
  name2: string;
  excludeMidis: boolean;
}

export const HeadToHeadChart = ({ name1, name2, excludeMidis }: IProps) => {
  const { loading, error, data } = useQuery(HEAD_TO_HEAD_QUERY_DOCUMENT, {
    variables: { name1, name2, excludeMidis },
  });

  if (error) {
    return <ApolloErrorToast error={error} />;
  }

  if (loading || !data) {
    return <Spinner />;
  }

  const formatted = [
    {
      name: `${name1} wins`,
      value: data.headToHead.wins,
      color: "hsl(var(--p)",
    },
    { name: "Ties", value: data.headToHead.ties, color: "hsl(var(--a)" },
    {
      name: `${name2} wins`,
      value: data.headToHead.losses,
      color: "hsl(var(--s)",
    },
  ];

  return (
    <PieChart width={250} height={250}>
      <Tooltip />

      <Pie
        dataKey="value"
        data={formatted}
        innerRadius={60}
        outerRadius={80}
        label={true}
      >
        {map(formatted, ({ name, color }) => (
          <Cell key={name} fill={color} />
        ))}
      </Pie>
    </PieChart>
  );
};
