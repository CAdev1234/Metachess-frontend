import React, { useCallback, useEffect, useRef, useState } from "react";
import ChessboardWrapper from "../../../components/SpectatingChessboardWrapper";
import { IPieceMove } from "../../../components/ChessboardWrapper/interface";
import GameInfo from "../../../components/SpectatingChessboardWrapper/GameInfo";
import MovesHistory from "../../../components/SpectatingChessboardWrapper/MoveHistory";
import {
  GameRules,
  IMoveSocket,
  PieceSide,
} from "../../../interfaces/game.interfaces";
import SocketService from "../../../services/socket.service";
import {
  IGameplayElos,
  IMoveWithTimestamp,
} from "../../../store/gameplay/gameplay.interfaces";
import { IUser } from "../../../store/user/user.interfaces";
import { useDispatch, useSelector } from "react-redux";
import { IAppState } from "../../../store/reducers";
import { navigate } from "gatsby";
import subscribeToSpectate from "../../../lib/spectate";
import {
  ISpectateNotification,
  ISpectateReducer,
  NOTIFICATION_TYPE,
} from "../../../store/spectate/spectate.interfaces";
import { Actions } from "../../../store/spectate/spectate.action";
import { INITIAL_FEN } from "../../game";
import WinModal from "../../../components/WinModal";
import { getGameTypeElo } from "../../../helpers/gameTypeHelper";
import { getOpponentName } from "../../../helpers/getOpponentNameByPlayMode";

interface SpectatingRoomInfo {
  secondPlayer?: IUser;
  host?: IUser;
  gameRules?: GameRules;
  startDate?: number;
  gameElos?: IGameplayElos;
  gameStartDate?: number;
  historyMoves?: Array<IMoveWithTimestamp>;
  hostLeft?: boolean;
  hostTimeLeft?: number;
  isHostTurn?: boolean;
  secondPlayerLeft?: boolean;
  secondPlayerTimeLeft?: number;
  spectatorNotifications?: [];
  whitePieces?: { Id: number };
}

