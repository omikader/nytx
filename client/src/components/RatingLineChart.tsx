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

export default function RatingLineChart({
  data,
}: {
  data: {
    [key: string]: any;
  }[];
}) {
  const labels = Object.keys(Object.assign({}, ...data));
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
      <LineChart data={data}>
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
            dataKey={(dtm) => (name in dtm ? Math.max(dtm[name], 0) : null)}
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={2.5}
            hide={hiddenMap[name]}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
