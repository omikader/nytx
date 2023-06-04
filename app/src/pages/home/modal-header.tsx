import classNames from "classnames";

import { PlayerModalQuery } from "../../gql/graphql";

interface IProps {
  name: string;
  playerData: PlayerModalQuery["player"];
}

export const PlayerModalHeader = ({ name, playerData }: IProps) => {
  const { streak, gamesPlayed } = playerData;

  const avatarClassName = classNames("avatar", "placeholder", {
    online: streak > 0,
    offline: gamesPlayed === 0,
  });

  return (
    <div className="flex items-center gap-5">
      <div className={avatarClassName}>
        <div className="bg-neutral-focus text-neutral-content rounded-full w-16">
          <span className="text-xl">{name.slice(0, 2)}</span>
        </div>
      </div>

      <h3 className="font-bold text-lg">{name}</h3>
    </div>
  );
};
