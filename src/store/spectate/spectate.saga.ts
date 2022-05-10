import { takeLatest, select, put } from "redux-saga/effects";
import { ACTION_TYPE } from "./spectate.action";
import { Actions as spectateActions } from "./spectate.action";
import { IAppState } from "../reducers";
import { GameRules, PieceSide } from "../../interfaces/game.interfaces";
import { Timer } from "../../lib/timer";
import store from "..";
import { pullAllBy } from "lodash";
import { navigate } from "gatsby";
import { IUser } from "../user/user.interfaces";
import { ITimer } from "./spectate.interfaces";
import { SpectatingRoomInfo } from "../../lib/spectate";

let BLACK_TIMER: Timer = null;
let WHITE_TIMER: Timer = null;

function dispatchTimerChange() {
  if (!WHITE_TIMER || !BLACK_TIMER) {
    return;
  }
  console.log("dispatchTimerChange");
  try {
    store.dispatch(
      spectateActions.setTimer({
        black: BLACK_TIMER.timeLeft,
        white: WHITE_TIMER.timeLeft,
      })
    );
  } catch (e) {
    console.log(e);
  }
}

function* onSetManualTimer({ payload }: { payload: ITimer }) {
  const {
    spectate: {
      roomInfo: { isReplay, historyMoves, timer, onMove },
    },
  } = (yield select()) as IAppState;
  const startDate = Date.now();
  WHITE_TIMER.timeLeft = payload.white;
  BLACK_TIMER.timeLeft = payload.black;
  if (!isReplay) {
    if (onMove === "b" && historyMoves.length >= 2) {
      BLACK_TIMER.reinit(startDate, dispatchTimerChange);
      WHITE_TIMER.stop(startDate, false);
    } else if (historyMoves.length >= 2) {
      WHITE_TIMER.reinit(startDate, dispatchTimerChange);
      BLACK_TIMER.stop(startDate, false);
    }
  }
}

function* onClear() {
  if (BLACK_TIMER) {
    BLACK_TIMER.clear();
    BLACK_TIMER.finished = true;
  }
  if (WHITE_TIMER) {
    WHITE_TIMER.clear();
    WHITE_TIMER.finished = true;
  }
  BLACK_TIMER = null;
  WHITE_TIMER = null;
}

function onSetRoomInfo({ payload }: { payload: SpectatingRoomInfo }) {
  const startDate = payload.gameStartDate || payload.startDate;
  const hostColor = payload.hostColor;
  BLACK_TIMER = new Timer(
    payload.gameRules.time.base,
    payload.gameRules.time.increment,
    startDate,
    hostColor === "b" ? payload.hostTimeLeft : payload.secondPlayerTimeLeft
  );
  WHITE_TIMER = new Timer(
    payload.gameRules.time.base,
    payload.gameRules.time.increment,
    payload.gameStartDate || payload.startDate,
    hostColor === "w" ? payload.hostTimeLeft : payload.secondPlayerTimeLeft
  );
  console.log("onSetRoomInfo", payload);
  if (payload.onMove === "b" && payload.historyMoves.length >= 2) {
    BLACK_TIMER.reinit(startDate, dispatchTimerChange);
    WHITE_TIMER.stop(startDate, false);
  } else if (payload.historyMoves.length >= 2) {
    WHITE_TIMER.reinit(startDate, dispatchTimerChange);
    BLACK_TIMER.stop(startDate, false);
  }
}

function* watchSetRoomInfo() {
  yield takeLatest(ACTION_TYPE.SET_ROOM_INFO as any, onSetRoomInfo);
}

function* watchOnMove() {
  yield takeLatest(ACTION_TYPE.SET_MANUAL_TIMER as any, onSetManualTimer);
}

function* watchStopTimers() {
  yield takeLatest(ACTION_TYPE.STOP_TIMERS as any, onClear);
}

export default [watchSetRoomInfo, watchOnMove, watchStopTimers];
