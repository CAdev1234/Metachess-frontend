import { createAction } from "../generators";
import {
  ISetPlayModePayload,
  ITimer,
  IMoveWithTimestamp,
  IGameResume,
  IGameplayElos,
} from "./gameplay.interfaces";
import {
  GameRules,
  ILoseMatchForLeaving,
} from "../../interfaces/game.interfaces";
import { IUser } from "../user/user.interfaces";
import { IMessage } from "../../components/ChessChat";

export enum ACTION_TYPE {
  "SET_ON_MOVE" = "gameplay_SET_ON_MOVE",
  "SET_MOVE_HISTORY" = "gameplay_SET_MOVE_HISTORY",
  "ADD_IN_MOVE_HISTORY" = "gameplay_ADD_IN_MOVE_HISTORY",
  "SET_PLAY_MODE" = "gameplay_SET_PLAY_MODE",
  "SET_GAME_RULES" = "gameplay_SET_GAME_RULES",
  "SET_PLAYER_COLOR" = "gameplay_SET_PLAYER_COLOR",
  "SET_OPPONENT" = "gameplay_SET_OPPONENT",
  "CLEAR" = "gameplay_CLEAR",
  "SET_LAST_TIMESTAMP" = "gameplay_SET_LAST_TIMESTAMP",
  "SET_LAST_TIMESTAMP_FIRST_MOVE" = "gameplay_SET_LAST_TIMESTAMP_FIRST_MOVE",
  "SET_TIMER" = "gameplay_SET_TIMER",
  "SET_TIMER_MANUAL" = "gameplay_SET_TIMER_MANUAL",
  "SET_FIRST_TIMER" = "gameplay_SET_FIRST_TIMER",
  "STOP_TIMERS" = "gameplay_STOP_TIMERS",
  "ADD_TO_HISTORY_WITH_TIMESTAMP" = "gameplay_ADD_TO_HISTORY_WITH_TIMESTAMP",
  "SET_HISTORY_WITH_TIMESTAMP" = "gameplay_SET_HISTORY_WITH_TIMESTAMP",
  "SET_LOSE_MATCH_FOR_LEAVING" = "gameplay_SET_LOSE_MATCH_FOR_LEAVING",
  "SET_REPLAY" = "gameplay_SET_REPLAY",

  "SET_GAME_START_DATE" = "gameplay_SET_GAME_START_DATE",
  "SET_GAME_END_DATE" = "gameplay_SET_GAME_END_DATE",
  "SET_GAME_ELOS" = "gameplay_SET_GAME_ELOS",
  "SET_WINNER" = "gameplay_SET_WINNER",

  "START_GAME" = "gameplay_START_GAME",
  "SET_MISSED_SOCKET_ACTIONS" = "gameplay_SET_MISSED_SOCKET_ACTIONS",
  "SET_GAME_MOUNTED" = "gameplay_SET_GAME_MOUNTED",
  "SET_RESUME_PARAMETERS" = "gameplay_SET_RESUME_PARAMETERS",
  "RESUME_GAME" = "gameplay_RESUME_GAME",
  "FETCH_GAME_CHAT" = "gameplay_FETCH_GAME_CHAT",
  "SET_GAME_MESSAGES" = "gameplay_SET_GAME_MESSAGES",
  "SET_GAME_CHAT_OPEN" = "gameplay_SET_GAME_CHAT_OPEN",
  "SET_GAME_CHAT_SHOWING" = "gameplay_SET_GAME_CHAT_SHOWING",
  "SET_SPECTATORS" = "gameplay_SET_SPECTATORS",
  "SET_UNSEEN_COUNT" = "gameplay_SET_UNSEEN_COUNT",
  "NEW_MESSAGE" = "gameplay_NEW_MESSAGE",
  "SET_GAME_STARTED" = "gameplay_SET_GAME_STARTED",
  "HIDE_GAME_TOAST" = "HIDE_GAME_TOAST",
  "SET_GAME_NAVIGATION" = "SET_GAME_NAVIGATION"
}

