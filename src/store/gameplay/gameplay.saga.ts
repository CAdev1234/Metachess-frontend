import { takeLatest, select, put, call } from "redux-saga/effects";
import { ACTION_TYPE } from "./gameplay.action";
import { Actions as gameplayActions } from "./gameplay.action";
import { IAppState } from "../reducers";
import { GameRules, PieceSide } from "../../interfaces/game.interfaces";
import { Timer } from "../../lib/timer";
import store from "..";
import { IGameplayReducer, IGameResume, ITimer } from "./gameplay.interfaces";
import { pullAllBy } from "lodash";
import { navigate } from "gatsby";
import { IUser } from "../user/user.interfaces";
import { ENDPOINTS } from "../../services/endpoints";
import { IMessage } from "../../components/ChessChat";
import API from "../../services/api.service";
import { toast } from "react-toastify";

let BLACK_TIMER: Timer = null;
let WHITE_TIMER: Timer = null;

let BLACK_FIRST_MOVE_TIMER: Timer = null;
let WHITE_FIRST_MOVE_TIMER: Timer = null;

const dispatchTimerChange = () => {
  if (!WHITE_TIMER || !BLACK_TIMER) {
    return;
  }
  store.dispatch(
    gameplayActions.setTimer({
      white: WHITE_TIMER.timeLeft,
      black: BLACK_TIMER.timeLeft,
    })
  );
};

const dispatchFirstTimerChange = () => {
  if (!WHITE_FIRST_MOVE_TIMER || !BLACK_FIRST_MOVE_TIMER) {
    return;
  }
  store.dispatch(
    gameplayActions.setFirstTimer({
      white: WHITE_FIRST_MOVE_TIMER.timeLeft,
      black: BLACK_FIRST_MOVE_TIMER.timeLeft,
    })
  );
};

function* onGameplayMoveHistory({ payload }: { payload: string }) {
  try {
    const {
      gameplay: { moveHistory },
    } = yield select();
    moveHistory.push(payload);
    yield put(gameplayActions.setMoveHistory(moveHistory));
  } catch (e) {
    console.log("err", e);
  }
}

function* onGameStart() {
  const {
    gameplay: { gameRules, onMove },
  } = (yield select()) as IAppState;

  if (!gameRules) return;

  // BLACK_TIMER = new Timer(
  //   gameRules.time.base,
  //   gameRules.time.increment,
  //   startGameDate
  // );
  // WHITE_TIMER = new Timer(
  //   gameRules.time.base,
  //   gameRules.time.increment,
  //   startGameDate
  // );

  // BLACK_FIRST_MOVE_TIMER = new Timer(25 / 60, 0);

  // WHITE_FIRST_MOVE_TIMER = new Timer(25 / 60, 0);

  yield put(
    gameplayActions.setFirstTimer({
      black: 25000,
      white: 25000,
    })
  );

  // if (onMove === "b") {
  //   BLACK_FIRST_MOVE_TIMER.reinit(startGameDate, dispatchFirstTimerChange);
  //   WHITE_FIRST_MOVE_TIMER.stop(startGameDate, false);
  // } else {
  //   WHITE_FIRST_MOVE_TIMER.reinit(startGameDate, dispatchFirstTimerChange);
  //   BLACK_FIRST_MOVE_TIMER.stop(startGameDate, false);
  // }

  yield put(
    gameplayActions.setTimer({
      black: gameRules.time.base * 1000 * 60,
      white: gameRules.time.base * 1000 * 60,
    })
  );
}

function* onSetGameStarted({ payload }: { payload: number }) {
  const {
    gameplay: { onMove },
  } = (yield select()) as IAppState;
  BLACK_FIRST_MOVE_TIMER = new Timer(25 / 60, 0, payload);

  WHITE_FIRST_MOVE_TIMER = new Timer(25 / 60, 0, payload);
  if (onMove === "b") {
    BLACK_FIRST_MOVE_TIMER.reinit(payload, dispatchFirstTimerChange);
    WHITE_FIRST_MOVE_TIMER.stop(payload, false);
  } else {
    WHITE_FIRST_MOVE_TIMER.reinit(payload, dispatchFirstTimerChange);
    BLACK_FIRST_MOVE_TIMER.stop(payload, false);
  }
}

