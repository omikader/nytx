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

import { GetHistory } from "../util/graphql";

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

export default function InnerLineChart({ data }: { data: GetHistory }) {
  const parsedData = [...data.history]
    .sort((a, b) => {
      if (a.date > b.date) {
        return 1;
      }
      if (a.date < b.date) {
        return -1;
      }
      return 0;
    })
    .map(({ date, scores }) => {
      return {
        date,
        ...Object.fromEntries(scores.map(({ name, time }) => [name, time])),
      };
    });
  const labels = Object.keys(Object.assign({}, ...parsedData));
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
      [event.dataKey]: !hiddenMap[event.dataKey],
    });
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={parsedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(value: string) => DAYS[moment(value).day()]}
        />
        <YAxis
          reversed={true}
          label={{ value: "time (s)", angle: -90, position: "insideLeft" }}
        />
        <Tooltip
          formatter={(time_s: number) => moment(time_s * 1000).format("mm:ss")}
          itemSorter={(item: any) => item.value}
        />
        <Legend onClick={handleOnClick} />
        {labels.map((name: string, index: number) => (
          <Line
            key={name}
            type="monotone"
            dataKey={name}
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={2}
            hide={hiddenMap[name]}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
