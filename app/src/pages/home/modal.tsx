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

  const { streak, gamesPlayed } = data.player;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-4">
        <div className="avatar placeholder online">
          <div className="bg-neutral-focus text-neutral-content rounded-full w-16">
            <span className="text-xl">{name.slice(0, 2)}</span>
          </div>
        </div>
        <h3 className="font-bold text-lg">{name}</h3>
      </div>

      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Games Played</div>
          <div className="stat-value">{gamesPlayed}</div>
          <div className="stats-desc">Wow!</div>
        </div>
        <div className="stat">
          <div className="stat-title">Streak</div>
          <div className="stat-value">{streak}</div>
        </div>
      </div>
    </div>
  );
};
