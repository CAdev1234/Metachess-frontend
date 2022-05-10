import { AI_PLAY_MODE } from "../../constants/playModes";
import {
  GameRules,
  IMoveSocket,
  PieceSide,
  ILoseMatchForLeaving,
  ISpectSocket,
} from "../../interfaces/game.interfaces";
import { IUser } from "../user/user.interfaces";
import { Timer } from "../../lib/timer";
import { IMessage } from "../../components/ChessChat";

export interface IGameplayReducer {
  playerColor: "b" | "w";
  onMove: "b" | "w";
  moveHistory: string[];
  spectlist: Partial<IUser>[];
  playMode: ISetPlayModePayload;
  gameRules: GameRules;
  opponent: IUser;
  lastTimestamp: number;
  timer: ITimer;
  firstTimer: ITimer;
  historyWithTimestamp: IMoveWithTimestamp[];
  startGameDate: number;
  endGameDate: number;
  winner: "b" | "w";
  isReplay: boolean;
  gameId: string;
  gameMessages: IMessage[];
  gameChatShowing: boolean;
  unreadCount: number;
  gameChatOpen: boolean;
  missedSocketActions: any[];
  gameMounted: boolean;
  isResume: boolean;
  gameFen: string;
  gameElos: IGameplayElos;
  loseMatchForLeaving: ILoseMatchForLeaving;
  gameStarted: boolean;
}

export interface ISetPlayModePayload {
  isAI: boolean;
  aiMode: AI_PLAY_MODE;
  isHumanVsHuman: boolean;
  roomName: string;
  isCreate: boolean;
}

export interface IGameplayElos {
  eloWin: number;
  eloLose: number;
  eloDraw: number;
}

export interface ITimer {
  black: number;
  white: number;
}

export interface IMoveWithTimestamp {
  move: string;
  timestamp: number;
  fen?: string;
  isCheck?: boolean;
  isCheckmate?: boolean;
  isDraw?: boolean;
  isRepetition?: boolean;
  isStalemate?: boolean;
}

export enum ResultCondition {
  Gameplay = 1,
  Timeout,
  Resign,
  Leave,
  DrawRequest,
}

export interface IGameResume {
  identifier: string;
  opponent: Partial<IUser>;
  gameRules: GameRules;
  history: IMoveSocket[];
  opponentTimeLeft: number;
  timeLeft: number;
  isYourTurn: boolean;
  side: PieceSide;
  startDate: number;
  gameElos: IGameplayElos;
  spectators: Partial<IUser>[];
  playerIsHost: boolean;
  hostTimeLeft: number;
  secondPlayerTimeLeft: number;
}
