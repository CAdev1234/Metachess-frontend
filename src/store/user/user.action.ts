import { ISettings } from "../../components/ProfileSidebar/EditSettings";
import { UserTypes } from "../../components/UserEditInfo";
import { MODES } from "../../constants/playModes";
import { createAction } from "../generators";
import { IMatchHistory, IServerStatus, IUser } from "./user.interfaces";

export enum ACTION_TYPE {
  "SET_CURRENT_USER" = "user_SET_CURRENT_USER",
  "UPDATE_CURRENT_USER" = "user_UPDATE_CURRENT_USER",
  "FETCH_CURRENT_USER" = "user_FETCH_CURRENT_USER",
  "FETCH_MATCHES_HISTORY" = "user_FETCH_MATCHES_HISTORY",
  "SET_MATCHES_HISTORY" = "user_SET_MATCHES_HISTORY",
  "SET_SERVER_STATUS" = "user_SET_SERVER_STATUS",
  "FETCH_SERVER_STATUS" = "user_FETCH_SERVER_STATUS",
  "SET_USER_STATS_ONCE" = "user_SET_USER_STATS_ONCE",
  "FETCH_USER_STATS_ONCE" = "user_FETCH_USER_STATS_ONCE",
  "SET_USER_STATS_DATE_RANGE" = "user_SET_USER_STATS_DATE_RANGE",
  "FETCH_USER_STATS_DATE_RANGE" = "user_FETCH_USER_STATS_DATE_RANGE",
  "SET_CHOSE_MODE" = "user_SET_CHOSE_MODE",
  "DISPATCH_UPDATE_SETTINGS" = "user_DISPATCH_UPDATE_SETTINGS",
  "UPDATE_SETTINGS" = "user_UPDATE_SETTINGS",
  "FETCH_SEARCHED_USER_LIST" = "user_FETCH_SEARCHED_USER_LIST",
  "SET_SEARCHED_USER_LIST" = "user_SET_SEARCHED_USER_LIST",
  "SET_2_DEVICES" = "user_SET_2_DEVICES",

  "WALLET_CONNECT" = "user_WALLET_CONNECT",
  "SET_WALLET_ADDRESS" = "user_SET_WALLET_ADDRESS",
  "WALLET_DISCONNECT" = "user_WALLET_DISCONNECT",
  "WALLET_UPDATE_CHAIN" = "user_WALLET_UPDATE_CHAIN",
  "WALLET_UPDATE_ACCOUNT" = "user_WALLET_UPDATE_ACCOUNT",
}

export const Actions = {
  fetchCurrentUser: createAction<any>(ACTION_TYPE.FETCH_CURRENT_USER),
  setUserSettings: createAction<ISettings>(ACTION_TYPE.UPDATE_SETTINGS),
  setAlreadyAuthenticated: createAction<boolean>(ACTION_TYPE.SET_2_DEVICES),
  updateUser: createAction<{
    Fullname: string;
    Type: UserTypes;
    CountryId: number;
    WalletAddress?: string;
    Avatar: string;
  }>(ACTION_TYPE.UPDATE_CURRENT_USER),
  updateSettings: createAction<ISettings>(ACTION_TYPE.DISPATCH_UPDATE_SETTINGS),
  setCurrentUser: createAction<Partial<IUser>>(ACTION_TYPE.SET_CURRENT_USER),
  fetchMatchesHistory: createAction<any>(ACTION_TYPE.FETCH_MATCHES_HISTORY),
  setMatchesHistory: createAction<IMatchHistory[]>(
    ACTION_TYPE.SET_MATCHES_HISTORY
  ),
  setServerStatus: createAction<IServerStatus>(ACTION_TYPE.SET_SERVER_STATUS),
  fetchServerStatus: createAction<any>(ACTION_TYPE.FETCH_SERVER_STATUS),
  setUserStatsOnce: createAction<{ WonGames: number; TreasureFound: number }>(
    ACTION_TYPE.SET_USER_STATS_ONCE
  ),
  fetchUserStatsOnce: createAction<null>(ACTION_TYPE.FETCH_USER_STATS_ONCE),
  setUserStatsDateRange: createAction<{
    WonGames: number;
    DrawGames: number;
    LostGames: number;
    TreasuresFound: number;
    TreasureGames: number;
  }>(ACTION_TYPE.SET_USER_STATS_DATE_RANGE),
  fetchUserStatsDateRange: createAction<{ beginDate: number; endDate: number }>(
    ACTION_TYPE.FETCH_USER_STATS_DATE_RANGE
  ),
  setChoseMode: createAction<MODES>(ACTION_TYPE.SET_CHOSE_MODE),
  searchUsers: createAction<any>(ACTION_TYPE.FETCH_SEARCHED_USER_LIST),
  setSearchedUserList: createAction<IUser[]>(
    ACTION_TYPE.SET_SEARCHED_USER_LIST
  ),


  walletConnect: createAction<any>(ACTION_TYPE.WALLET_CONNECT),
  setWalletAddress: createAction<any>(ACTION_TYPE.SET_WALLET_ADDRESS),
  walletDisconnect: createAction<any>(ACTION_TYPE.WALLET_DISCONNECT),
  walletUpdateChain: createAction<any>(ACTION_TYPE.WALLET_UPDATE_CHAIN),
  walletUpdateAccount: createAction<any>(ACTION_TYPE.WALLET_UPDATE_ACCOUNT)
};
