import { ISetPlayModePayload, moveList } from "./treasureHunt.interface";
import { createAction } from "../generators";
import { move } from "./treasureHunt.interface";

export enum ACTION_TYPE {
  "SET_ON_MOVE" = "SET_ON_MOVE",
  "RESET_GAME" = "RESET_GAME",
  "CLAIM_SHAH" = "CLAIM_SHAH",
  "SET_TREASURE_MODE" = "SET_TREASURE_MODE",
  "SET_GAME_START_DATE" = "SET_GAME_START_DATE",
  "SET_TIME_LEFT" = "SET_TIME_LEFT",
  "SET_GAME_END_DATE" = "SET_GAME_END_DATE",
  "SET_GAME_RESUMED" = "SET_GAME_RESUMED",
  "SET_GAME_INFORMATION" = "SET_GAME_INFORMATION",
  "SET_GAME_IN_PROGRESS" = "SET_GAME_IN_PROGRESS",
  "SET_GAME_IN_PROGRESS_USER_NAVIGATING" = "SET_GAME_IN_PROGRESS_USER_NAVIGATING",
}

export const Actions = {
  onMove: createAction<{ move: move; loot: number }>(ACTION_TYPE.SET_ON_MOVE),
  resetGame: createAction<boolean>(ACTION_TYPE.RESET_GAME),
  claimShah: createAction<null>(ACTION_TYPE.CLAIM_SHAH),
  setTreasureQuestMode: createAction<ISetPlayModePayload>(
    ACTION_TYPE.SET_TREASURE_MODE
  ),
  setTimeLeft: createAction<number>(ACTION_TYPE.SET_TIME_LEFT),
  setGameStartDate: createAction<number>(ACTION_TYPE.SET_GAME_START_DATE),
  setGameEndDate: createAction<number>(ACTION_TYPE.SET_GAME_END_DATE),
  resumeGame: createAction<{
    moveList: moveList;
    loot: number;
    timeLeft: number;
  }>(ACTION_TYPE.SET_GAME_RESUMED),
  setGameInProgressAndUserNavigating: createAction<boolean>(
    ACTION_TYPE.SET_GAME_IN_PROGRESS_USER_NAVIGATING
  ),
  setGameInformation: createAction<{ attempts: number; chances: number }>(
    ACTION_TYPE.SET_GAME_INFORMATION
  ),
  setGameInProgress: createAction<boolean>(ACTION_TYPE.SET_GAME_IN_PROGRESS),
};
