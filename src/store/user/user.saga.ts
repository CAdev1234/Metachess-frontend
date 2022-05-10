import { takeLatest, select, put, call } from "redux-saga/effects";
import { ACTION_TYPE } from "./user.action";
import { Actions as userActions } from "./user.action";
import { Actions as treasureHuntActions } from "../treasureHunt/treasureHunt.action";
import API from "../../services/api.service";
import { ENDPOINTS } from "../../services/endpoints";
import {
  IServerStatus,
  IUser,
  MAINTENANCE_MODE,
  IFetchMatchPayload,
  IWalletData,
} from "./user.interfaces";
import { MAIN_WEBSITE } from "../../config";
import { UserTypes } from "../../components/UserEditInfo";
import { IAppState } from "../reducers";
import { ITreasureHuntReducer } from "../treasureHunt/treasureHunt.interface";
import { ISettings } from "../../components/ProfileSidebar/EditSettings";
import { navigate } from "gatsby";
import { toast } from "react-toastify";
import TOKEN from "../../services/token.service";
import WALLET from "../../services/wallet.service";

function* onFetchCurrentUser() {
  try {
    const user: IUser = yield call(() =>
      API.execute("GET", ENDPOINTS.USER_SUMMARY)
    );
    console.log(user);
    const attemptsSelector = (state: IAppState) =>
      state.treasureHunt.playAttemptsRemaining;
    const chancesSelector = (state: IAppState) =>
      state.treasureHunt.chancesRemaining;
    const chances: number = yield select(chancesSelector);
    const attempts: number = yield select(attemptsSelector);
    // console.log(treasureHunt);
    yield put(
      treasureHuntActions.setGameInformation({
        attempts: attempts - user.TreasureGamesPlayedToday,
        chances,
      })
    );
    yield put(userActions.setUserSettings(user.Settings));
    yield put(userActions.setCurrentUser(user));
  } catch (res: any) {
    // if (res.data === "not verified" && res.status === 401) {
    //         toast.error(
    //           <p>
    //             Session Has Expired. Please Login Again{" "}
    //             <a href={`${MAIN_WEBSITE}signup?r=game`}>Here</a>
    //           </p>
    //         );
    // }
    if (res.status === 401 && res.data === "not verified") {
      TOKEN.remove();
      toast.error("Email is not verified");
    }
    if (res.status === 401 && res.data === "banned") {
      TOKEN.remove();
      toast.error("Your Account has been  banned please contact support");
    }
    if (res.status === 401) {
      TOKEN.remove();
      toast.error("Session has expired please login again");
    }
    console.log("err", res);
  }
}

function* onSetAlreadyAuthenticated({ payload }: { payload: boolean }) {
  if (payload) navigate("/already-authenticated");
  console.log(payload);
}

function* onUpdateCurrentUser({
  payload,
}: {
  payload: {
    Fullname: string;
    Type: UserTypes;
    CountryId: number;
    WalletAddress: string;
    Avatar: string;
  };
}) {
  try {
    yield call(() => API.execute("POST", ENDPOINTS.USER_UPDATE, payload));
    const getUser = (state: IAppState): IUser => state.user.currentUser;
    const user: IUser = yield select(getUser);
    console.log(user);
    if (!payload.WalletAddress) {
      yield put(userActions.setCurrentUser({ ...user, Avatar: payload.Avatar }));
    }else {
      yield put(userActions.setCurrentUser({ ...user, Avatar: payload.Avatar, WalletAddress: payload.WalletAddress }));
    }
  } catch (res) {
    console.log("err", res);
  }
}

function* onUpdateSettings({ payload }: { payload: ISettings }) {
  try {
    yield call(() =>
      API.execute("POST", ENDPOINTS.USER_UPDATE, {
        Settings: JSON.stringify(payload),
      })
    );
    yield put(userActions.setUserSettings(payload));
  } catch (res) {
    console.log("err", res);
  }
}

function* onFetchMatchesHistory({ payload }: { payload: IFetchMatchPayload }) {
  try {
    const queryParams: IQuery[] = Object.keys(payload).map(
      (key: any): IQuery => {
        if (key === "type") return { name: key, value: null };
        return { name: key, value: payload[key] };
      }
    );
    console.log(queryParams);
    const matchesHistory = yield call(() =>
      API.execute("GET", ENDPOINTS.MATCHES_HISTORY, null, queryParams)
    );
    yield put(userActions.setMatchesHistory(matchesHistory));
  } catch (e) {
    console.log("err", e);
  }
}

function* onFetchUserStatsDateRange({
  payload,
}: {
  payload: { beginDate: number; endDate: number };
}) {
  try {
    const queryParams: IQuery[] = Object.keys(payload).map(
      (key: any): IQuery => {
        if (key === "type") return { name: key, value: null };
        return { name: key, value: payload[key] };
      }
    );
    const userStats: {
      WonGames: number;
      DrawGames: number;
      LostGames: number;
      TreasuresFound: number;
      TreasureGames: number;
    } = yield call(() =>
      API.execute("GET", ENDPOINTS.GET_USER_STATS, null, queryParams)
    );
    yield put(userActions.setUserStatsDateRange(userStats));
  } catch (e) {
    console.log("err", e);
  }
}

