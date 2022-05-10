import { createAction } from "../generators";
import { IGameItem } from "./games.interfaces";

export enum ACTION_TYPE {
  "SET_GAME_ITEMS" = "games_SET_GAME_ITEMS",
  "MODIFY_GAME_ITEMS" = "games_MODIFY_GAME_ITEMS",
  "LIVE_GAME_ITEMS" = "gams_LIVE_GAME_ITEMS"
}

export const Actions = {
  setGameItems: createAction<IGameItem[]>(ACTION_TYPE.SET_GAME_ITEMS),
  modifyGameItems: createAction<IGameItem>(ACTION_TYPE.MODIFY_GAME_ITEMS),
  liveGameItems: createAction<IGameItem[]>(ACTION_TYPE.LIVE_GAME_ITEMS)
};
