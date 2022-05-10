import React from "react";
import SquaredButton from "../SquaredButton";

import buttonPiece from '../../assets/images/buttonPiece.svg'

interface IProps {
  color: "b" | "w";
  setColor: (color: "b" | "w") => void;
  skillLevel: number;
  setSkillLevel: (level: number) => void;
  maximumError: number;
  setMaximumErrorLevel: (errorLevel: number) => void;
  probability: number;
  setProbability: (probability: number) => void;
  startGame: (e: any) => void;
  timerLimit: number;
  setTimerLimit: (timerLimit: number) => void;
  timerBonus: number;
  setTimerBonus: (timerBonus: number) => void;
  goBack: () => void;
}

const ChessStartScreen = ({
  color,
  setColor,
  skillLevel,
  setSkillLevel,
  maximumError,
  setMaximumErrorLevel,
  probability,
  setProbability,
  startGame,
  timerLimit,
  setTimerLimit,
  timerBonus,
  setTimerBonus,
  goBack,
  ...props
}: IProps) => (
  <>
    <div className="aiOptionsWrapper">
      <div className="introWrapper">
        <p className="gameBackNavigator" onClick={goBack}>
          {"< Choose a game mode"}
        </p>

        <h2>CHOOSE AI DIFFICULTY</h2>
        <div className="squaredButtonsWrapper">
          <SquaredButton onClick={startGame} title="BEGINNER">
            <img src={buttonPiece}  className="buttonPiece"/>
          </SquaredButton>
          <SquaredButton onClick={startGame} title="AMATEUR">
            <img src={buttonPiece}  className="buttonPiece"/>
          </SquaredButton>
          <SquaredButton onClick={startGame} title="INTERMEDIATE">
            <img src={buttonPiece}  className="buttonPiece"/>
          </SquaredButton>
          <SquaredButton onClick={startGame} title="PROFESSIONAL">
            <img src={buttonPiece}  className="buttonPiece"/>
          </SquaredButton>
          <SquaredButton onClick={startGame} title="WORLD CLASS">
            <img src={buttonPiece}  className="buttonPiece"/>
          </SquaredButton>
        </div>
      </div>
    <div {...props}>
      <p>Options</p>
      <label>Timer limit (in minutes)</label>
      <input
        min={0}
        max={600000}
        type="number"
        name="timerLimit"
        value={timerLimit}
        onChange={(e) => setTimerLimit(Number(e.target.value))}
      />
      <br />
      <label>Timer bonus (in seconds)</label>
      <input
        min={0}
        max={600000}
        type="number"
        name="timerBonus"
        value={timerBonus}
        onChange={(e) => setTimerBonus(Number(e.target.value))}
      />
      <br />
      <label>Skill level</label>
      <input
        min={0}
        max={20}
        type="number"
        name="skillLevel"
        value={skillLevel}
        onChange={(e) => setSkillLevel(Number(e.target.value))}
      />
      <br />
      <label>Maximum Error level</label>
      <input
        min={0}
        max={20}
        type="number"
        name="maximumError"
        value={maximumError}
        onChange={(e) => setMaximumErrorLevel(Number(e.target.value))}
      />
      <br />
      <label>Probability</label>
      <input
        min={0}
        max={20}
        type="number"
        name="probability"
        value={probability}
        onChange={(e) => setProbability(Number(e.target.value))}
      />
      <br />
      <label>Color</label>

      <select
        value={color}
        onChange={(e) => setColor(e.target.value as "b" | "w")}
      >
        <option title="Whites" label="Whites" value="w"></option>
        <option title="Blacks" label="Blacks" value="b"></option>
      </select>
      <br />
      <button onClick={startGame}>Start Game</button>
      <br />
      <button onClick={goBack}>Go back</button>
    </div>
    </div>

  </>
);

export default ChessStartScreen;
