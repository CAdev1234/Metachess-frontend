import React, { useEffect, useState } from "react";
import Button from "../Button";
import Modal from "../Modal";

interface Props {
  cancelDraw: () => void;
  confirmDraw: () => void;
  timeForDrawSelection?: number;
  isUserRequested: boolean;
}

const RequestDrawModal = ({
  cancelDraw = () => null,
  confirmDraw = () => null,
  timeForDrawSelection = 10000,
  isUserRequested = false,
}: Props) => {
  const [timeLeft, setTimeLeft] = useState(timeForDrawSelection);
  useEffect(() => {
    if (timeLeft > 0) {
      setTimeout(() => {
        if (timeLeft <= 1000) {
          cancelDraw();
        } else {
          setTimeLeft(timeLeft - 1000);
        }
      }, 1000);
    }
  }, [timeLeft]);
  const title = isUserRequested
    ? "You have requested a draw"
    : "Opponent is asking to draw a game";
  const subtitle = isUserRequested
    ? "Waiting for other player's response..."
    : "Do you want to draw a game?";
  return (
    <Modal onClose={cancelDraw} isBlack={true} isDrawModal={true}>
      <div className={"request-draw-modal"}>
        <p className="title">{title}</p>
        <p>{subtitle}</p>
        <div className={"timeleft"}>
          <p>{(timeLeft / 1000).toString().split(".")[0]}</p>
        </div>
        <div className={"btn-container"}>
          {!isUserRequested && (
            <Button onClick={cancelDraw} className={"btn"}>
              No
            </Button>
          )}
          {!isUserRequested && (
            <Button onClick={confirmDraw} className={"btn"}>
              Yes
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default RequestDrawModal;
