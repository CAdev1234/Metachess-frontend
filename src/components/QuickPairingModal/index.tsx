import React, { useState } from "react";
import { connect } from "react-redux";
import Modal from "../Modal";
import { Actions as GameplayActions } from "../../store/gameplay/gameplay.action";
import {
  GameMode,
  GameRules,
  PieceSide,
  GameType,
} from "../../interfaces/game.interfaces";
import subscribeToGameStart from "../../lib/gameStart";
import JoiningOpponent from "../Toasts/JoiningOpponent";
import SocketService from "../../services/socket.service";

interface IProps extends IActionProps {
  closeModal: () => void;
  gameMode: String
}

interface IActionProps {
  clear: typeof GameplayActions.clear;
}

const QuickPairingModal = (props: IProps) => {
  const [openWaitingPopup, setOpenWaitingPopup] = useState(false);

  const onCancel = () => {
    setOpenWaitingPopup(false);
    SocketService.sendData("cancel-quickplay", null);
    SocketService.sendData("leave-game", null);
    // props.clear();
  };

  const closePopup = () => {
    setOpenWaitingPopup(false);
  };

  const onQuickPlay = (base: number, increment: number, type: GameType) => {
    const hostSide = PieceSide.Random;
    let gameRules: GameRules = {
      chessCoin: null,
      hostSide,
      rating: 5,
      mode: GameMode.Casual,
      type,
      time: {
        base,
        increment,
      },
    };
    if (base === 0) {
      delete gameRules.time;
    }

    subscribeToGameStart(props.gameMode, closePopup);
    SocketService.sendData(
      "quick-play",
      gameRules,
      (quickPlayFound: boolean) => {
        console.log('res', quickPlayFound);
        if (quickPlayFound) {
          setOpenWaitingPopup(true);
        }
      }
    );
  };
  return (
    <Modal onClose={props.closeModal} withBorder>
      <div className="quick-pairing-modal">
        {openWaitingPopup && <JoiningOpponent onCancel={onCancel} />}
        <div className={"headerRow"}>
          <h3>Quick pairing</h3>
        </div>
        <div className="row-boxes">
          <div className="row">
            <div
              className="box quick-box"
              onClick={() => onQuickPlay(1, 0, GameType.Bullet)}
            >
              <p>1+0</p>
              <p>bullet</p>
            </div>
            <div
              className="box quick-box"
              onClick={() => onQuickPlay(1, 3, GameType.Bullet)}
            >
              <p>1+3</p>
              <p>bullet</p>
            </div>
            <div
              className="box quick-box"
              onClick={() => onQuickPlay(2, 1, GameType.Bullet)}
            >
              <p>2+1</p>
              <p>bullet</p>
            </div>
            <div
              className="box quick-box"
              onClick={() => onQuickPlay(3, 0, GameType.Blitz)}
            >
              <p>3+0</p>
              <p>blitz</p>
            </div>
          </div>
          <div
            className="row"
            onClick={() => onQuickPlay(3, 2, GameType.Blitz)}
          >
            <div className="box quick-box">
              <p>3+2</p>
              <p>blitz</p>
            </div>
            <div
              className="box quick-box"
              onClick={() => onQuickPlay(5, 0, GameType.Blitz)}
            >
              <p>5+0</p>
              <p>blitz</p>
            </div>
            <div
              className="box quick-box"
              onClick={() => onQuickPlay(5, 2, GameType.Blitz)}
            >
              <p>5+2</p>
              <p>blitz</p>
            </div>
            <div
              className="box quick-box"
              onClick={() => onQuickPlay(10, 0, GameType.Rapid)}
            >
              <p>10+0</p>
              <p>rapid</p>
            </div>
          </div>
          <div
            className="row"
            onClick={() => onQuickPlay(0, 0, GameType.Bullet)}
          >
            <div className="box lg quick-box">
              <p>ANY BULLET</p>
            </div>
            <div
              className="box lg quick-box"
              onClick={() => onQuickPlay(0, 0, GameType.Blitz)}
            >
              <p>ANY BLITZ</p>
            </div>
          </div>
          <div
            className="row quick-box"
            onClick={() => onQuickPlay(0, 0, GameType.Rapid)}
          >
            <div className="box lg">
              <p>ANY RAPID</p>
            </div>
            <div
              className="box lg quick-box"
              onClick={() => onQuickPlay(0, 0, GameType.Classical)}
            >
              <p>ANY CLASSICAL</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const connected = connect<any, IActionProps>(null, {
  clear: GameplayActions.clear,
})(QuickPairingModal);

export default connected;
