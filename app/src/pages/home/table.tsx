import { PuzzleContextType } from "../../contexts";

interface IProps {
  data: PuzzleContextType["activeLeaderboard"];
}

export const Leaderboard = ({ data }: IProps) => {
  return (
    <table className="uk-table uk-table-small uk-table-striped uk-table-hover">
      <thead>
        <tr>
          <th className="uk-width-small uk-text-center">Rank</th>
          <th className="uk-width-small uk-text-center">Name</th>
          <th className="uk-width-small uk-text-center">Time</th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ name, time, rank }) => (
          <tr key={name}>
            <td>{rank}</td>
            <td>{name}</td>
            <td>{time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
