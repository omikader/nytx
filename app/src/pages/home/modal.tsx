import classNames from "classnames";
import { isNull } from "lodash";
import { useQuery } from "@apollo/client";
import { useState } from "react";

import { Error, Loader } from "../../components";
import { graphql } from "../../gql";

const PLAYER_MODAL_QUERY_DOCUMENT = graphql(`
  query PlayerModal($name: String!, $excludeMidis: Boolean!) {
    player(name: $name, excludeMidis: $excludeMidis) {
      gamesPlayed
      streak
      maxStreak
      lastPlay
      bestScore {
        rank
        date
        time
      }
      worstScore {
        rank
        date
        time
      }
    }
  }
`);

interface IProps {
  name: string | null;
  handleClose: () => void;
}

export const PlayerModal = ({ name, handleClose }: IProps) => {
  return (
    <dialog className="modal modal-bottom sm:modal-middle" open={!isNull(name)}>
      <form method="dialog" className="modal-box">
        {name && <PlayerModalContent name={name} />}
      </form>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose} />
      </form>
    </dialog>
  );
};

const PlayerModalContent = ({ name }: { name: string }) => {
  const [excludeMidis] = useState(false);

  const { loading, error, data } = useQuery(PLAYER_MODAL_QUERY_DOCUMENT, {
    variables: { name, excludeMidis },
  });

  if (error) {
    return <Error error={error} />;
  }

  if (loading || !data) {
    return <Loader />;
  }

  const { streak, maxStreak, gamesPlayed, lastPlay, bestScore, worstScore } =
    data.player;

  const streakDiff = maxStreak - streak;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-5">
        <div
          className={classNames("avatar", "placeholder", {
            online: streak > 0,
          })}
        >
          <div className="bg-neutral-focus text-neutral-content rounded-full w-16">
            <span className="text-xl">{name.slice(0, 2)}</span>
          </div>
        </div>

        <h3 className="font-bold text-lg">{name}</h3>
      </div>

      <div className="stats stats-vertical lg:stats-horizontal shadow">
        <div className="stat">
          <div className="stat-figure">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Games Played</div>
          <div className="stat-value">{gamesPlayed}</div>
          {lastPlay && (
            <div className="stat-desc">{`Last play on ${lastPlay}`}</div>
          )}
        </div>

        <div className="stat">
          <div className="stat-figure">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Streak</div>
          <div className="stat-value">{streak}</div>
          <div className="stat-desc">
            {streak !== 0 &&
              (streakDiff === 0
                ? "This is your best streak!"
                : `${streakDiff} from your best streak!`)}
          </div>
        </div>
      </div>

      {bestScore && worstScore && (
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Best Time</div>
            <div className="stat-value">{bestScore.time}</div>
            <div className="stat-desc">{`On ${bestScore.date}`}</div>
          </div>

          <div className="stat">
            <div className="stat-title">Worst Time</div>
            <div className="stat-value">{worstScore.time}</div>
            <div className="stat-desc">{`On ${worstScore.date}`}</div>
          </div>
        </div>
      )}
    </div>
  );
};
