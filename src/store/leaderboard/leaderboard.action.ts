import { createAction } from "../generators";
import {
  IFetchLeaderboardPayload,
  ILeaderBoardResult,
  ISetLeaderboardPayload,
} from "./leaderboard.interfaces";

export enum ACTION_TYPE {
  // "SET_QUICK_PLAY_LEADERBOARD" = "SET_QUICK_PLAY_LEADERBOARD",
  // "SET_AI_GAMES_LEADERBOARD" = "SET_AI_GAMES_LEADERBOARD",
  // "SET_BULLET_LEADERBOARD" = "SET_BULLET_LEADERBOARD",
  // "SET_BLITZ_LEADERBOARD" = "SET_BLITZ_LEADERBOARD",
  // "SET_CLASSICAL_LEADERBOARD" = "SET_CLASSICAL_LEADERBOARD",
  // "SET_RAPID_LEADERBOARD" = "SET_RAPID_LEADERBOARD",
  // "FETCH_AI_GAMES_LEADERBOARD" = "FETCH_AI_GAMES_LEADERBOARD",
  // "FETCH_QUICK_PLAY_LEADERBOARD" = "FETCH_QUICK_PLAY_LEADERBOARD",
  "SET_LEADERBOARD" = "SET_LEADERBOARD",
  // "FETCH_RATING_LEADERBOARD" = "FETCH_RATING_LEADERBOARD",
  "FETCH_LEADERBOARD" = "FETCH_LEADERBOARD",
}

export const Actions = {
  // setQuickPlayLeaderboard: createAction<ISetLeaderboardPayload>(
  //   ACTION_TYPE.SET_QUICK_PLAY_LEADERBOARD
  // ),
  // setAiGamesLeaderboard: createAction<ISetLeaderboardPayload>(
  //   ACTION_TYPE.SET_AI_GAMES_LEADERBOARD
  // ),
  // setBulletLeaderboard: createAction<ISetLeaderboardPayload>(
  //   ACTION_TYPE.SET_BULLET_LEADERBOARD
  // ),
  // setBlitzLeaderboard: createAction<ISetLeaderboardPayload>(
  //   ACTION_TYPE.SET_BLITZ_LEADERBOARD
  // ),
  // setRapidLeaderboard: createAction<ISetLeaderboardPayload>(
  //   ACTION_TYPE.SET_RAPID_LEADERBOARD
  // ),
  // setClassicalLeaderboard: createAction<ISetLeaderboardPayload>(
  //   ACTION_TYPE.SET_CLASSICAL_LEADERBOARD
  // ),
  setLeaderboard: createAction<ISetLeaderboardPayload>(
    ACTION_TYPE.SET_LEADERBOARD
  ),
  // fetchQuickPlayLeaderboard: createAction<IFetchLeaderboardPayload>(
  //   ACTION_TYPE.FETCH_QUICK_PLAY_LEADERBOARD
  // ),
  // fetchAiGamesLeaderboard: createAction<IFetchLeaderboardPayload>(
  //   ACTION_TYPE.FETCH_AI_GAMES_LEADERBOARD
  // ),
  // fetchRatingLeaderboard: createAction<IFetchLeaderboardPayloadRating>(
  //   ACTION_TYPE.FETCH_RATING_LEADERBOARD
  // ),
  fetchLeaderboard: createAction<IFetchLeaderboardPayload>(
    ACTION_TYPE.FETCH_LEADERBOARD
  ),
};
