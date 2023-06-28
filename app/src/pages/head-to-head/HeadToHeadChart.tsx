import { Cell, Legend, Pie, PieChart } from "recharts";
import { map } from "lodash";
import { useQuery } from "@apollo/client";

import { ApolloErrorToast, Spinner } from "../../components";
import { InfoIcon } from "../../svg";
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

  const {
    headToHead: { wins, losses, ties },
  } = data;

  if (wins + losses + ties === 0) {
    return (
      <div className="alert">
        <InfoIcon />
        <span>No data</span>
      </div>
    );
  }

  const cellData = [
    { name: `${name1} wins`, value: wins, color: "hsl(var(--p))" },
    { name: `${name2} wins`, value: losses, color: "hsl(var(--s))" },
    { name: "Ties", value: ties, color: "hsl(var(--a))" },
  ];

  return (
    <PieChart width={250} height={250} className="text-sm">
      <Legend verticalAlign="top" />

      <Pie
        dataKey="value"
        data={cellData}
        innerRadius={70}
        outerRadius={90}
        cy="75%"
        startAngle={0}
        endAngle={180}
        label={true}
      >
        {map(cellData, ({ name, color }) => (
          <Cell key={name} fill={color} style={{ outline: "none" }} />
        ))}
      </Pie>
    </PieChart>
  );
};
