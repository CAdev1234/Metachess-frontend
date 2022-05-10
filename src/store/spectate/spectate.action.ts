import { createAction } from "../generators";
import {
  ITimer,
  IMoveWithTimestamp,
  IGameplayElos,
  ISpectatingMessage,
} from "./spectate.interfaces";
import { GameRules } from "../../interfaces/game.interfaces";
import { IUser } from "../user/user.interfaces";
import { SpectatingRoomInfo } from "../../lib/spectate";

export enum ACTION_TYPE {
  "SET_ROOM_INFO" = "spectate_SET_ROOM_INFO",
  "SET_TIMER" = "spectate_SET_TIMER",
  "SET_MANUAL_TIMER" = "spectate_SET_MANUAL_TIMER",
  "ADD_IN_MOVE_HISTORY" = "spectate_ADD_IN_MOVE_HISTORY",
  "SET_ON_MOVE" = "spectate_SET_ON_MOVE",
  "SET_MOVE_HISTORY" = "spectate_SET_MOVE_HISTORY",
  "SET_GAME_END_DATE" = "spectate_SET_GAME_END_DATE",
  "SET_GAME_WINNER" = "spectate_SET_GAME_WINNER",
  "STOP_TIMERS" = "spectate_STOP_TIMERS",
  "SET_REPLAY" = "spectate_SET_REPLAY",
  "SET_GAME_MESSAGES" = "spectate_SET_GAME_MESSAGES",
  "SET_GAME_CHAT_OPEN" = "spectate_SET_GAME_CHAT_OPEN",
  "SET_GAME_CHAT_SHOWING" = "spectate_SET_GAME_CHAT_SHOWING",
  "SET_UNSEEN_COUNT" = "spectate_SET_UNSEEN_COUNT",
  // "SET_SPECTATORS" = "spectate_SET_SPECTATORS",
  "NEW_MESSAGE" = "spectate_NEW_MESSAGE",
}

export const Actions = {
  setRoomInfo: createAction<SpectatingRoomInfo>(ACTION_TYPE.SET_ROOM_INFO),
  setTimer: createAction<ITimer>(ACTION_TYPE.SET_TIMER),
  setManualTimer: createAction<ITimer>(ACTION_TYPE.SET_MANUAL_TIMER),
  addInMoveHistory: createAction<IMoveWithTimestamp>(
    ACTION_TYPE.ADD_IN_MOVE_HISTORY
  ),
  setOnMove: createAction<string>(ACTION_TYPE.SET_ON_MOVE),
  setGameEndDate: createAction<number>(ACTION_TYPE.SET_GAME_END_DATE),
  setGameWinner: createAction<"b" | "w" | "draw">(ACTION_TYPE.SET_GAME_WINNER),
  stopTimers: createAction<void>(ACTION_TYPE.STOP_TIMERS),
  setMoveHistory: createAction<string[]>(ACTION_TYPE.SET_MOVE_HISTORY),
  setReplay: createAction<boolean>(ACTION_TYPE.SET_REPLAY),
  setGameChatOpen: createAction<boolean>(ACTION_TYPE.SET_GAME_CHAT_OPEN),
  setGameChatShow: createAction<boolean>(ACTION_TYPE.SET_GAME_CHAT_SHOWING),
  setUnseenCount: createAction<number>(ACTION_TYPE.SET_UNSEEN_COUNT),
  newMessage: createAction<ISpectatingMessage>(ACTION_TYPE.NEW_MESSAGE),
  setGameMessages: createAction<ISpectatingMessage[]>(
    ACTION_TYPE.SET_GAME_MESSAGES
  ),
  // setSpectators: createAction<Partial<IUser>[]>(ACTION_TYPE.SET_SPECTATORS),
};
