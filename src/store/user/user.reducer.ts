import { MODES } from "../../constants/playModes";
import { Action } from "../generators";
import { ACTION_TYPE } from "./user.action";
import { IUserReducer } from "./user.interfaces";

const INITIAL_STATE: IUserReducer = {
  currentUser: null,
  matchesHistory: null,
  serverStatus: null,
  matchesCount: 0,
  choseMode: MODES.CHOSE_MODE,
  searchedUsersList: [],
  alreadyAuthenticated: false,
  userStats: {},
};

export default (
  state: IUserReducer = INITIAL_STATE,
  action: Action
): IUserReducer => {
  return {
    ...state,
    ...{
      [action.type]: {},
      [ACTION_TYPE.SET_CURRENT_USER]: {
        currentUser: action.payload,
      },
      [ACTION_TYPE.SET_2_DEVICES]: {
        alreadyAuthenticated: action.payload,
      },
      [ACTION_TYPE.UPDATE_SETTINGS]: {
        serverStatus: { ...state.serverStatus, ...action.payload },
      },
      [ACTION_TYPE.SET_MATCHES_HISTORY]: {
        matchesHistory: action.payload?.results,
        matchesCount: action.payload?.count,
      },
      [ACTION_TYPE.SET_USER_STATS_ONCE]: {
        currentUser: { ...state.currentUser, ...action.payload },
      },
      [ACTION_TYPE.SET_USER_STATS_DATE_RANGE]: {
        userStats: action.payload,
      },
      [ACTION_TYPE.SET_SERVER_STATUS]: {
        serverStatus: action.payload,
      },
      [ACTION_TYPE.SET_CHOSE_MODE]: {
        choseMode: action.payload,
      },
      [ACTION_TYPE.SET_SEARCHED_USER_LIST]: {
        searchedUsersList: action.payload,
      },


      [ACTION_TYPE.WALLET_CONNECT]: {
        
      },
      [ACTION_TYPE.SET_WALLET_ADDRESS]: {
        currentUser: {
          ...state.currentUser,
          ...action.payload
        },
      },
      [ACTION_TYPE.WALLET_DISCONNECT]: {

      },
      [ACTION_TYPE.WALLET_UPDATE_CHAIN]: {

      },
      [ACTION_TYPE.WALLET_UPDATE_ACCOUNT]: {

      },
    }[action.type],
  };
};