const Spectating = (props: any) => {
  const [showEndModal, setShowEndModal] = useState<boolean>(false);
  const [winner, setWinner] = useState<"b" | "w" | "draw" | null>(null);
  const [replayState, setReplayState] = useState<
    "live" | "replay" | "replay-live"
  >("live");
  const replayStateRef = useRef<"live" | "replay" | "replay-live">(replayState);
  const [updater, setupdater] = useState<boolean>(false);
  const initialized = useRef<boolean>(false);
  const replayTimeout = useRef<NodeJS.Timeout>(null);
  const chessboardWrapperRef = useRef<ChessboardWrapper>(null);
  const dispatch = useDispatch();
  const idTimeoutShowModal = useRef<NodeJS.Timeout>(null);
  const {
    spectate: { roomInfo },
  }: { spectate: ISpectateReducer } = useSelector((state: IAppState) => state);
  const currentUser = useSelector((state: IAppState) => state.user.currentUser);
  const currentReplayIndex = useRef<number>(0);
  // const spectListRef = useRef<Partial<IUser>[]>([]);
  const currentLiveReplayIndex = useRef<number>(0);
  // const missedSocketActions = useSelector(
  //   (state: IAppState) => state.gameplay.missedSocketActions
  // );
  const fen = useRef<string>(roomInfo?.gameFen || INITIAL_FEN);
  useEffect(() => {
    return () => {
      dispatch(Actions.setGameChatShow(false));
      dispatch(Actions.setGameChatOpen(false));
    };
  }, []);
  const serverStatus = useSelector(
    (state: IAppState) => state.user.serverStatus
  );
  useEffect(() => {
    if (replayState !== "replay-live")
      fen.current = roomInfo?.gameFen || INITIAL_FEN;
  }, [roomInfo?.gameFen, replayState]);
  useEffect(() => {
    replayStateRef.current = replayState;
  }, [replayState]);
  useEffect(() => {
    if (replayState === "live")
      currentLiveReplayIndex.current = roomInfo?.historyMoves.length || 0;
  }, [roomInfo?.historyMoves, replayState]);
  useEffect(() => {
    const roomId: string = props.id;
    console.log(roomId);
    subscribeToSpectate(roomId, currentUser);
    return () => clearTimeout(replayTimeout.current);
  }, []);
  // useEffect(() => {
  //   spectListRef.current = roomInfo?.spectlist;
  // }, [roomInfo?.spectlist]);
  // useEffect(() => {
  //   console.log("missed ", missedSocketActions);
  //   missedSocketActions.forEach((t) => {
  //     console.log("y ", t);
  //     if (t && t[0] && t[0] === "spectators-update") {
  //       // @ts-ignore
  //       // @ts-nocheck
  //       dispatch(Actions.setSpectators(t[1]));
  //     }
  //   });
  // }, [missedSocketActions]);
  const handleMove = (
    fen: string,
    playerOnMove: string,
    move?: string,
    shouldRerender?: boolean,
    isCheck?: boolean,
    isCheckmate?: boolean,
    isDraw?: boolean,
    isRepetition?: boolean,
    isStalemate?: boolean
  ): void => {
    dispatch(
      Actions.addInMoveHistory({
        move: move,
        timestamp: new Date().getTime(),
        fen,
        isCheck,
        isCheckmate,
        isDraw,
        isRepetition,
        isStalemate,
      })
    );
    dispatch(Actions.setOnMove(playerOnMove));
  };
  const onGameEnd = (
    winner: "b" | "w" | "draw",
    isReplay = false,
    calledByChessboard: boolean = false
  ) => {
    dispatch(Actions.stopTimers());
    if (calledByChessboard)
      idTimeoutShowModal.current = setTimeout(() => {
        setShowEndModal(true);
        setWinner(winner);
      }, 2000);
    else {
      setWinner(winner);
      setShowEndModal(true);
    }
    if (!isReplay) {
      dispatch(Actions.setGameEndDate(new Date().getTime()));
      dispatch(Actions.setGameWinner(winner));
    }
  };
  // console.log(replayState);
  const movePieceCallback = (moveInfo: IMoveSocket) => {
    if (replayStateRef.current === "live") {
      // currentReplayIndex.current = roomInfo?.moveHistory.length + 1;
      chessboardWrapperRef?.current?.handleMove(moveInfo.move as string, true);
    } else {
      handleMove(
        moveInfo.fen,
        roomInfo.historyMoves.length % 2 === 0 ? "b" : "w",
        moveInfo.move as string,
        false,
        moveInfo.isCheck,
        moveInfo.isCheckmate,
        moveInfo.isDraw,
        moveInfo.isRepetition,
        moveInfo.isStalemate
      );
      if (moveInfo.isCheckmate) {
        // fen.current = moveInfo.fen;
        const hostId = roomInfo.host.GuestId || roomInfo.host.Id;
        const winnerId = moveInfo.winner.Id || moveInfo.winner.GuestId;
        const hostIsWinner = hostId === winnerId;
        const opponentColor = roomInfo?.hostColor === "w" ? "b" : "w";
        const winnerVariable = !hostIsWinner
          ? opponentColor
          : roomInfo?.hostColor;
        dispatch(Actions.stopTimers());
        onGameEnd(winnerVariable, false, true);
        setWinner(winnerVariable);

        dispatch(Actions.setGameEndDate(new Date().getTime()));
        dispatch(Actions.setGameWinner(winnerVariable));
      }
      if (moveInfo.isDraw || moveInfo.isRepetition || moveInfo.isStalemate) {
        dispatch(Actions.stopTimers());
        onGameEnd("draw", false, true);
        setWinner("draw");

        dispatch(Actions.setGameEndDate(new Date().getTime()));
        dispatch(Actions.setGameWinner("draw"));
      }
    }
    dispatch(
      Actions.setManualTimer({
        black:
          roomInfo.hostColor === "b"
            ? moveInfo.hostTimeLeft
            : moveInfo.secondPlayerTimeLeft,
        white:
          roomInfo.hostColor === "w"
            ? moveInfo.hostTimeLeft
            : moveInfo.secondPlayerTimeLeft,
      })
    );
  };
  const spectateNotificationCallback = (
    spectateNotification: ISpectateNotification
  ) => {
    console.log(spectateNotification);
    if (spectateNotification.Type === NOTIFICATION_TYPE.SpectatorMessage) {
      if (
        spectateNotification.Account.Id === currentUser?.Id ||
        spectateNotification.Account.GuestId === currentUser?.GuestId
      )
        return;
      dispatch(
        Actions.newMessage({
          message: spectateNotification.Message,
          sender: spectateNotification.Account as IUser,
          date: new Date(spectateNotification.Timestamp),
          isNotification: false,
        })
      );
      return;
    }
    const initiatorId =
      spectateNotification.AccountId || spectateNotification.GuestId;
    const hostId = roomInfo?.host?.Id || roomInfo?.host?.GuestId;
    const initiatorIsHost = initiatorId === hostId;
    const opponentColor = roomInfo?.hostColor === "w" ? "b" : "w";
    let message = "";
    const otherPlayerUsername = initiatorIsHost
      ? getOpponentName(false, null, roomInfo.secondPlayer)
      : getOpponentName(false, null, roomInfo.host);
    const initiatorUsername: string = initiatorIsHost
      ? getOpponentName(false, null, roomInfo.host)
      : getOpponentName(false, null, roomInfo.secondPlayer);
    switch (spectateNotification.Type) {
      case NOTIFICATION_TYPE.AcceptDraw:
        message = `${initiatorUsername} has accepted the draw`;
        onGameEnd("draw");
        break;
      case NOTIFICATION_TYPE.Resign:
        message = `${initiatorUsername} has resigned`;
        onGameEnd(!initiatorIsHost ? roomInfo.hostColor : opponentColor);
        break;
      case NOTIFICATION_TYPE.LeavePromptDraw:
        onGameEnd("draw");
        break;
      case NOTIFICATION_TYPE.LeavePromptWin:
        onGameEnd(initiatorIsHost ? roomInfo.hostColor : opponentColor);
        break;
      case NOTIFICATION_TYPE.BackToGame:
        message = `${initiatorUsername} has returned to the game`;
      case NOTIFICATION_TYPE.DrawRequest:
        message = `${initiatorUsername} has requested a draw`;
        break;
      case NOTIFICATION_TYPE.DeclineDraw:
        message = `${initiatorUsername} has declined the draw`;
        break;
      case NOTIFICATION_TYPE.Leave:
        message = `${initiatorUsername} has left the game`;
        break;
      case NOTIFICATION_TYPE.Chat:
        message = `${initiatorUsername} sent a message to ${otherPlayerUsername}`;
      case NOTIFICATION_TYPE.Cancelled:
        message = `The Game was cancelled`;
        onGameEnd("draw");
        break;
      default:
        break;
    }
    if (message) {
      // const sender = spectListRef.current?.find(
      //   (spectator: Partial<IUser>) =>
      //     spectator.Id === spectateNotification.AccountId ||
      //     spectator.GuestId === spectateNotification.GuestId
      // );
      // if (!sender) return;
      dispatch(
        Actions.newMessage({
          message,
          isNotification: true,
        })
      );
    }
  };
  useEffect(() => {
    console.log("notifs ", roomInfo?.spectatorNotifications);
    roomInfo?.spectatorNotifications?.forEach((notification) =>
      spectateNotificationCallback(notification)
    );
  }, [roomInfo?.spectatorNotifications]);
  const initialize = () => {
    initialized.current = true;
    SocketService.subscribeTo({
      eventName: "spectate-piece-move",
      callback: movePieceCallback,
    });
    SocketService.subscribeTo({
      eventName: "spectators-notification",
      callback: spectateNotificationCallback,
    });
    // SocketService.subscribeTo({
    //   eventName: "spectators-update",
    //   callback: (spectators: Partial<IUser>[]) => {
    //     console.log("spectators ", spectators);
    //     dispatch(Actions.setSpectators(spectators));
    //   },
    // });
  };
  const onReplayNext = () => {
    if (currentReplayIndex.current === roomInfo?.historyMoves?.length) return;
    clearTimeout(replayTimeout.current);
    // dispatch(
    //   Actions.setOnMove((currentReplayIndex.current - 1) % 2 === 0 ? "w" : "b")
    // );
    // dispatch(
    //   Actions.setMoveHistory(
    //     roomInfo?.moveHistory.slice(0, currentReplayIndex.current)
    //   )
    // );
    const historyWithTimestamp = roomInfo?.historyMoves;
    chessboardWrapperRef?.current?.handleMove(
      historyWithTimestamp[currentReplayIndex.current].move as string,
      true
    );
    fen.current = roomInfo?.historyMoves?.[currentReplayIndex.current].fen;
    currentReplayIndex.current++;
    // currentReplayIndex.current += 1;
    setupdater(!updater);
    replayTimeout.current = setTimeout(
      () => recursiveReplayFunction(currentReplayIndex.current),
      2000
    );
  };
  const onSetLive = () => {
    fen.current = roomInfo?.gameFen;
    currentLiveReplayIndex.current = roomInfo?.historyMoves.length;
    setReplayState("live");
  };
  const onLivePreviousReplay = () => {
    if (currentLiveReplayIndex.current < 0) return;
    if (currentLiveReplayIndex.current <= 1) {
      currentLiveReplayIndex.current = 0;
      fen.current = INITIAL_FEN;
    } else {
      const temp = currentLiveReplayIndex.current - 1;
      const historyWithTimestamp = roomInfo?.historyMoves;
      currentLiveReplayIndex.current -= 1;
      fen.current = historyWithTimestamp[temp - 1].fen || INITIAL_FEN;
    }
    setReplayState("replay-live");
  };
  const onLiveNextReplay = () => {
    if (currentLiveReplayIndex.current === roomInfo?.historyMoves?.length) {
      setReplayState("live");
      return;
    }
    const move = roomInfo?.historyMoves[currentLiveReplayIndex.current];
    fen.current = move.fen;
    currentLiveReplayIndex.current += 1;
    if (currentLiveReplayIndex.current === roomInfo?.historyMoves?.length) {
      // if (winner) {
      //   onGameEnd(winner);
      // }
      setReplayState("live");
      return;
    }
    setReplayState("replay-live");
  };
  const onReplayPrevious = () => {
    if (currentReplayIndex.current < 0) return;
    clearTimeout(replayTimeout.current);
    if (currentReplayIndex.current <= 1) {
      dispatch(Actions.setMoveHistory(roomInfo?.moveHistory.slice(0, 0)));
      dispatch(Actions.setOnMove("w"));
      currentReplayIndex.current = 0;
      fen.current = INITIAL_FEN;
      replayTimeout.current = setTimeout(
        () => recursiveReplayFunction(0),
        2000
      );
    } else {
      const temp = currentReplayIndex.current - 1;
      dispatch(Actions.setMoveHistory(roomInfo?.moveHistory.slice(0, temp)));
      dispatch(Actions.setOnMove(temp % 2 === 0 ? "b" : "w"));
      const historyWithTimestamp = roomInfo?.historyMoves;
      currentReplayIndex.current -= 1;
      fen.current = historyWithTimestamp[temp - 1].fen || INITIAL_FEN;
      replayTimeout.current = setTimeout(
        () => recursiveReplayFunction(temp),
        2000
      );
    }
  };

  const doReplay = async (
    last?: number,
    moveHistory?: string[],
    onMove?: string
  ) => {
    dispatch(Actions.setOnMove(onMove || "w"));
    dispatch(Actions.setMoveHistory(moveHistory || []));
    currentReplayIndex.current = 0;
    fen.current = INITIAL_FEN;
    setReplayState("replay");
    realReplay();
  };

  const recursiveReplayFunction = (index: number) => {
    const historyWithTimestamp = roomInfo?.historyMoves;
    if (index === historyWithTimestamp.length) {
      const { gameEndDate, winner } = roomInfo;
      onGameEnd(winner, true);
      return;
    }
    const m = historyWithTimestamp[index];
    console.log(currentReplayIndex, index);
    chessboardWrapperRef?.current?.handleMove(m.move as string, true);
    fen.current = m.fen;
    // dispatch(Actions.setMoveHistory(roomInfo?.historyMoves.slice(0, index + 1)));
    // dispatch(Actions.setOnMove(index % 2 === 0 ? "b" : "w"));
    setupdater(!updater);
    currentReplayIndex.current = index + 1;
    replayTimeout.current = setTimeout(
      () => recursiveReplayFunction(index + 1),
      2000
    );
  };

  const realReplay = async () => {
    replayTimeout.current = setTimeout(() => recursiveReplayFunction(0), 2000);
  };
  if (!roomInfo?.gameRules) return <div>spectatin</div>;
  if (!initialized.current) initialize();
  return (
    <div className="gameContainer">
      {showEndModal && (
        <WinModal
          onReplay={async () => {
            // this.props.setReplay(true);
            dispatch(Actions.setReplay(true));
            setShowEndModal(false);
            setWinner(null);
            doReplay();
          }}
          prefix="Game Host"
          onClose={() => {
            setShowEndModal(false);
          }}
          opponent={roomInfo.secondPlayer}
          // key={String(showEndModal)}
          isReplay={roomInfo.isReplay}
          elo={
            roomInfo.gameRules &&
            getGameTypeElo(roomInfo.gameRules.type, roomInfo.host)
          }
          gameElos={roomInfo.gameElos}
          gameRules={roomInfo.gameRules}
          winner={winner}
          playerColor={roomInfo.hostColor}
          //@ts-ignore
          playMode={{ isHumanVsHuman: true, isAI: false }}
        />
      )}
      <div className="gameWrapper">
        {/* <Chat /> */}
        <MovesHistory />
        <ChessboardWrapper
          gameRules={roomInfo?.gameRules}
          ref={chessboardWrapperRef}
          fen={fen.current}
          playerColor={roomInfo.hostColor}
          timerLimit={5 * 1000 * 60}
          // key={fen.current}
          timerBonus={3 * 1000}
          handleMove={handleMove}
          onGameEnd={onGameEnd}
          // aiDifficulty={playMode.aiMode}
          // opponent={roomInfo?.opponent}
          // host={roomInfo?.host}
          onSetLive={onSetLive}
          isReplay={roomInfo.isReplay}
          winner={roomInfo?.winner}
          playMode={{
            isHumanVsHuman: true,
            isAI: false,
            roomName: props.id,
            aiMode: 0,
            isCreate: true,
          }}
          moveHistoryData={roomInfo?.historyMoves}
          serverStatus={serverStatus}
          onReplayPrevious={
            replayState !== "replay" ? onLivePreviousReplay : onReplayPrevious
          }
          onReplayNext={
            replayState !== "replay" ? onLiveNextReplay : onReplayNext
          }
          opponent={roomInfo?.secondPlayer}
          host={roomInfo?.host}
          timer={roomInfo?.timer}
        />
        {/* {!playMode.isAI && !props.isReplay && (
            <ActionButtons
              draw={onDrawRequest}
              drawEnabled={drawTimes < 5}
              resign={onResign}
            />
          )} */}
        <GameInfo
          onReplayPrevious={
            replayState !== "replay" ? onLivePreviousReplay : onReplayPrevious
          }
          onSetLive={onSetLive}
          onReplayNext={
            replayState !== "replay" ? onLiveNextReplay : onReplayNext
          }
          showFirstMoveTime={false}
        />

        {/* {showOpponentLeftModal && (
            <OpponentLeftModal
              playerColor={props.playerColor}
              onAnswer={(a) => {
                setState({ showOpponentLeftModal: false });
                SocketService.sendData(
                  "leave-game-prompt",
                  a !== "draw",
                  () => { }
                );
                onGameEnd(a);
              }}
            />
          )} */}
      </div>
    </div>
  );
};

export default Spectating;
