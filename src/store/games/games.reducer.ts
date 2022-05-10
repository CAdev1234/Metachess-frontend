import { Action } from "../generators";
import { IGamesReducer } from "./games.interfaces";
import { ACTION_TYPE } from "./games.action";

const INITIAL_STATE: IGamesReducer = {
  gameItems: []
};

export default (
  state: IGamesReducer = INITIAL_STATE,
  action: Action
): IGamesReducer => {
  return {
    ...state,
    ...{
      [action.type]: {},
      [ACTION_TYPE.SET_GAME_ITEMS]: {
        gameItems: action.payload,
      }
    }[action.type],
  };
};
