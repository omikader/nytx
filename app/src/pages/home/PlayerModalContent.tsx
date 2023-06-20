import { useQuery } from "@apollo/client";
import { useState } from "react";

import { ApolloErrorToast, Spinner } from "../../components";
import { PlayerModalHeader } from "./PlayerModalHeader";
import { PlayerStats } from "./PlayerStats";
import { TimeStats } from "./TimeStats";
import { graphql } from "../../gql";

const PLAYER_MODAL_QUERY_DOCUMENT = graphql(`
  query PlayerModal($name: String!, $excludeMidis: Boolean!) {
    player(name: $name, excludeMidis: $excludeMidis) {
      gamesPlayed
      streak
      maxStreak
      lastPlay
      averageTime
      bestScore {
        date
        time
        seconds
      }
      worstScore {
        date
        time
        seconds
      }
    }
  }
`);

interface IProps {
  name: string;
}

export const PlayerModalContent = ({ name }: IProps) => {
  const [excludeMidis] = useState(false);

  const { loading, error, data } = useQuery(PLAYER_MODAL_QUERY_DOCUMENT, {
    variables: { name, excludeMidis },
  });

  if (error) {
    return <ApolloErrorToast error={error} />;
  }

  if (loading || !data) {
    return <Spinner />;
  }

  const { bestScore, worstScore, averageTime } = data.player;

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <PlayerModalHeader name={name} playerData={data.player} />

      <PlayerStats playerData={data.player} />

      {bestScore && worstScore && averageTime && (
        <>
          <div className="divider">Stats</div>

          <TimeStats
            bestScore={bestScore}
            worstScore={worstScore}
            averageTime={averageTime}
          />
        </>
      )}
    </div>
  );
};
