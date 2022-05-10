import { put, takeLatest } from "redux-saga/effects";
import { Actions, ACTION_TYPE } from "./leaderboard.action";
import API from "../../services/api.service";
import { ENDPOINTS } from "../../services/endpoints";
import {
  IFetchLeaderboardPayload,
  ILeaderBoardResult,
  ISetLeaderboardPayload,
  LeaderboardType,
} from "./leaderboard.interfaces";

function* onFetchLeaderboard({
  payload,
}: {
  payload: IFetchLeaderboardPayload;
}) {
  try {
    console.log("gametype " + payload.gameType);
    const queryParams: IQuery[] = Object.keys(payload).map(
      (key: any): IQuery => {
        if (key === "type") return { name: key, value: null };
        return { name: key, value: payload[key] };
      }
    );
    let endpoint: string;
    switch (payload.type) {
      case "ai":
        endpoint = ENDPOINTS.GET_AI_GAMES_LEADERBOARD;
        break;
      case "qp":
        endpoint = ENDPOINTS.GET_QUICKPLAY_LEADERBOARD;
        break;
      case "r":
        endpoint = ENDPOINTS.GET_RATING_LEADERBOARD;
        break;
    }
    console.log(endpoint, queryParams);
    const leaderboard: ISetLeaderboardPayload = yield API.execute(
      "GET",
      endpoint,
      null,
      queryParams
    );
    yield put(Actions.setLeaderboard(leaderboard));
  } catch (e) {
    console.log(e);
  }
}

// function* onFetchAILeaderboard({
//   payload,
// }: {
//   payload: IFetchLeaderboardPayload;
// }) {
//   try {
//     const queryParams: IQuery[] = Object.keys(payload).map(
//       (key: any): IQuery => {
//         return { name: key, value: payload[key] };
//       }
//     );
//     const leaderboard: ILeaderBoardResult[] = yield API.execute(
//       "GET",
//       ENDPOINTS.GET_AI_GAMES_LEADERBOARD,
//       null,
//       queryParams
//     );
//     yield put(Actions.setAiGamesLeaderboard(leaderboard));
//   } catch (e) {
//     console.log(e);
//   }
// }

// function* onFetchQuickPlayLeaderboard({
//   payload,
// }: {
//   payload: IFetchLeaderboardPayload;
// }) {
//   try {
//     // console.log(payload);
//     const queryParams: IQuery[] = Object.keys(payload).map(
//       (key: any): IQuery => {
//         return { name: key, value: payload[key] };
//       }
//     );
//     console.log(queryParams);
//     const leaderboard: ISetLeaderboardPayload = yield API.execute(
//       "GET",
//       ENDPOINTS.GET_QUICKPLAY_LEADERBOARD,
//       //   payload,
//       null,
//       queryParams
//     );
//     console.log(leaderboard);
//     yield put(Actions.setQuickPlayLeaderboard(leaderboard));
//   } catch (e) {
//     console.log(e);
//   }
// }

// function* onFetchRatingLeaderboard({
//   payload,
// }: {
//   payload: IFetchLeaderboardPayloadRating;
// }) {
//   try {
//     const queryParams: IQuery[] = Object.keys(payload).map(
//       (key: any): IQuery => {
//         return { name: key, value: payload[key] };
//       }
//     );
//     const leaderboard: ILeaderBoardResult[] = yield API.execute(
//       "GET",
//       ENDPOINTS.GET_RATING_LEADERBOARD,
//       null,
//       queryParams
//     );
//     switch (payload.gameType) {
//       case LeaderboardType.Blitz:
//         yield put(Actions.setBlitzLeaderboard(leaderboard));
//         break;
//       case LeaderboardType.Bullet:
//         yield put(Actions.setBulletLeaderboard(leaderboard));
//         break;
//       case LeaderboardType.Classical:
//         yield put(Actions.setClassicalLeaderboard(leaderboard));
//         break;
//       case LeaderboardType.Rapid:
//         yield put(Actions.setRapidLeaderboard(leaderboard));
//         break;
//     }
//   } catch (e) {
//     console.log(e);
//   }
// }

// function* watchFetchAILeaderboard() {
//   yield takeLatest(
//     ACTION_TYPE.FETCH_AI_GAMES_LEADERBOARD as any,
//     onFetchAILeaderboard
//   );
// }

function* watchFetchLeaderboard() {
  yield takeLatest(ACTION_TYPE.FETCH_LEADERBOARD as any, onFetchLeaderboard);
}

// function* watchFetchQuickPlayLeaderboard() {
//   console.log("hello ");
//   yield takeLatest(
//     ACTION_TYPE.FETCH_QUICK_PLAY_LEADERBOARD as any,
//     onFetchQuickPlayLeaderboard
//   );
// }

// function* watchFetchRatingLeaderboard() {
//   yield takeLatest(
//     ACTION_TYPE.FETCH_RATING_LEADERBOARD as any,
//     onFetchRatingLeaderboard
//   );
// }
export default [
  // watchFetchAILeaderboard,
  // watchFetchQuickPlayLeaderboard,
  // watchFetchRatingLeaderboard,
  watchFetchLeaderboard,
];
