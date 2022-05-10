import { Square } from "chess.js";
import { TREASURE_QUEST_MODES } from "../../constants/playModes";

export interface move {
  place: Square;
  level: number;
}
export interface moveList extends Array<move> {}
export interface ISetPlayModePayload {
  treasureQuestMode: TREASURE_QUEST_MODES;
}
export interface ITreasureHuntReducer {
  moveList: moveList;
  chancesRemaining: number;
  lootAcquired: number;
  gameOver: boolean;
  startGameDate: number;
  endGameDate: number;
  playMode: ISetPlayModePayload;
  gameInProgressUserNavigating: boolean;
  gameInProgress: boolean;
  timeLeft: number;
  playAttemptsRemaining: number;
}
