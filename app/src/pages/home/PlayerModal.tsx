import { isNull } from "lodash";

import { PlayerModalContent } from "./PlayerModalContent";

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
