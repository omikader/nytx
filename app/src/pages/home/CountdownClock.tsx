import { PuzzleContextType } from "../../contexts";
import { useTimer } from "../../hooks";

interface IProps {
  date: PuzzleContextType["nextPuzzleDateTime"];
}

export const CountdownClock = ({ date }: IProps) => {
  const { days, hours, minutes, seconds } = useTimer({
    date: new Date(date),
  });

  return (
    <div className="flex items-center gap-2.5">
      <div>
        <strong className="text-warning text-sm">Next puzzle in:</strong>
      </div>

      <div>
        <span className="countdown text-2xl">
          <span style={{ "--value": days }}></span>
        </span>
        <span className="text-sm">d</span>
      </div>

      <div>
        <span className="countdown text-2xl">
          <span style={{ "--value": hours }}></span>
        </span>
        <span className="text-sm">h</span>
      </div>

      <div>
        <span className="countdown text-2xl">
          <span style={{ "--value": minutes }}></span>
        </span>
        <span className="text-sm">m</span>
      </div>

      <div>
        <span className="countdown text-2xl">
          <span style={{ "--value": seconds }}></span>
        </span>
        <span className="text-sm">s</span>
      </div>
    </div>
  );
};
