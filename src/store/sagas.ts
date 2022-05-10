import { all, fork } from "redux-saga/effects";
import testSagas from "./test/saga";
import gameplaySagas from "./gameplay/gameplay.saga";
import userSagas from "./user/user.saga";
import gamesSaga from "./games/games.saga";
import chatSaga from "./chat/chat.saga";
import leaderboardSaga from "./leaderboard/leaderboard.saga";
import spectateSaga from "./spectate/spectate.saga";

const sagas = [
  ...testSagas,
  ...gameplaySagas,
  ...userSagas,
  ...gamesSaga,
  ...chatSaga,
  ...leaderboardSaga,
  ...spectateSaga,
];

export default function* rootSaga(): Generator {
  yield all(sagas.map((saga: any): any => fork(saga)));
}
