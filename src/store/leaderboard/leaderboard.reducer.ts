import { Action } from "../generators";
import { ACTION_TYPE } from "./leaderboard.action";
import { ILeaderboardReducer } from "./leaderboard.interfaces";

const INITIAL_STATE: ILeaderboardReducer = {
  // quickPlayLeaderboard: [],
  // aiGamesLeaderboard: [],
  // rapidLeaderboard: [],
  // blitzLeaderboard: [],
  // bulletLeaderboard: [],
  // classicalLeaderboard: [],
  Leaderboard: [],
  totalResults: 0,
};

export default (
  state: ILeaderboardReducer = INITIAL_STATE,
  action: Action
): ILeaderboardReducer => {
  return {
    ...state,
    ...{
      [action.type]: {},
      // [ACTION_TYPE.SET_QUICK_PLAY_LEADERBOARD]: {
      //   quickPlayLeaderboard: action.payload.results,
      //   totalResults: action.payload.count,
      // },
      // [ACTION_TYPE.SET_AI_GAMES_LEADERBOARD]: {
      //   aiGamesLeaderboard: action.payload?.results,
      //   totalResults: action.payload?.count,
      // },
      [ACTION_TYPE.SET_LEADERBOARD]: {
        Leaderboard: action.payload?.results,
        totalResults: action.payload?.count,
      },
      // [ACTION_TYPE.SET_RAPID_LEADERBOARD]: {
      //   rapidLeaderboard: action.payload.results,
      //   totalResults: action.payload.count,
      // },
      // [ACTION_TYPE.SET_BLITZ_LEADERBOARD]: {
      //   blitzLeaderboard: action.payload.results,
      //   totalResults: action.payload.count,
      // },
      // [ACTION_TYPE.SET_BULLET_LEADERBOARD]: {
      //   bulletLeaderboard: action.payload.results,
      //   totalResults: action.payload.count,
      // },
      // [ACTION_TYPE.SET_CLASSICAL_LEADERBOARD]: {
      //   classicalLeaderboard: action.payload.results,
      //   totalResults: action.payload.count,
      // },
    }[action.type],
  };
};
