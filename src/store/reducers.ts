import { combineReducers } from "redux";
import testReducer from "./test/reducer";
import treasureHuntReducer from "./treasureHunt/treasureHunt.reducer";
import gameplayReducer from "./gameplay/gameplay.reducer";
import userReducer from "./user/user.reducer";
import { IGameplayReducer } from "./gameplay/gameplay.interfaces";
import { IChatReducer } from "./chat/chat.interfaces";
import chatReducer from "./chat/chat.reducer";
import { IUserReducer } from "./user/user.interfaces";
import { IGamesReducer } from "./games/games.interfaces";
import gamesReducer from "./games/games.reducer";
import { ITreasureHuntReducer } from "./treasureHunt/treasureHunt.interface";
import { ILeaderboardReducer } from "./leaderboard/leaderboard.interfaces";
import leaderboardReducer from "./leaderboard/leaderboard.reducer";
import { ISpectateReducer } from "./spectate/spectate.interfaces";
import spectateReducer from "./spectate/spectate.reducer";
import walletReducer from "./wallet/wallet.reducer";
import { IWalletReducer } from "./wallet/wallet.interfaces";

export interface IAppState {
  test: ITestReducer;
  gameplay: IGameplayReducer;
  chat: IChatReducer;
  user: IUserReducer;
  games: IGamesReducer;
  treasureHunt: ITreasureHuntReducer;
  leaderboard: ILeaderboardReducer;
  spectate: ISpectateReducer;
}

const reducers = combineReducers({
  test: testReducer,
  gameplay: gameplayReducer,
  chat: chatReducer,
  user: userReducer,
  games: gamesReducer,
  treasureHunt: treasureHuntReducer,
  leaderboard: leaderboardReducer,
  spectate: spectateReducer,
});

export default reducers;
