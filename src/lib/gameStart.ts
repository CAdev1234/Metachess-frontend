import SocketService from "../services/socket.service";
import { IUser } from "../store/user/user.interfaces";
import { GameRules, PieceSide } from "../interfaces/game.interfaces";
import { navigate } from "gatsby";
import store from "../store";
import { Actions as gameplayActions } from "../store/gameplay/gameplay.action";
import { Actions as userActions } from "../store/user/user.action";
import { IGameplayElos } from "../store/gameplay/gameplay.interfaces";
import { GAME_MODES } from "../constants/playModes";

interface GameStartParams {
  opponent: IUser;
  user: IUser;
  gameRules: GameRules;
  side: PieceSide;
  startDate: number;
  gameElos: IGameplayElos;
}

const subscribeToGameStart = (
  gameMode: String,
  beforeNavigateCb?: () => void
) => {
  SocketService.subscribeTo({
    eventName: "game-start",
    callback: (params: GameStartParams) => {
      store.dispatch(gameplayActions.hideGameToast());
      startGame(params, gameMode, beforeNavigateCb);
      // startGame(params, gameMode);
      console.log("Game start", params);
      store.dispatch(userActions.setCurrentUser({ ...params.user }));
      store.dispatch(gameplayActions.setGameElos({ ...params.gameElos }));
      store.dispatch(
        gameplayActions.setPlayMode({
          isAI: false,
          aiMode: null,
          isHumanVsHuman: true,
          isCreate: false,
        })
      );
    },
  });
  SocketService.subscribeTo({
    eventName: "game-ready",
    callback: (params: number) => {
      console.log("params ", params);
      store.dispatch(gameplayActions.setGameStarted(params));
    },
  });
};

export const startGame = (
  params: GameStartParams,
  gameMode: String,
  beforeNavigateCb?: () => void
) => {
  store.dispatch(
    gameplayActions.setPlayerColor(params.side === PieceSide.Black ? "b" : "w")
  );
  store.dispatch(gameplayActions.setOpponent(params.opponent));
  store.dispatch(
    gameplayActions.setGameRules({
      ...params.gameRules,
    })
  );

  store.dispatch(gameplayActions.setGameStartDate(params.startDate));
  store.dispatch(gameplayActions.setGameWinner(null));

  // store.dispatch(
  //   gameplayActions.setPlayMode({
  //     isAI: false,
  //     aiMode: null,
  //     isHumanVsHuman: true,
  //     isCreate: false,
  //   })
  // );

  store.dispatch(gameplayActions.startGame());
  if (beforeNavigateCb) {
    beforeNavigateCb();
  }

  let path
  switch (gameMode) {
    case GAME_MODES.TWO_DIMENSION:
      path = "/2d/game"
      break;
    case GAME_MODES.THREE_DIMESION:
      path = "/3d/game"
      break;
    case GAME_MODES.WARFRONT:
      path = "/warfront/game"
      break;
    default:
      path = "/2d/game"
  }
  
  store.dispatch(gameplayActions.setGameNavigation(path))  
  
};

export default subscribeToGameStart;
