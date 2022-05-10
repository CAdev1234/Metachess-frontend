import React, { Component, useState, useContext } from "react";
import Switch from "react-switch";
import { SVG_ASSETS } from "../../constants/svgAssets";
import Modal from "../Modal";
import { Actions as GameplayActions } from "../../store/gameplay/gameplay.action";

import { connect } from "react-redux";
import {
  GameMode,
  GameRules,
  PieceSide,
} from "../../interfaces/game.interfaces";
import SocketService from "../../services/socket.service";
import { navigate } from "gatsby";
import { ToastContext } from "../ToastProvider";
import CreatedARoom from "../Toasts/CreatedARoom";
import { IUser } from "../../store/user/user.interfaces";
import subscribeToGameStart from "../../lib/gameStart";
import { IAppState } from "../../store/reducers";
import { ISetPlayModePayload } from "../../store/gameplay/gameplay.interfaces";
import Button from "../Button";
import AlertToast from "../AlertToast"
import { toast } from "react-toastify";


interface IActionProps {
  setGameRules: typeof GameplayActions.setGameRules;
  setPlayMode: typeof GameplayActions.setPlayMode;
  setOpponent: typeof GameplayActions.setOpponent;
  setPlayerColor: typeof GameplayActions.setPlayerColor;
  clear: typeof GameplayActions.clear;
}
interface ISelectProps {
  playMode: ISetPlayModePayload;
}

interface IProps extends IActionProps {
  closeModal: () => void;
  gameMode: String;
}

const copyClip = (string:string) => {
  return navigator.clipboard.writeText(string)
}

const NewGameModal = (props: IProps & ISelectProps) => {
  const [checked, setChecked] = useState(false);
  const [minAmountChessCoin, setMinAmountChessCoin] = useState(0.0);
  const [maxAmountChessCoin, setMaxAmountChessCoin] = useState(0.0);
  const [rating, setRating] = useState(5);
  const [time, setTime] = useState(3);
  const [increment, setIncrement] = useState(0);
  const [gameMode, setGameMode] = useState(GameMode.Casual);
  const [side, setSide] = useState(null);

  const toastContext = useContext(ToastContext);

  const onCancel = () => {
    // toastContext.hideToast();
    console.log("leave-game canceling the game on onCancel()")
    SocketService.sendData("leave-game", null);
    // props.clear();
  };
  const onCreateGame = () => {
    const chessCoin = checked
      ? {
          minium: minAmountChessCoin,
          maxium: maxAmountChessCoin,
        }
      : null;
    const hostSide = !side
      ? PieceSide.Random
      : side === "w"
      ? PieceSide.White
      : PieceSide.Black;
    const gameRules: GameRules = {
      chessCoin,
      hostSide,
      rating: rating,
      mode: gameMode,
      time: {
        base: time,
        increment,
      },
    };

    subscribeToGameStart(props.gameMode);
    SocketService.sendData(
      "create-custom-game",
      gameRules,
      (roomToken: string) => {
        // TODO: if roomtoken is null, something is wrong with rules
        console.log("create-custom-game:", roomToken);
        // toastContext.showToast(
        //   <CreatedARoom onCancel={onCancel} roomCode={roomToken} />
        // );
        const id = toast(
          <AlertToast 
            onConfirm={() => copyClip(`${location.origin}/join-game?roomId=${roomToken}&game-mode=${props.gameMode}`)} 
            onDecline={onCancel}
            buttonTitles={{first:"Copy Code",second:"Cancel"}}
            closeEnable={{first:false,second:true}}
          >
            <div>
              <p className="title">
                {"Waiting for a player to join your match..."}
              </p>
              <br />
              <p className="gameCodeTitle">{"MATCH CODE:"}</p>
              <p className="gameCode">{roomToken}</p>
              <br />
            </div>
          </AlertToast>
          ,
          {
            className:"newGame__toast",
            autoClose: false,
            closeOnClick: false,
            closeButton: false,
            position: 'top-left',
            theme:"dark",
            draggable: false,
            // onClose: () => onCancel()
          }
        )
        props.closeModal();
      }
    );
  };

  return (
    <Modal onClose={props.closeModal} withBorder>
      <div className={"newGame"}>
        {/* <div className={"headerRow"}>
          <h3>Betting settings</h3>
          <div className={"switch"}>
            <Switch
              onChange={setChecked}
              checked={checked}
              handleDiameter={22}
              onColor={"#00AC2E"}
              checkedIcon={false}
              uncheckedIcon={false}
            />
          </div>
        </div> */}
        <div className={"headerRow"}>
          <h3>Game setup</h3>
        </div>
        <div className={"row"}>
          <div className={"item"}>
            <h5>Select sides</h5>
            <div className={"sideItems sides"}>
              <div
                className={!side ? "sideClicked" : "side"}
                onClick={() => {
                  setSide(null);
                }}
              >
                <img src={SVG_ASSETS.bwSide} />
              </div>
              <div
                className={side === "w" ? "sideClicked" : "side"}
                onClick={() => {
                  setSide("w");
                }}
              >
                <img src={SVG_ASSETS.wSide} />
              </div>
              <div
                className={side === "b" ? "sideClicked" : "side"}
                onClick={() => {
                  setSide("b");
                }}
              >
                <img src={SVG_ASSETS.bSide} />
              </div>
            </div>
          </div>
          <div className={"item"}>
            <h5>Mode</h5>

            <div className={"sideItems dropdownItem"}>
              <select
                onChange={(e) => setGameMode(e.target.value as any)}
                value={gameMode}
              >
                <option value={GameMode.Casual}>Casual</option>
                <option value={GameMode.Rated}>Rated</option>
              </select>
            </div>
          </div>
        </div>
        <div className={"row"}>
          <div className={"item no-content"}></div>
          <div className={"item"}>
            <div className={"sideItems timeAndIncrementTitle"}>
              <h5>Time</h5>
              <span className="inBetween"></span>
              <h5>Increment</h5>
            </div>

            <div className={"sideItems inputValue"}>
              <input
                value={time}
                onChange={(e) => setTime(Number(e.target.value))}
                type={"number"}
              />
              <div className={"inBetween"}>+</div>
              <input
                value={increment}
                onChange={(e) => setIncrement(Number(e.target.value))}
                type={"number"}
              />
            </div>
          </div>
        </div>
        <div className={"createGame"}>
          <Button onClick={onCreateGame}>Create Game</Button>
        </div>
      </div>
    </Modal>
  );
};

const mapStateToProps = (state: IAppState): ISelectProps => ({
  playMode: state.gameplay.playMode,
});

const connected = connect<ISelectProps, IActionProps>(mapStateToProps as any, {
  setGameRules: GameplayActions.setGameRules,
  setPlayMode: GameplayActions.setPlayMode,
  setOpponent: GameplayActions.setOpponent,
  setPlayerColor: GameplayActions.setPlayerColor,
  clear: GameplayActions.clear,
})(NewGameModal);

export default connected;
