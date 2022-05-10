import { IUser } from "../store/user/user.interfaces";

export interface MinMax {
  minium: number;
  maxium: number;
}

export interface Time {
  base: number;
  increment: number;
}
export enum PieceSide {
  Random,
  White,
  Black,
}
export enum GameMode {
  Casual = 1,
  Rated,
}

export enum GameType {
  Classical = 1,
  Blitz,
  Rapid,
  Bullet,
}

export interface ILoseMatchForLeaving {
  eloLost: number;
  eloDraw: number;
  opponentName: string;
}

export interface GameRules {
  chessCoin: MinMax;
  hostSide: PieceSide;
  rating: number;
  mode: GameMode;
  time: Time;
  type: GameType;
}

export interface SpectatingGameRules {
  chessCoin: MinMax;
  hostSide: PieceSide;
  rating: number;
  mode: GameMode;
  time: Time;
  type: GameType;
}
export enum ResultCondition {
  Gameplay = 1,
  Timeout,
  Resign,
  Leave,
  DrawRequest,
}

export enum MovePieceEnum {
  OK,
  GameNotStarted,
  NotYourTurn,
  NotAValidMove,
  GameNotFound,
}

export interface IMoveSocket {
  isCheckmate: boolean;
  isRepetition: boolean;
  isStalemate: boolean;
  isCheck: boolean;
  isDraw?: boolean;
  player?: IUser;
  move: string;
  fen: string;
  winner?: any;
  timestamp: number;
  playerIsHost: boolean;
  hostTimeLeft: number;
  secondPlayerTimeLeft: number;
}

export interface ISpectSocket {
  spectlist: Array<any>;
}
