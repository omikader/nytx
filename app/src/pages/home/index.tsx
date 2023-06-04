import { CountdownClock } from "./countdown";
import { Leaderboard } from "./table";
import { usePuzzle } from "../../hooks";

export const HomePage = () => {
  const { activeLeaderboard, nextPuzzleDateTime } = usePuzzle();

  const date = activeLeaderboard[0].date;

  return (
    <div className="flex flex-col items-center gap-5">
      <h1 className="font-extrabold text-2xl lg:text-4xl border-b-2 pb-1">
        {date}
      </h1>

      <CountdownClock date={nextPuzzleDateTime} />

      <Leaderboard data={activeLeaderboard} />
    </div>
  );
};
