import React, { useEffect, useState } from "react";
import Button from "../Button";
import Modal from "../Modal";

interface IProps {
  onAnswer: (answer: "w" | "b" | "draw") => void;
  playerColor: "w" | "b";
}

const OpponentLeftModal = (props: IProps) => {
  const [timeLeft, setTimeLeft] = useState(10000);
  useEffect(() => {
    let timeout: NodeJS.Timeout = null;
    if (timeLeft > 0) {
      timeout = setTimeout(() => {
        if (timeLeft <= 1000) {
          props.onAnswer("draw");
        } else {
          setTimeLeft(timeLeft - 1000);
        }
      }, 1000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [timeLeft]);

  return (
    <Modal onClose={() => {}}>
      <div className={"request-draw-modal"}>
        <p className="title">{"Opponent left"}</p>
        <p>
          {
            "You can chose do you want to win or to be draw. By default it's draw"
          }
        </p>
        <div className={"btn-container"}>
          <Button
            onClick={() => props.onAnswer(props.playerColor)}
            className={"btn"}
          >
            Win
          </Button>
          <p className="title">{timeLeft / 1000}</p>
          <Button onClick={() => props.onAnswer("draw")} className={"btn"}>
            Draw
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default OpponentLeftModal;
