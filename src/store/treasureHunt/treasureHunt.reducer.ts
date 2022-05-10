import { Action } from "../generators";
import { ACTION_TYPE } from "./treasureHunt.action";
import { ITreasureHuntReducer, move } from "./treasureHunt.interface";

const INITIAL_STATE: ITreasureHuntReducer = {
  moveList: [],
  chancesRemaining: 6,
  lootAcquired: 0,
  gameOver: false,
  playMode: null,
  startGameDate: null,
  endGameDate: null,
  gameInProgressUserNavigating: false,
  gameInProgress: false,
  timeLeft: 0,
  playAttemptsRemaining: 5,
};

export default (
  state: ITreasureHuntReducer = INITIAL_STATE,
  action: Action
): ITreasureHuntReducer => {
  return {
    ...state,
    ...{
      [action.type]: {},
      [ACTION_TYPE.SET_ON_MOVE]: {
        moveList: [...state.moveList, action.payload?.move],
        lootAcquired: state.lootAcquired + action.payload?.loot,
        chancesRemaining: state.chancesRemaining - 1,
      },
      [ACTION_TYPE.CLAIM_SHAH]: {
        lootAcquired: 0,
      },
      [ACTION_TYPE.SET_GAME_END_DATE]: {
        endGameDate: action.payload,
        gameOver: true,
        gameInProgress: false,
        playAttemptsRemaining: state.playAttemptsRemaining - 1,
      },
      [ACTION_TYPE.SET_GAME_START_DATE]: {
        startGameTime: action.payload,
      },
      [ACTION_TYPE.SET_GAME_RESUMED]: {
        moveList: action.payload?.moveList,
        chancesRemaining:
          state.chancesRemaining - action.payload?.moveList?.length,
        lootAcquired: action.payload?.loot,
        timeLeft: action.payload?.timeLeft,
        gameInProgress: true,
        gameInProgressUserNavigating: true,
      },
      [ACTION_TYPE.SET_GAME_INFORMATION]: {
        chancesRemaining: action.payload?.chances,
        playAttemptsRemaining: action.payload?.attempts,
      },
      [ACTION_TYPE.RESET_GAME]: {
        moveList: [],
        chancesRemaining: 6,
        lootAcquired: 0,
        gameOver: false,
        gameInProgress: action.payload,
      },
      [ACTION_TYPE.SET_TIME_LEFT]: {
        timeLeft: action.payload,
      },
      [ACTION_TYPE.SET_GAME_IN_PROGRESS]: {
        gameInProgress: action.payload,
      },
      [ACTION_TYPE.SET_GAME_IN_PROGRESS_USER_NAVIGATING]: {
        gameInProgressUserNavigating: action.payload,
      },
    }[action.type],
  };
};
