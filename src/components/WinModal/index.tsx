import React from "react";
import Draggable from "react-draggable";
import Modal from "../Modal/index";
import { Actions as GameplayActions } from "../../store/gameplay/gameplay.action";
import { Actions as UserActions } from "../../store/user/user.action";
import { connect } from "react-redux";
import { navigate } from "gatsby";
import { MODES } from "../../constants/playModes";
import { PawnSvg } from "../Images";
import {
  IGameplayElos,
  ISetPlayModePayload,
} from "../../store/gameplay/gameplay.interfaces";
import Counter from "../Counter";
import { getGameTypeElo, getGameTypeName } from "../../helpers/gameTypeHelper";
import { GameRules, GameMode } from "../../interfaces/game.interfaces";
import { IUser } from "../../store/user/user.interfaces";
import { getOpponentName } from "../../helpers/getOpponentNameByPlayMode";

interface IActionProps {
  clear: typeof GameplayActions.clear;
  setChoseMode: typeof UserActions.setChoseMode;
  setLoseMatchForLeaving: typeof GameplayActions.setLoseMatchForLeaving;
}

interface IProps extends IActionProps {
  elo: number;
  gameElos: IGameplayElos;
  winner: "b" | "w" | "draw";
  opponent: IUser;
  playerColor: "b" | "w";
  onClose: () => void;
  onReplay: () => void;
  isReplay: boolean;
  gameRules: GameRules;
  playMode: ISetPlayModePayload;
  prefix?: string;
}

const WinModal = (props: IProps) => {
  const {
    winner,
    elo,
    gameElos,
    playerColor,
    gameRules,
    opponent,
    isReplay,
    onClose,
    playMode,
    onReplay,
    prefix = "",
  } = props;

  const isDraw = winner === "draw";
  const isVictory = winner === playerColor;
  const isDefeat = winner !== "draw" && winner !== playerColor;

  const close = () => {
    if (onClose) onClose();
    props.setLoseMatchForLeaving(null);

    if (isReplay && playMode.isHumanVsHuman) {
      navigate("/profile");
      return;
    }

    if (playMode?.isHumanVsHuman) {
      props.setChoseMode(MODES.PLAY_WITH_HUMAN);
      navigate("/choose-mode");
    } else {
      props.setChoseMode(MODES.CHOSE_MODE);
      navigate("/choose-mode");
    }
  };

  return (
    <Modal onClose={onClose} draggable={true}>
      <div className={"win-modal"}>
        <div className="bg">
          <PawnSvg style={{ left: 40, top: 20, transform: "rotate(25deg)" }} />
          <PawnSvg style={{ left: 30, top: 80, transform: "rotate(-18deg)" }} />
          <PawnSvg
            style={{ left: 80, top: 53, transform: "rotate(-115deg)" }}
          />
          <PawnSvg style={{ left: 120, top: 90, transform: "rotate(25deg)" }} />
          <PawnSvg
            style={{ left: 140, top: 17, transform: "rotate(115deg)" }}
          />
          <PawnSvg
            style={{ left: 180, top: 70, transform: "rotate(-15deg)" }}
          />
          <PawnSvg style={{ left: 230, top: 20, transform: "rotate(15deg)" }} />
          <PawnSvg
            style={{ left: 250, top: 90, transform: "rotate(-85deg)" }}
          />
          <PawnSvg
            style={{ left: 300, top: 50, transform: "rotate(135deg)" }}
          />
          <PawnSvg
            style={{ left: 340, top: 90, transform: "rotate(-135deg)" }}
          />
          <PawnSvg
            style={{ left: 380, top: 20, transform: "rotate(-15deg)" }}
          />
          <PawnSvg style={{ left: 420, top: 70, transform: "rotate(25deg)" }} />
          <PawnSvg style={{ left: 470, top: 30, transform: "rotate(95deg)" }} />
          <PawnSvg
            style={{ left: 495, top: 97, transform: "rotate(-65deg)" }}
          />
          <PawnSvg
            style={{ left: 545, top: 57, transform: "rotate(-25deg)" }}
          />
        </div>

        {/* {props.winner && <p>{winMessage}</p>}
        {!props.winner && <p>{`Stalemate`}</p>} */}

        <div
          className={`result ${isDraw ? "draw" : isVictory ? "win" : "lose"}`}
        >
          {isDraw
            ? "Draw!"
            : isVictory
            ? `${prefix} Victory!`
            : `${prefix} Defeat!`}
        </div>
        <div className="elo-container">
          {isReplay || !playMode.isHumanVsHuman ? (
            <div className="text">
              {isVictory
                ? "Congratulations! You won the match!"
                : isDefeat
                ? `Oh no, ${getOpponentName(
                    !playMode.isHumanVsHuman,
                    playMode.aiMode,
                    opponent
                  )} won the match.`
                : "Match ended up as a draw."}
            </div>
          ) : gameRules.mode !== GameMode.Casual ? (
            <>
              <div
                className={`elo ${isVictory ? "win" : isDefeat ? "lose" : ""}`}
              >
                <Counter
                  initialValue={elo}
                  increment={
                    isVictory
                      ? Math.round(gameElos.eloWin)
                      : isDefeat
                      ? Math.round(gameElos.eloLose)
                      : Math.round(gameElos.eloDraw)
                  }
                  msDelayStart={1550}
                  msStep={100}
                />
              </div>
              <div className="elo-title">
                {getGameTypeName(gameRules.time.base)}
              </div>
            </>
          ) : null}
        </div>

        <div className={"btn-container"}>
          <button onClick={close} className={"btn btn-clickable"}>
            {isReplay
              ? playMode.isAI
                ? "Back to choose mode"
                : "Back to profile"
              : "Back to the lobby"}
          </button>
          <button onClick={onReplay} className={"btn link btn-clickable"}>
            {isReplay ? "Watch again" : "Watch replay"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

const connected = connect<{}, IActionProps>(null, {
  clear: GameplayActions.clear,
  setChoseMode: UserActions.setChoseMode,
  setLoseMatchForLeaving: GameplayActions.setLoseMatchForLeaving,
})(WinModal);

export default connected;
