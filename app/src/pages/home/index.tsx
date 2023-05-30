import { CountdownClock } from "./countdown";
import { Leaderboard } from "./table";
import { usePuzzle } from "../../hooks";

export const HomePage = () => {
  const { activeLeaderboard, nextPuzzleDateTime } = usePuzzle();

  const date = activeLeaderboard[0].date;

  return (
    <div className="uk-flex uk-flex-column uk-flex-middle uk-text-center">
      <h1 className="uk-heading-small uk-heading-divider">{date}</h1>

      <CountdownClock date={nextPuzzleDateTime} />

      <Leaderboard data={activeLeaderboard} />
    </div>
  );
};
