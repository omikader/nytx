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

import useWindowDimensions from "../../hooks/useWindowDimensions";

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

export interface IProps {
  data: { date: string }[];
  labels: string[];
}

export const RatingLineChart = ({ data, labels }: IProps) => {
  const { width } = useWindowDimensions();

  const [hiddenMap, setHiddenMap] = useState<Record<string, boolean>>(
    labels.reduce((acc, curr) => ({ ...acc, [curr]: false }), {})
  );

  const handleClick = (event: any) => {
    setHiddenMap({
      ...hiddenMap,
      [event.value]: !hiddenMap[event.value],
    });
  };

  return (
    <ResponsiveContainer>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="date" />

        <YAxis
          label={{
            value: "TrueSkill Estimate",
            angle: -90,
            position: "insideLeft",
          }}
        />

        <Tooltip
          itemSorter={(item: any) => -item.value}
          formatter={(value: number) =>
            Math.round((value + Number.EPSILON) * 100) / 100
          }
        />

        <Legend onClick={handleClick} />

        {labels.map((name: string, index: number) => (
          <Line
            connectNulls
            type="linear"
            dot={width > 640}
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
};
