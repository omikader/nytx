import React from "react";
import moment from "moment";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { GetRatings } from "../api/graphql";

const COLORS = [
  "#e6194b",
  "#3cb44b",
  "#4363d8",
  "#00FFFF",
  "#911eb4",
  "#f032e6",
  "#fabebe",
  "#008080",
  "#e6beff",
  "#9a6324",
  "#800000",
  "#808000",
  "#f58231",
  "#808080",
  "#000075",
];

const DAYS = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];

export default function RatingLineChart({ data }: { data: GetRatings }) {
  const chartData = Object.entries(
    // Group by date
    data.ratings.reduce((acc, { mu, sigma, eta, date, user: { name } }) => {
      const group = acc[date] || {};
      group[name] = { mu, sigma, eta };
      acc[date] = group;
      return acc;
    }, {} as { [date: string]: { [name: string]: { [metric: string]: number } } })
  )
    // Merge date (key) and metrics (values) into one object
    .map(([date, labels]) => {
      return { date, ...labels };
    });

  const labels = Object.keys(Object.assign({}, ...chartData));
  labels.shift(); // remove 'date' key
  const [hiddenMap, setHiddenMap] = React.useState(
    labels.reduce((acc: { [key: string]: boolean }, name: string) => {
      acc[name] = false;
      return acc;
    }, {})
  );

  const handleOnClick = (event: any) => {
    setHiddenMap({
      ...hiddenMap,
      [event.value]: !hiddenMap[event.value],
    });
  };

  return (
    <ResponsiveContainer>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(value: string) => DAYS[moment(value).day()]}
        />
        <YAxis
          label={{
            value: "TrueSkill Rating",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <Tooltip
          itemSorter={(item: any) => -item.value}
          formatter={(value: number) => value.toFixed(2)}
        />
        <Legend onClick={handleOnClick} />
        {labels.map((name: string, index: number) => (
          <Line
            connectNulls
            type="linear"
            key={name}
            name={name}
            dataKey={(dtm) => (name in dtm ? Math.max(dtm[name].eta, 0) : null)}
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={2.5}
            hide={hiddenMap[name]}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
