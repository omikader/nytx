import { useState } from "react";

import { PlayerModal } from "./modal";
import { PuzzleContextType } from "../../contexts";

interface IProps {
  data: PuzzleContextType["activeLeaderboard"];
}

export const Leaderboard = ({ data }: IProps) => {
  const [name, setName] = useState<string>();

  const handleClose = () => {
    setName(undefined);
  };

  return (
    <>
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
              <td>
                <a className="link link-accent" onClick={() => setName(name)}>
                  {name}
                </a>
              </td>
              <td>{time}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <PlayerModal name={name} handleClose={handleClose} />
    </>
  );
};
