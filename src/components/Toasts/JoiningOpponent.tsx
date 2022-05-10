import React from "react";
import Button from "../Button";
import Modal from "../Modal";

interface Props {
  onCancel: () => void;
}
const JoiningOpponent = ({ onCancel }: Props) => {
  return (
    <Modal onClose={onCancel}>
      <div className="request-draw-modal">
        <p className="title">
          {"Please wait while we are searching for opponent..."}
        </p>
        <br />
        <Button dark small onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default JoiningOpponent;
