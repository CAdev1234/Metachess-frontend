import { Action } from "../generators";
import { ACTION_TYPE } from "./spectate.action";
import { ISpectateReducer } from "./spectate.interfaces";
import {
  PieceSide,
  GameMode,
  GameType,
  ILoseMatchForLeaving,
} from "../../interfaces/game.interfaces";
import { INITIAL_FEN } from "../../pages/game";

const INITIAL_STATE: ISpectateReducer = {
  roomInfo: null,
  spectatingChatOpen: true,
  spectatingMessages: [],
  spectatingChatShowing: false,
  unreadCount: 0,
};

export default (state = INITIAL_STATE, action: Action): ISpectateReducer => {
  return {
    ...state,
    ...{
      [action.type]: {},
      [ACTION_TYPE.SET_ROOM_INFO]: {
        roomInfo: action.payload,
      },
      [ACTION_TYPE.SET_TIMER]: {
        roomInfo: { ...state.roomInfo, timer: action.payload },
      },
      [ACTION_TYPE.SET_MANUAL_TIMER]: {
        roomInfo: { ...state.roomInfo, timer: action.payload },
      },
      [ACTION_TYPE.SET_REPLAY]: {
        roomInfo: {
          ...state.roomInfo,
          isReplay: action.payload,
          gameFen: INITIAL_FEN,
        },
      },
      [ACTION_TYPE.ADD_IN_MOVE_HISTORY]: {
        roomInfo: {
          ...state.roomInfo,
          gameFen: action.payload?.fen,
          moveHistory: state.roomInfo?.moveHistory
            ? [...state.roomInfo?.moveHistory, action.payload?.move]
            : [],
          historyMoves: state.roomInfo?.historyMoves
            ? !state.roomInfo?.isReplay
              ? [...state.roomInfo?.historyMoves, action.payload]
              : state.roomInfo?.historyMoves
            : [],
        },
      },
      [ACTION_TYPE.SET_ON_MOVE]: {
        roomInfo: {
          ...state.roomInfo,
          onMove: action.payload,
        },
      },
      [ACTION_TYPE.SET_GAME_END_DATE]: {
        roomInfo: {
          ...state.roomInfo,
          endGameDate: action.payload,
        },
      },
      [ACTION_TYPE.SET_UNSEEN_COUNT]: {
        unreadCount: action.payload,
      },
      [ACTION_TYPE.NEW_MESSAGE]: {
        spectatingMessages: [...state.spectatingMessages, action.payload],
        unreadCount:
          state.spectatingChatOpen && state.spectatingChatShowing
            ? 0
            : state.unreadCount + 1,
      },
      [ACTION_TYPE.SET_GAME_MESSAGES]: {
        spectatingMessages: action.payload,
      },
      [ACTION_TYPE.SET_GAME_CHAT_OPEN]: {
        spectatingChatOpen: action.payload,
        unreadCount: action.payload ? 0 : state.unreadCount,
      },
      // [ACTION_TYPE.SET_SPECTATORS]: {
      //   roomInfo: { ...state.roomInfo, spectlist: action.payload },
      // },
      [ACTION_TYPE.SET_GAME_CHAT_SHOWING]: {
        spectatingChatShowing: action.payload,
        unreadCount: state.spectatingChatOpen ? 0 : state.unreadCount,
      },
      [ACTION_TYPE.SET_GAME_WINNER]: {
        roomInfo: {
          ...state.roomInfo,
          winner: action.payload,
        },
        // spectatingChatOpen: false,
        // spectatingChatShowing: false,
      },
      [ACTION_TYPE.SET_MOVE_HISTORY]: {
        roomInfo: {
          ...state.roomInfo,
          moveHistory: action.payload,
        },
      },
    }[action.type],
  };
};
