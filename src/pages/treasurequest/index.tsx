import React, {
  CSSProperties,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { Square } from "chess.js";
import { navigate } from "gatsby";
import crackedImage from "../../assets/images/crackedImage.jpg";
import treasureAudio from "../../assets/audios/treasureSound.mp3";
import wrongAudio from "../../assets/audios/wrongSound.mp3";
import { useDispatch, useSelector } from "react-redux";
import { IAppState } from "../../store/reducers";
import { Actions } from "../../store/treasureHunt/treasureHunt.action";
import { Actions as UserActions } from "../../store/user/user.action";
import useAudio from "../../helpers/hooks/useAudio";
import { isSSR } from "../../lib/utils";
import MoveHistory from "../../components/MovesHistoryTreasureHunt";
import GameInfo from "../../components/GameInfoTreasureHunt";
import {
  move,
  moveList,
} from "../../store/treasureHunt/treasureHunt.interface";
import TreasureLoot from "../../components/TreasureHuntLootInfo";
import SocketService from "../../services/socket.service";
import { toast } from "react-toastify";
import { MODES } from "../../constants/playModes";
import { IServerStatus, IUser } from "../../store/user/user.interfaces";
import CelebrationOverlay from "../../components/CelebrationOverlay";
const Chessboard = React.lazy(() => import("chessboardjsx"));

const WINDOW_WIDTH_LIMIT = 768;
export interface squareStyles {
  [square in Square]?: CSSProperties;
}
interface todayAttempts {
  todayAttempts: number;
}
export enum PlayEnum {
  OK,
  OKGameFinished,
  AttemptsExceeded,
  PlaceAlreadyClicked,
}
interface placeSquareResponse {
  status: PlayEnum;
  level: null | number;
}

const index = () => {
  const dispatch = useDispatch();
  const [playingTreasure, playTreasure] = useAudio(treasureAudio, false);
  const [playingWrong, playWrong] = useAudio(wrongAudio, true);
  const [squareStyles, setSquareStyles] = useState<squareStyles>({});
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  const { serverStatus }: { serverStatus: IServerStatus } = useSelector(
    (state: IAppState) => state.user
  );
  const user: IUser = useSelector(
    (state: IAppState): IUser => state.user.currentUser
  );
  const {
    moveList,
    gameOver,
    gameInProgress,
  }: { moveList: moveList; gameOver: boolean; gameInProgress: boolean } =
    useSelector((state: IAppState) => state.treasureHunt);
  const wrapperRef = useRef<HTMLDivElement>();
  const gameOverRef = useRef<boolean>(gameOver);
  const timeOutId = useRef<NodeJS.Timer>(null);
  const squareStyling = (pieceSquare: string) => {
    console.log(pieceSquare);
    return {
      [pieceSquare]: {
        background: `url(${crackedImage})`,
      },
    };
  };
  let windowHeight = WINDOW_WIDTH_LIMIT;
  // const limitedHeight =
  if (!isSSR) windowHeight = window.innerHeight;
  let windowWidth = 1280;
  if (!isSSR) windowWidth = window.innerWidth;
  let chessWidth =
    windowWidth <= WINDOW_WIDTH_LIMIT ? windowWidth : windowWidth / 2;
  let chessHeight = WINDOW_WIDTH_LIMIT;

  if (wrapperRef?.current) {
    chessHeight = wrapperRef.current.clientHeight;
    console.log(chessHeight, chessWidth, windowWidth);
    if (chessHeight < chessWidth) chessWidth = chessHeight;
  }
  useEffect(() => {
    if (!user || !user.Username) {
      navigate("/");
      // toast.error("Guests cannot play Treasure Quest mode", {
      //   position: toast.POSITION.BOTTOM_RIGHT,
      //   autoClose: 10000,
      //   closeOnClick: true,
      // });
    } else if (!gameInProgress) {
      SocketService.sendData(
        "start-treasure-hunt",
        null,
        (response: boolean | todayAttempts) => {
          console.log(response);
          const message =
            response === null
              ? `Game Could Not Be Created.`
              : typeof response === "object"
              ? `You have exceeded the number of attempts for today. You have already played ${response.todayAttempts} times`
              : "";
          if (!response || response !== true) {
            toast.error(message, {
              position: toast.POSITION.BOTTOM_RIGHT,
              autoClose: 10000,
              closeOnClick: true,
            });
            dispatch(UserActions.setChoseMode(MODES.CHOSE_MODE));
            navigate("/choose-mode");
          } else {
            dispatch(Actions.setGameInProgress(true));
            dispatch(Actions.setGameInProgressAndUserNavigating(false));
          }
        }
      );
    } else {
      let tempObj: squareStyles = {};
      moveList.forEach(
        (move: move) => (tempObj = { ...tempObj, ...squareStyling(move.place) })
      );
      setSquareStyles((squareStyles: squareStyles) => ({
        ...squareStyles,
        ...tempObj,
      }));
      SocketService.sendData("resume-my-game-treasure-hunt", null, null);
      dispatch(Actions.setGameInProgressAndUserNavigating(false));
    }
    return () => {
      console.log(gameOverRef.current);
      if (!gameOverRef.current) {
        SocketService.sendData("leave-game-treasure-hunt", null, null);
        dispatch(Actions.setTimeLeft(600))
        dispatch(Actions.setGameInProgressAndUserNavigating(true));
      } else {
        dispatch(Actions.resetGame(false));
      }
      if (timeOutId.current) clearTimeout(timeOutId.current);
    };
  }, []);
  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);
  // alert(chessWidth);
  //square click handler
  const handleSquareClick = (squareId: string): void => {
    if (Object.keys(moveList).includes(squareId) || gameOver) return;
    SocketService.sendData(
      "treasure-hunt-place",
      squareId,
      (response: placeSquareResponse | null) => {
        console.log(response);
        if (response === null) {
          toast.error("Server Error! Could not capture click. Try Again!", {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 10000,
            closeOnClick: true,
          });
        } else if (
          response.status === PlayEnum.OK ||
          response.status === PlayEnum.OKGameFinished
        ) {
          if (serverStatus.TreasureQuestSound) {
            if (!response.level) {
              playWrong();
            } else {
              playTreasure();
            }
          }
          dispatch(
            Actions.onMove({
              move: {
                place: squareId.toString(),
                level: response.level,
              },
              loot: serverStatus[`Level${response.level}TreasureValue`] || 0,
            })
          );
          if (response.status === PlayEnum.OKGameFinished)
            dispatch(Actions.setGameEndDate(new Date().getTime()));
          document
            .querySelector(`div[data-squareid="${squareId}"]`)
            .classList.add(
              "animating",
              `animating-${(response.level && "treasure") || "digging"}`
            );
          if (response.level === 3) {
            setShowAnimation(true);
            timeOutId.current = setTimeout(() => setShowAnimation(false), 5000);
          }
        } else if (response.status === PlayEnum.AttemptsExceeded) {
          toast.error("You Have Already exceeded number of attempts", {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 10000,
            closeOnClick: true,
          });
        } else if (response.status === PlayEnum.PlaceAlreadyClicked) {
          toast.error("You Have Already Clicked This Square", {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 10000,
            closeOnClick: true,
          });
        }
      }
    );
  };
  return (
    <section className="gameContainer" style={{ maxWidth: "100%" }}>
      <section
        className="gameWrapper"
        style={{
          alignItems: "baseline",
          overflow: "hidden",
          gap: "3vmax",
          padding: "0 2vmax 5vmin",
          justifyContent: "space-around",
        }}
      >
        {/* {windowWidth > 768 && (
          <section
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
              flexDirection: "column",
            }}
          >
            <TreasureLoot />
            <MoveHistory />
          </section>
        )} */}
        <section className="treasureQuestMoves">
          <TreasureLoot />
          <hr />
          <MoveHistory />
        </section>
        <div
          className="chessboardContainer"
          style={{
            maxWidth: chessWidth,
          }}
        >
          <div
            className={"chessboardWrapper treasureHunt"}
            style={{ minWidth: chessWidth, flex: "initial" }}
            ref={wrapperRef}
          >
            {/* <div
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                justifyContent: "start",
              }}
            > */}
            {!isSSR && (
              <React.Suspense fallback={<div />}>
                <Chessboard
                  width={chessWidth}
                  onSquareClick={handleSquareClick}
                  squareStyles={squareStyles}
                  darkSquareStyle={{
                    background: `${serverStatus.BoardEvenSquaresColor} 0% 0% no-repeat padding-box`,
                  }}
                  lightSquareStyle={{
                    background: `${serverStatus.BoardOddSquaresColor} 0% 0% no-repeat padding-box`,
                  }}
                />
              </React.Suspense>
            )}
            {/* </div> */}
            {showAnimation ? <CelebrationOverlay /> : null}
          </div>
        </div>

        {/* {windowWidth <= 768 && ( */}
        {/* )} */}
        <GameInfo setSquareStyles={setSquareStyles} />
      </section>
    </section>
  );
};

export default index;
