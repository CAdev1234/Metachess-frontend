import { GameRules } from "../../interfaces/game.interfaces";
import { IUser } from "../user/user.interfaces";

export interface IGameItem {
  gameRules: GameRules;
  host: IUser;
  roomId: string;
  status: RoomEvent;
};

export enum RoomEvent {
  Deleted = 1,
  Created,
  GameStarted
}

export interface IGamesReducer {
  gameItems: IGameItem[];
};

