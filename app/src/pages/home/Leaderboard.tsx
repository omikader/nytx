import { useRef, useState } from "react";

import { PlayerModal } from "./PlayerModal";
import { PuzzleContextType } from "../../contexts";

interface IProps {
  data: PuzzleContextType["activeLeaderboard"];
}

export const Leaderboard = ({ data }: IProps) => {
  const [name, setName] = useState<string | null>(null);
  const ref = useRef<HTMLDialogElement | null>(null);

  const handleOpen = (name: string) => {
    setName(name);
    ref.current?.showModal();
  };

  const handleClose = () => {
    setName(null);
    ref.current?.close();
  };

  return (
    <>
      <table className="table text-center table-zebra">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          {data.map(({ name, time, rank }) => (
            <tr key={name}>
              <td>{rank}</td>
              <td>
                <a
                  className="link link-accent"
                  onClick={() => handleOpen(name)}
                >
                  {name}
                </a>
              </td>
              <td>{time}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <PlayerModal name={name} handleClose={handleClose} modalRef={ref} />
    </>
  );
};