export const Actions = {
  onMove: createAction<string>(ACTION_TYPE.SET_ON_MOVE),
  newMessage: createAction<{
    message: string;
    date: Date;
    isFromOpponent: boolean;
  }>(ACTION_TYPE.NEW_MESSAGE),
  setMoveHistory: createAction<string[]>(ACTION_TYPE.SET_MOVE_HISTORY),
  setUnseenCount: createAction<number>(ACTION_TYPE.SET_UNSEEN_COUNT),
  addInMoveHistory: createAction<string>(ACTION_TYPE.ADD_IN_MOVE_HISTORY),
  setPlayMode: createAction<Partial<ISetPlayModePayload>>(
    ACTION_TYPE.SET_PLAY_MODE
  ),
  setGameRules: createAction<Partial<GameRules>>(ACTION_TYPE.SET_GAME_RULES),
  setGameChatOpen: createAction<boolean>(ACTION_TYPE.SET_GAME_CHAT_OPEN),
  setGameChatShow: createAction<boolean>(ACTION_TYPE.SET_GAME_CHAT_SHOWING),
  setGameMessages: createAction<IMessage[]>(ACTION_TYPE.SET_GAME_MESSAGES),
  fetchGameChat: createAction<null>(ACTION_TYPE.FETCH_GAME_CHAT),
  setPlayerColor: createAction<"b" | "w">(ACTION_TYPE.SET_PLAYER_COLOR),
  setOpponent: createAction<IUser>(ACTION_TYPE.SET_OPPONENT),
  clear: createAction<any>(ACTION_TYPE.CLEAR),
  setLastTimestamp: createAction<number>(ACTION_TYPE.SET_LAST_TIMESTAMP),
  setFirstMoveTimer: createAction<number>(
    ACTION_TYPE.SET_LAST_TIMESTAMP_FIRST_MOVE
  ),
  setTimer: createAction<ITimer>(ACTION_TYPE.SET_TIMER),
  setGameStarted: createAction<number>(ACTION_TYPE.SET_GAME_STARTED),
  setManualTimer: createAction<ITimer>(ACTION_TYPE.SET_TIMER_MANUAL),
  setFirstTimer: createAction<ITimer>(ACTION_TYPE.SET_FIRST_TIMER),
  setLoseMatchForLeaving: createAction<ILoseMatchForLeaving>(
    ACTION_TYPE.SET_LOSE_MATCH_FOR_LEAVING
  ),
  stopTimers: createAction<void>(ACTION_TYPE.STOP_TIMERS),
  addToHistoryWithTimestamp: createAction<IMoveWithTimestamp>(
    ACTION_TYPE.ADD_TO_HISTORY_WITH_TIMESTAMP
  ),
  setHistoryWithTimestamp: createAction<IMoveWithTimestamp[]>(
    ACTION_TYPE.SET_HISTORY_WITH_TIMESTAMP
  ),
  setReplay: createAction<boolean>(ACTION_TYPE.SET_REPLAY),

  setGameStartDate: createAction<number>(ACTION_TYPE.SET_GAME_START_DATE),
  setGameEndDate: createAction<number>(ACTION_TYPE.SET_GAME_END_DATE),
  setGameElos: createAction<IGameplayElos>(ACTION_TYPE.SET_GAME_ELOS),
  setGameWinner: createAction<"b" | "w" | "draw">(ACTION_TYPE.SET_WINNER),

  startGame: createAction<any>(ACTION_TYPE.START_GAME),
  
  setMissedSocketActions: createAction<any[]>(
    ACTION_TYPE.SET_MISSED_SOCKET_ACTIONS
  ),
  setGameMounted: createAction<boolean>(ACTION_TYPE.SET_GAME_MOUNTED),

  resumeGame: createAction<IGameResume>(ACTION_TYPE.RESUME_GAME),
  setResumeParameters: createAction<{ isResume: boolean; gameFen: string }>(
    ACTION_TYPE.SET_RESUME_PARAMETERS
  ),
  setSpectators: createAction<Partial<IUser>[]>(ACTION_TYPE.SET_SPECTATORS),

  hideGameToast: createAction<void>(ACTION_TYPE.HIDE_GAME_TOAST),
  setGameNavigation: createAction<string>(ACTION_TYPE.SET_GAME_NAVIGATION),  

};
