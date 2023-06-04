import { isUndefined } from "lodash";

import { PlayerModalContent } from "./modal-content";

interface IProps {
  name: string | undefined;
  handleClose: () => void;
}

export const PlayerModal = ({ name, handleClose }: IProps) => {
  return (
    <dialog
      className="modal modal-bottom sm:modal-middle"
      open={!isUndefined(name)}
    >
      <form method="dialog" className="modal-box">
        {name && <PlayerModalContent name={name} />}
      </form>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose} />
      </form>
    </dialog>
  );
};
