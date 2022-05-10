import React from "react";
import Button from "../Button";

interface IProps {
  draw: () => void;
  resign: () => void;
  drawEnabled: boolean;
}

const ActionButtons = (props: IProps) => {
  return (
    <div className={"actionButtonsWrapper"}>
      <Button dark onClick={props.resign}>
        {"Resign"}
      </Button>
      <Button
        white
        onClick={() => {
          props.draw();
        }}
        disabled={!props.drawEnabled}
      >
        {"Draw"}
      </Button>
    </div>
  );
};

export default ActionButtons;