function* onFetchUserStatsOnce() {
  try {
    const userStats: { WonGames: number; TreasureFound: number } = yield call(
      () => API.execute("GET", ENDPOINTS.GET_USER_STATS)
    );
    yield put(userActions.setUserStatsOnce(userStats));
  } catch (e) {
    console.log("err", e);
  }
}

function* onFetchServerStatus() {
  try {
    const serverStatus: IServerStatus = yield call(() =>
      API.execute("GET", ENDPOINTS.SERVER_STATUS)
    );
    yield put(userActions.setServerStatus(serverStatus));
    yield put(
      treasureHuntActions.setGameInformation({
        chances: serverStatus.TreasureQuestAttempts,
        attempts: serverStatus.TreasureQuestGamesPerDay,
      })
    );
  } catch (e) {
    yield put(userActions.setServerStatus({ Status: MAINTENANCE_MODE.ONLINE }));
    console.log("err", e);
  }
}

function* onFetchUsersByUsername(action: any) {
  try {
    const query: IQuery[] = [
      {
        name: "query",
        value: action.payload,
      },
    ];
    const usersList: IUser[] = yield call(() =>
      API.execute("GET", ENDPOINTS.FIND_USER, null, query)
    );
    yield put(userActions.setSearchedUserList(usersList));
  } catch (e) {
    yield put(userActions.setSearchedUserList([]));
    console.log("err", e);
  }
}


// wallet part
function* onWalletConnect() {
  try {
      // console.log("dddddddddd")
      // const walletData = yield WALLET.openMetamask();
      // yield put(userActions.setWalletAddress({WalletAddress: walletData.address}));
  } catch (error) {
      console.log(error)
  }
}

function* onWalletDisconnect({payload}: {payload: string}) {
  try {
      yield put(userActions.walletDisconnect());
  } catch (error) {
      console.log(error)
  }
}

function* onWalletUpdateChain({payload}: {payload: string}) {
  try {
      yield put(userActions.walletUpdateChain())
  } catch (error) {
      console.log(error)
  }
}

function* onWalletUpdateAccount({payload}: {payload: string}) {
  try {
      yield put(userActions.walletUpdateAccount())
  } catch (error) {
      console.log(error)
  }
}




function* watchFetchSearchedUserList() {
  yield takeLatest(
    ACTION_TYPE.FETCH_SEARCHED_USER_LIST as any,
    onFetchUsersByUsername
  );
}

function* watchFetchCurrentUser() {
  yield takeLatest(ACTION_TYPE.FETCH_CURRENT_USER as any, onFetchCurrentUser);
}

function* watchSetAuthenticated() {
  yield takeLatest(ACTION_TYPE.SET_2_DEVICES as any, onSetAlreadyAuthenticated);
}

function* watchUpdateCurrentUser() {
  yield takeLatest(ACTION_TYPE.UPDATE_CURRENT_USER as any, onUpdateCurrentUser);
}

function* watchFetchMatchesHistory() {
  yield takeLatest(
    ACTION_TYPE.FETCH_MATCHES_HISTORY as any,
    onFetchMatchesHistory
  );
}

function* watchFetchUserStatsOnce() {
  yield takeLatest(
    ACTION_TYPE.FETCH_USER_STATS_ONCE as any,
    onFetchUserStatsOnce
  );
}

function* watchFetchUserStatsDateRange() {
  yield takeLatest(
    ACTION_TYPE.FETCH_USER_STATS_DATE_RANGE as any,
    onFetchUserStatsDateRange
  );
}

function* watchFetchServerStatus() {
  yield takeLatest(ACTION_TYPE.FETCH_SERVER_STATUS as any, onFetchServerStatus);
}

function* watchSettingsChange() {
  yield takeLatest(
    ACTION_TYPE.DISPATCH_UPDATE_SETTINGS as any,
    onUpdateSettings
  );
}

// wallet part
function* walletConnect() {
  console.log('walletConnect Saga')
  yield takeLatest(
      ACTION_TYPE.WALLET_CONNECT as any,
      onWalletConnect
  )
}
function* walletDisconnect() {
  yield takeLatest(
      ACTION_TYPE.WALLET_DISCONNECT as any,
      onWalletDisconnect
  )
}
function* walletUpdateChain() {
  yield takeLatest(
      ACTION_TYPE.WALLET_UPDATE_CHAIN as any,
      onWalletUpdateChain
  )
}
function* walletUpdateAccount() {
  yield takeLatest(
      ACTION_TYPE.WALLET_UPDATE_ACCOUNT as any,
      onWalletUpdateAccount
  )
}

export default [
  watchFetchCurrentUser,
  watchFetchMatchesHistory,
  watchFetchServerStatus,
  watchFetchSearchedUserList,
  watchUpdateCurrentUser,
  watchSettingsChange,
  watchSetAuthenticated,
  watchFetchUserStatsOnce,
  watchFetchUserStatsDateRange,
  
  walletConnect,
  walletDisconnect,
  walletUpdateChain,
  walletUpdateAccount
];
