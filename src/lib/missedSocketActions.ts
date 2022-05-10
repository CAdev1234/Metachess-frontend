import { IMoveSocket, ISpectSocket } from "../interfaces/game.interfaces";
import SocketService from "../services/socket.service";
import store from "../store";
import { ACTION_TYPE } from "../store/gameplay/gameplay.action";
import { IAppState } from "../store/reducers";
import Sounds from "./sound";
import Game from "../pages/game";

const appendCallback = (name: string) => (params: any) => {
  const currentActions = store.getState() as IAppState;
  store.dispatch({
    type: ACTION_TYPE.SET_MISSED_SOCKET_ACTIONS,
    payload: [
      ...currentActions.gameplay.missedSocketActions,
      [name, params, Date.now()],
    ],
  });
};

export const addMissedSocketActions = () => {
  SocketService.subscribeTo({
    eventName: "game-timeout",
    callback: appendCallback("game-timeout"),
  });

  SocketService.subscribeTo({
    eventName: "move-piece",
    callback: (params: IMoveSocket) => {
      const currentState = store.getState() as IAppState;
      if (currentState.gameplay.gameMounted) {
        return;
      }

      if (params.isCheckmate) {
        Sounds.checkmate();
      } else if (params.isCheck) {
        Sounds.check();
      } else if (params.isStalemate) {
        Sounds.stalemate();
      } else {
        Sounds.move();
      }
      appendCallback("move-piece")(params);
    },
  });

  SocketService.subscribeTo({
    eventName: "resign",
    callback: appendCallback("resign"),
  });
  SocketService.subscribeTo({
    eventName: "answer-draw-request",
    callback: appendCallback("answer-draw-request"),
  });
  SocketService.subscribeTo({
    eventName: "request-draw",
    callback: appendCallback("request-draw"),
  });

  SocketService.subscribeTo({
    eventName: "game-cancelled",
    callback: appendCallback("game-cancelled"),
  });

  SocketService.subscribeTo({
    eventName: "leave-game-prompt",
    callback: appendCallback("leave-game-prompt"),
  });
  SocketService.subscribeTo({
    eventName: "spectators-update",
    callback: appendCallback("spectators-update")
  });
};