function* onSetLastTimestamp({ payload }: { payload: number }) {
  const { gameplay } = (yield select()) as IAppState;

  if (!WHITE_TIMER && BLACK_TIMER) {
    BLACK_TIMER.finished = true;
    BLACK_TIMER.stop(payload, false);
    BLACK_TIMER.clear();
    BLACK_TIMER = null;
  }
  if (!BLACK_TIMER && WHITE_TIMER) {
    WHITE_TIMER.finished = true;
    WHITE_TIMER.stop(payload, false);
    WHITE_TIMER.clear();
    BLACK_TIMER = null;
  }
  if (gameplay.moveHistory.length === 2) {
    BLACK_TIMER = new Timer(
      gameplay.gameRules.time.base,
      gameplay.gameRules.time.increment,
      payload
    );
    WHITE_TIMER = new Timer(
      gameplay.gameRules.time.base,
      gameplay.gameRules.time.increment,
      payload
    );
    BLACK_FIRST_MOVE_TIMER.clear();
    BLACK_FIRST_MOVE_TIMER.finished = true;
    WHITE_FIRST_MOVE_TIMER.clear();
    WHITE_FIRST_MOVE_TIMER.finished = true;
  }

  if ((!BLACK_TIMER || !WHITE_TIMER) && gameplay.moveHistory.length >= 2) {
    return;
  }
  // BLACK_TIMER.timeLeft = gameplay.timer.black;
  // WHITE_TIMER.timeLeft = gameplay.timer.white;
  if (gameplay.onMove === "b") {
    BLACK_TIMER.reinit(payload, dispatchTimerChange);
    WHITE_TIMER.stop(payload, false);
  } else {
    WHITE_TIMER.reinit(payload, dispatchTimerChange);
    BLACK_TIMER.stop(payload, false);
  }
}

// function* onFetchGameChat() {
//   try {
//     const gameInfo: IGameplayReducer = yield select(
//       (state: IAppState) => state.gameplay
//     );
//     const query: IQuery[] = [
//       { name: "roomId", value: `${gameInfo.gameId}` },
//       {
//         name: "top",
//         value: `25`,
//       },
//     ];
//     const messages: IMessage[] = yield call(() =>
//       API.execute("GET", ENDPOINTS.GET_CHAT, null, query)
//     );
//     yield put(gameplayActions.setGameMessages(messages));
//     yield put(gameplayActions.setGameChatOpen(true));
//   } catch (e) {
//     console.log("err", e);
//   }
// }

function* onNewMessage({
  payload,
}: {
  payload: { message: string; date: Date; isFromOpponent: boolean };
}) {
  try {
    const gamePlay: IGameplayReducer = yield select((state) => state.gameplay);
    const currentUser: IUser = yield select((state) => state.user.currentUser);
    const newUnseen =
      gamePlay.gameChatShowing && gamePlay.gameChatOpen
        ? 0
        : gamePlay.unreadCount + 1;
    yield put(gameplayActions.setUnseenCount(newUnseen));
    yield put(
      gameplayActions.setGameMessages([
        ...gamePlay.gameMessages,
        {
          Message: payload.message,
          Date: payload.date,
          Sender: payload.isFromOpponent ? gamePlay.opponent : currentUser,
        },
      ])
    );
  } catch (error) {
    console.log("err", error);
  }
}

function* onSetFirstMoveTimer({}: {}) {
  const {
    gameplay: { startGameDate, onMove },
  } = (yield select()) as IAppState;
  if (onMove === "b") {
    BLACK_FIRST_MOVE_TIMER.reinit(startGameDate, dispatchFirstTimerChange);
    WHITE_FIRST_MOVE_TIMER.stop(startGameDate, false);
  } else {
    WHITE_FIRST_MOVE_TIMER.reinit(startGameDate, dispatchFirstTimerChange);
    BLACK_FIRST_MOVE_TIMER.stop(startGameDate, false);
  }
}

function* onHideGameToast(){
  toast.dismiss()
}

function* setGameNavigation({payload}:{payload:string}){
  console.log("setting game navigator" , payload)
  navigate(payload)
}

