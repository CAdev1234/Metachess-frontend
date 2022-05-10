import { Action } from "../generators";
import { ACTION_TYPE } from "./gameplay.action";
import { IGameplayReducer } from "./gameplay.interfaces";
import {
  PieceSide,
  GameMode,
  GameType,
  ILoseMatchForLeaving,
} from "../../interfaces/game.interfaces";
import { INITIAL_FEN } from "../../pages/game";

const INITIAL_STATE: IGameplayReducer = {
  playerColor: "w",
  onMove: "w",
  moveHistory: [],
  opponent: null,
  lastTimestamp: 0,
  gameRules: null,
  gameChatOpen: true,
  gameMessages: [],
  gameId: "",
  spectlist: [],
  // gameRules: {
  //   chessCoin: null,
  //   hostSide: PieceSide.Random,
  //   rating: {
  //     minium: 1000,
  //     maxium: 1500,
  //   },
  //   mode: GameMode.Casual,
  //   time: {
  //     base: 3,
  //     increment: 0,
  //   },
  //   type: GameType.Rapid
  // },
  playMode: null,
  // playMode: {
  //   isAI: false,
  //   isHumanVsHuman: false,
  //   aiMode: null,
  //   isCreate: null,
  //   roomName: null,
  // },
  timer: {
    black: null,
    white: null,
  },
  firstTimer: {
    black: null,
    white: null,
  },
  historyWithTimestamp: [],
  isReplay: false,
  gameChatShowing: false,
  startGameDate: null,
  endGameDate: null,
  winner: null,
  unreadCount: 0,
  missedSocketActions: [],
  gameMounted: false,

  isResume: false,
  gameFen: INITIAL_FEN,
  gameElos: null,
  gameStarted: false,
  loseMatchForLeaving: null,
};

export default (state = INITIAL_STATE, action: Action): IGameplayReducer => {
  return {
    ...state,
    ...{
      [action.type]: {},
      [ACTION_TYPE.SET_ON_MOVE]: {
        onMove: action.payload,
      },
      [ACTION_TYPE.SET_MOVE_HISTORY]: {
        moveHistory: action.payload,
      },
      [ACTION_TYPE.SET_GAME_RULES]: {
        gameRules: action.payload,
      },
      [ACTION_TYPE.SET_PLAY_MODE]: {
        playMode: { ...state.playMode, ...action.payload },
      },
      [ACTION_TYPE.SET_PLAYER_COLOR]: {
        playerColor: action.payload,
      },
      [ACTION_TYPE.SET_UNSEEN_COUNT]: {
        unreadCount: action.payload,
      },
      [ACTION_TYPE.SET_GAME_MESSAGES]: {
        gameMessages: action.payload,
      },
      [ACTION_TYPE.SET_OPPONENT]: {
        opponent: action.payload,
      },
      [ACTION_TYPE.SET_SPECTATORS]: {
        spectlist: action.payload,
      },
      [ACTION_TYPE.SET_GAME_CHAT_OPEN]: {
        gameChatOpen: action.payload,
        unreadCount: action.payload ? 0 : state.unreadCount,
      },
      [ACTION_TYPE.SET_GAME_CHAT_SHOWING]: {
        gameChatShowing: action.payload,
        unreadCount: state.gameChatOpen ? 0 : state.unreadCount,
      },
      [ACTION_TYPE.CLEAR]: {
        ...INITIAL_STATE,
        moveHistory: [],
        gameRules: null, //{ ...INITIAL_STATE.gameRules },
        playMode: null, //{ ...INITIAL_STATE.playMode },
        gameElos: null,
        historyWithTimestamp: [],
        lastTimestamp: 0,
        isReplay: false,
        missedSocketActions: [],
        gameMounted: false,
      },
      [ACTION_TYPE.SET_GAME_STARTED]: {
        gameStarted: true,
      },
      [ACTION_TYPE.SET_LAST_TIMESTAMP]: {
        lastTimestamp: action.payload,
      },
      [ACTION_TYPE.SET_LAST_TIMESTAMP_FIRST_MOVE]: {
        lastTimestamp: action.payload,
      },
      [ACTION_TYPE.SET_TIMER]: {
        timer: action.payload,
      },
      [ACTION_TYPE.SET_TIMER_MANUAL]: {
        timer: action.payload,
      },
      [ACTION_TYPE.SET_FIRST_TIMER]: {
        firstTimer: action.payload,
      },
      [ACTION_TYPE.ADD_TO_HISTORY_WITH_TIMESTAMP]: {
        historyWithTimestamp: [...state.historyWithTimestamp, action.payload],
      },
      [ACTION_TYPE.SET_HISTORY_WITH_TIMESTAMP]: {
        historyWithTimestamp: action.payload,
      },
      [ACTION_TYPE.SET_REPLAY]: {
        isReplay: action.payload,
      },
      [ACTION_TYPE.SET_GAME_START_DATE]: {
        startGameDate: action.payload,
      },
      [ACTION_TYPE.SET_GAME_END_DATE]: {
        endGameDate: action.payload,
      },
      [ACTION_TYPE.SET_WINNER]: {
        winner: action.payload,
      },
      [ACTION_TYPE.SET_MISSED_SOCKET_ACTIONS]: {
        missedSocketActions: action.payload,
      },
      [ACTION_TYPE.SET_GAME_MOUNTED]: {
        gameMounted: action.payload,
      },
      [ACTION_TYPE.SET_LOSE_MATCH_FOR_LEAVING]: {
        loseMatchForLeaving: action.payload,
      },
      [ACTION_TYPE.SET_GAME_ELOS]: {
        gameElos: action.payload,
      },
      [ACTION_TYPE.SET_RESUME_PARAMETERS]: {
        isResume: action.payload?.isResume,
        gameFen: action.payload?.gameFen,
      },
    }[action.type],
  };
};
