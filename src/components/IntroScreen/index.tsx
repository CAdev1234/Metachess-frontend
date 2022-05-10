import React from "react";
import SquaredButton from "../SquaredButton";
import buttonPiece from '../../assets/images/buttonPiece.svg'
interface Props {
  startAIGame: () => void;
  goToRooms: () => void;
}

const Intro = ({ startAIGame, goToRooms }: Props) => {
  return (
    <div className="introWrapper">
      <h2>CHOOSE A GAME MODE</h2>
      <div className="squaredButtonsWrapper">
        <SquaredButton onClick={startAIGame} title="PLAY WITH AI">
          <img src={buttonPiece}  />
        </SquaredButton>
        <SquaredButton onClick={goToRooms} title="PLAY WITH HUMAN">
          <img src={buttonPiece}  />
        </SquaredButton>
        <SquaredButton onClick={goToRooms} title="TOURAMENT">
          <img src={buttonPiece}  />
        </SquaredButton>
      </div>
    </div>
  );
};

export default Intro;
