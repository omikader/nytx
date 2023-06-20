import { InfoIcon, LightningIcon } from "../../svg";
import { PlayerModalQuery } from "../../gql/graphql";

interface IProps {
  playerData: PlayerModalQuery["player"];
}

export const PlayerStats = ({ playerData }: IProps) => {
  const { gamesPlayed, lastPlay, streak, maxStreak } = playerData;

  const gamesPlayedMsg = `Last play on ${lastPlay}`;

  const streakDiff = maxStreak - streak;
  const streakMsg =
    streakDiff === 0
      ? "This is your longest streak!"
      : `${streakDiff} off your longest streak!`;

  return (
    <div className="stats stats-vertical shadow">
      <div className="stat">
        <div className="stat-figure">
          <InfoIcon />
        </div>
        <div className="stat-title">Games Played</div>
        <div className="stat-value">{gamesPlayed}</div>
        {lastPlay && <div className="stat-desc">{gamesPlayedMsg}</div>}
      </div>

      <div className="stat">
        <div className="stat-figure">
          <LightningIcon />
        </div>

        <div className="stat-title">Streak</div>
        <div className="stat-value">{streak}</div>
        {maxStreak > 0 && <div className="stat-desc">{streakMsg}</div>}
      </div>
    </div>
  );
};
