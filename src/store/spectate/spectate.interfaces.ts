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
import { SpectatingRoomInfo } from "../../lib/spectate";

export interface ISpectateReducer {
  roomInfo: SpectatingRoomInfo;
  spectatingChatOpen: boolean;
  spectatingMessages: ISpectatingMessage[];
  spectatingChatShowing: boolean;
  unreadCount: number;
}

export interface ISpectatingMessage {
  message: string;
  date?: Date;
  sender?: IUser;
  isNotification: boolean;
}

export enum NOTIFICATION_TYPE {
  Chat = 1,
  DrawRequest,
  AcceptDraw,
  DeclineDraw,
  BackToGame,
  Leave,
  Resign,
  LeavePromptWin,
  LeavePromptDraw,
  SpectatorMessage,
  Cancelled,
}

export interface ISpectateNotification {
  Type: NOTIFICATION_TYPE;
  AccountId?: number;
  GuestId?: number;
  Account?: Partial<IUser>;
  Timestamp: number;
  Message?: string;
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