function* onClear() {
  if (BLACK_FIRST_MOVE_TIMER) {
    BLACK_FIRST_MOVE_TIMER.clear();
    BLACK_FIRST_MOVE_TIMER.finished = true;
  }
  if (WHITE_FIRST_MOVE_TIMER) {
    WHITE_FIRST_MOVE_TIMER.clear();
    WHITE_FIRST_MOVE_TIMER.finished = true;
  }
  if (BLACK_TIMER) {
    BLACK_TIMER.clear();
    BLACK_TIMER.finished = true;
  }
  if (WHITE_TIMER) {
    WHITE_TIMER.clear();
    WHITE_TIMER.finished = true;
  }

  BLACK_TIMER = null;
  BLACK_FIRST_MOVE_TIMER = null;
  WHITE_FIRST_MOVE_TIMER = null;
  WHITE_TIMER = null;
}

function* onSetTimer({ payload }: { payload: ITimer }) {
  const { gameplay }: { gameplay: IGameplayReducer } = yield select();
  WHITE_TIMER.timeLeft = payload.white;
  BLACK_TIMER.timeLeft = payload.black;

  if (gameplay.onMove === "b") {
    BLACK_TIMER.reinit(gameplay.lastTimestamp, dispatchTimerChange);
    WHITE_TIMER.stop(gameplay.lastTimestamp, false);
  } else {
    WHITE_TIMER.reinit(gameplay.lastTimestamp, dispatchTimerChange);
    BLACK_TIMER.stop(gameplay.lastTimestamp, false);
  }
}

function* onResumeGame({ payload }: { payload: IGameResume }) {
  const {
    gameRules,
    side,
    identifier: gameId,
    hostTimeLeft,
    secondPlayerTimeLeft,
    playerIsHost,
    isYourTurn,
    gameElos,
  } = payload;
  const currentUser: IUser = yield select((state) => state.user.currentUser);
  if (!currentUser.GuestId && !payload.opponent.GuestId) {
    const query: IQuery[] = [
      { name: "roomId", value: `${gameId}` },
      {
        name: "top",
        value: `25`,
      },
      // { name: "startingAfter", value: `${0}` },
    ];
    const messages: IMessage[] = yield call(() =>
      API.execute("GET", ENDPOINTS.GET_GAME_CHAT, null, query)
    );
    yield put(gameplayActions.setGameMessages(messages.reverse()));
  }
  let playerColor: "w" | "b";
  if (payload.history.length % 2 === 0) {
    if (isYourTurn) playerColor = "w";
    else playerColor = "b";
  } else {
    if (isYourTurn) playerColor = "b";
    else playerColor = "w";
  }
  BLACK_TIMER = new Timer(
    gameRules.time.base,
    gameRules.time.increment,
    payload.startDate
  );
  WHITE_TIMER = new Timer(
    gameRules.time.base,
    gameRules.time.increment,
    payload.startDate
  );

  const lastTimestamp =
    payload.history.length > 0
      ? payload.history[payload.history.length - 1].timestamp
      : payload.startDate;
  // const secondLastTimestamp =
  //   payload.history.length > 1
  //     ? payload.history[payload.history.length - 2].timestamp
  //     : payload.startDate;

  if (playerColor === "w") {
    if (isYourTurn) {
      BLACK_TIMER.stop(lastTimestamp, false);
      WHITE_TIMER.reinit(lastTimestamp, dispatchTimerChange);
    } else {
      WHITE_TIMER.stop(lastTimestamp, false);
      BLACK_TIMER.reinit(lastTimestamp, dispatchTimerChange);
    }
    if (playerIsHost) {
      WHITE_TIMER.timeLeft = hostTimeLeft;
      BLACK_TIMER.timeLeft = secondPlayerTimeLeft;
    } else {
      WHITE_TIMER.timeLeft = secondPlayerTimeLeft;
      BLACK_TIMER.timeLeft = hostTimeLeft;
    }
  } else {
    if (isYourTurn) {
      WHITE_TIMER.stop(lastTimestamp, false);
      BLACK_TIMER.reinit(lastTimestamp, dispatchTimerChange);
    } else {
      BLACK_TIMER.stop(lastTimestamp, false);
      WHITE_TIMER.reinit(lastTimestamp, dispatchTimerChange);
    }
    if (playerIsHost) {
      WHITE_TIMER.timeLeft = secondPlayerTimeLeft;
      BLACK_TIMER.timeLeft = hostTimeLeft;
    } else {
      WHITE_TIMER.timeLeft = hostTimeLeft;
      BLACK_TIMER.timeLeft = secondPlayerTimeLeft;
    }
  }

  yield put(
    gameplayActions.setTimer({
      white: WHITE_TIMER.timeLeft,
      black: BLACK_TIMER.timeLeft,
    })
  );
  // yield put(
  //   gameplayActions.setPlayerColor(side === PieceSide.White ? "w" : "b")
  // );

  yield put(gameplayActions.setGameElos(gameElos));
  yield put(gameplayActions.setPlayerColor(playerColor));
  // yield put(gameplayActions.setPlayerColor();

  yield put(gameplayActions.setOpponent(payload.opponent as IUser));

  yield put(gameplayActions.setGameRules(payload.gameRules));

  yield put(gameplayActions.setGameStartDate(payload.startDate));

  yield put(gameplayActions.setSpectators(payload.spectators));
  yield put(gameplayActions.setGameWinner(null));

  yield put(
    gameplayActions.setPlayMode({
      isAI: false,
      aiMode: null,
      isHumanVsHuman: true,
      isCreate: false,
    })
  );

  const lastFen = payload.history[payload.history.length - 1]?.fen;

  yield put(
    gameplayActions.setResumeParameters({
      isResume: true,
      gameFen: lastFen,
    })
  );

  yield put(gameplayActions.setMoveHistory(payload.history.map((x) => x.move)));
  yield put(gameplayActions.setHistoryWithTimestamp(payload.history));

  // payload.history.forEach((x, index) => {
  //   if (index % 2 === 0) {
  //     BLACK_TIMER.reinit(x.timestamp, dispatchTimerChange);
  //     WHITE_TIMER.stop(x.timestamp);
  //   } else {
  //     WHITE_TIMER.reinit(x.timestamp, dispatchTimerChange);
  //     BLACK_TIMER.stop(x.timestamp);
  //   }
  // });

  // const lastTimeStamp =
  //   payload.history[payload.history.length - 1]?.timestamp ?? payload.startDate;
  // const now = Date.now();
  // if (payload.history.length % 2 === 0) {
  //   WHITE_TIMER.timeLeft -= now - lastTimeStamp;
  // } else {
  //   BLACK_TIMER.timeLeft -= now - lastTimeStamp;
  // }

  yield put(
    gameplayActions.onMove(payload.history.length % 2 === 0 ? "w" : "b")
  );

  navigate("/game");
}

