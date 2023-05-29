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
import { useState } from "react";

import { useWindowDimensions } from "../../hooks/useWindowDimensions";

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

export interface IProps {
  data: { date: string }[];
  labels: string[];
}

export const RatingLineChart = ({ data, labels }: IProps) => {
  const { width } = useWindowDimensions();

  const [hiddenMap, setHiddenMap] = useState<Record<string, boolean>>(
    labels.reduce((acc, curr) => ({ ...acc, [curr]: false }), {})
  );

  return (
    <ResponsiveContainer>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="date"
          tickFormatter={(value: string) => DAYS[new Date(value).getUTCDay()]}
        />

        <YAxis
          label={{
            value: "TrueSkill Estimate",
            angle: -90,
            position: "insideLeft",
          }}
        />

        <Tooltip
          itemSorter={(item) => -1 * (item.value ?? 0)}
          formatter={(value: number) =>
            Math.round((value + Number.EPSILON) * 100) / 100
          }
        />

        <Legend
          onClick={(data) => {
            setHiddenMap({
              ...hiddenMap,
              [data.value]: !hiddenMap[data.value],
            });
          }}
        />

        {labels.map((label: string, index: number) => (
          <Line
            connectNulls
            type="linear"
            dot={width > 640}
            key={label}
            name={label}
            dataKey={(dtm) => (label in dtm ? Math.max(dtm[label], 0) : null)}
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={2.5}
            hide={hiddenMap[label]}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
