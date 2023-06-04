import { PlayerModalQuery } from "../../gql/graphql";

interface IProps {
  bestScore: NonNullable<PlayerModalQuery["player"]["bestScore"]>;
  worstScore: NonNullable<PlayerModalQuery["player"]["worstScore"]>;
  averageTime: NonNullable<PlayerModalQuery["player"]["averageTime"]>;
}

export const TimeStats = ({ bestScore, worstScore, averageTime }: IProps) => {
  return (
    <div className="stats shadow">
      <div className="stat p-4">
        <div className="stat-title">Best</div>
        <div className="stat-value">{bestScore.time}</div>
        <div className="stat-desc">On {bestScore.date}</div>
      </div>

      <div className="stat p-4">
        <div className="stat-title">Worst</div>
        <div className="stat-value">{worstScore.time}</div>
        <div className="stat-desc">On {worstScore.date}</div>
      </div>

      <div className="stat p-4">
        <div className="stat-title">Average</div>
        <div className="stat-value">{averageTime}</div>
      </div>
    </div>
  );
};