function* watchResumeGame() {
  yield takeLatest(ACTION_TYPE.RESUME_GAME as any, onResumeGame);
}

function* watchGameplayMoveHistory() {
  yield takeLatest(
    ACTION_TYPE.ADD_IN_MOVE_HISTORY as any,
    onGameplayMoveHistory
  );
}

function* watchSetLastTimestamp() {
  yield takeLatest(ACTION_TYPE.SET_LAST_TIMESTAMP as any, onSetLastTimestamp);
}

function* watchSetFirstMoveTimer() {
  yield takeLatest(
    ACTION_TYPE.SET_LAST_TIMESTAMP_FIRST_MOVE as any,
    onSetFirstMoveTimer
  );
}

function* watchSetMoveTimer() {
  yield takeLatest(ACTION_TYPE.SET_TIMER_MANUAL as any, onSetTimer);
}

function* watchOnSetGameStarted() {
  yield takeLatest(ACTION_TYPE.SET_GAME_STARTED as any, onSetGameStarted);
}

function* watchNewMessage() {
  yield takeLatest(ACTION_TYPE.NEW_MESSAGE as any, onNewMessage);
}

function* watchGameStart() {
  yield takeLatest(ACTION_TYPE.START_GAME as any, onGameStart);
}

function* watchClear() {
  yield takeLatest(ACTION_TYPE.CLEAR as any, onClear);
}

function* watchStopTimers() {
  yield takeLatest(ACTION_TYPE.STOP_TIMERS as any, onClear);
}

function* watchHideGameToast(){
  yield takeLatest(ACTION_TYPE.HIDE_GAME_TOAST as any, onHideGameToast);
}

function* watchSetGameNavigation(){
  yield takeLatest(ACTION_TYPE.SET_GAME_NAVIGATION as any, setGameNavigation);
}

export default [
  watchGameplayMoveHistory,
  watchSetLastTimestamp,
  watchSetFirstMoveTimer,
  watchGameStart,
  watchClear,
  watchStopTimers,
  watchResumeGame,
  watchNewMessage,
  watchSetMoveTimer,
  watchOnSetGameStarted,
  watchHideGameToast,
  watchSetGameNavigation
];
