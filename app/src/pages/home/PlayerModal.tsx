import { MutableRefObject } from "react";

import { PlayerModalContent } from "./PlayerModalContent";

interface IProps {
  name: string | null;
  handleClose: () => void;
  modalRef: MutableRefObject<HTMLDialogElement | null>;
}

export const PlayerModal = ({ name, handleClose, modalRef }: IProps) => {
  return (
    <dialog className="modal modal-bottom sm:modal-middle" ref={modalRef}>
      <form method="dialog" className="modal-box">
        {name && <PlayerModalContent name={name} />}
      </form>

      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose} />
      </form>
    </dialog>
  );
};
