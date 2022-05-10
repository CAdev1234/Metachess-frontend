import { takeLatest, select, put } from "redux-saga/effects";
import { ACTION_TYPE, Actions } from "./games.action";
import { IGameItem, IGamesReducer } from "./games.interfaces";

function* onModifyGameItems({ payload }: { payload: IGameItem }) {
  const {
    games: { gameItems },
  }: { games: IGamesReducer } = yield select();
  let newArray = [...gameItems];

  switch (payload.status) {
    case 1:
      return yield put(
        Actions.setGameItems(
          newArray.filter(
            (game: IGameItem): boolean => game.roomId !== payload.roomId
          )
        )
      );
    case 2:
      const index = newArray.findIndex(
        (game: IGameItem) => game.roomId === payload.roomId
      );

      if (index > -1) {
        return;
      }
      return yield put(Actions.setGameItems([...newArray, payload]));
    case 3:
      const gameIndex = newArray.findIndex(
        (game: IGameItem) => game.roomId === payload.roomId
      );
      if (gameIndex > -1) {
        newArray.splice(gameIndex, 1);

        return yield put(Actions.setGameItems(newArray));
      }
    case 4:
      return yield put(
        Actions.liveGameItems(
          newArray.filter(
            (game: IGameItem): boolean => game.roomId === payload.roomId
          )
        )
      );
  }
}

function* watchModifyGameItems() {
  yield takeLatest(ACTION_TYPE.MODIFY_GAME_ITEMS as any, onModifyGameItems);
}

export default [watchModifyGameItems];
