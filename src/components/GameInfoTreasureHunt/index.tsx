import { navigate } from "gatsby";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { MODES } from "../../constants/playModes";
import { Actions as UserActions } from "../../store/user/user.action";
import { squareStyles } from "../../pages/treasurequest";
import SocketService from "../../services/socket.service";
import { IAppState } from "../../store/reducers";
import { Actions } from "../../store/treasureHunt/treasureHunt.action";
import { ITreasureHuntReducer } from "../../store/treasureHunt/treasureHunt.interface";

interface IProps {
  setSquareStyles: (styles: squareStyles) => void;
}

const GameInfo = (props: IProps) => {
  const { chancesRemaining, gameOver } = useSelector(
    (state: IAppState): ITreasureHuntReducer => state.treasureHunt
  );
  const dispatch = useDispatch();
  return (
    <div className="chessboardSidebarWrapper treasureHuntInfoWrapper" style={{ margin: "0",maxWidth:"25vmax" }}>
      <div className="timersWrapper">
        <div className="gameInfoContainer">
          <p className="gameInfoTitle">{"Game Info"}</p>
          <p className="gameDetail" style={{fontSize:"20px",fontWeight:"400"}}>Attempts Left:{chancesRemaining}</p>
        </div>
        {gameOver && (
          <button
            className="claimButton"
            onClick={() => {
              dispatch(Actions.resetGame(true));
              document
                .querySelectorAll(`.animating`)
                .forEach((el) =>
                  el.classList.remove(
                    "animating",
                    "animating-digging",
                    "animating-treasure"
                  )
                );
              props.setSquareStyles({});
              SocketService.sendData(
                "start-treasure-hunt",
                null,
                (response: boolean | { todayAttempts: number }) => {
                  console.log(response);
                  const message =
                    response === null
                      ? `Game Could Not Be Created.`
                      : typeof response === "object"
                      ? `You have exceeded the number of attempts for today. You have already played ${response.todayAttempts} times`
                      : "";
                  if (response !== true) {
                    toast.error(message, {
                      position: toast.POSITION.BOTTOM_RIGHT,
                      autoClose: 10000,
                      closeOnClick: true,
                    });
                    dispatch(UserActions.setChoseMode(MODES.CHOSE_MODE));
                    navigate("/choose-mode");
                  }
                }
              );
            }}
          >
            Play Again
          </button>
        )}
      </div>
    </div>
  );
};

export default GameInfo;
