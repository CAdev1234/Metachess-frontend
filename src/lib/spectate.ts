import SocketService from "../services/socket.service";
import { IUser } from "../store/user/user.interfaces";
import { GameRules, PieceSide } from "../interfaces/game.interfaces";
import { navigate } from "gatsby";
import store from "../store";
import { Actions as spectatingActions } from "../store/spectate/spectate.action";
import {
  IGameplayElos,
  IMoveWithTimestamp,
  ISpectateNotification,
  ITimer,
} from "../store/spectate/spectate.interfaces";
import { INITIAL_FEN } from "../pages/game";

export interface SpectatingRoomInfo {
  secondPlayer?: IUser;
  host?: IUser;
  gameRules?: GameRules;
  startDate?: number;
  gameElos?: IGameplayElos;
  gameStartDate?: number;
  historyMoves?: Array<IMoveWithTimestamp>;
  hostLeft?: boolean;
  hostTimeLeft?: number;
  isHostTurn?: boolean;
  winner?: "w" | "b" | "draw";
  gameEndDate?: number;
  secondPlayerLeft?: boolean;
  secondPlayerTimeLeft?: number;
  spectatorNotifications?: ISpectateNotification[];
  isReplay?: boolean;
  moveHistory?: string[];
  hostColor?: "w" | "b";
  // spectlist?: Partial<IUser>[];
  timer?: ITimer;
  onMove?: "w" | "b";
  gameFen?: string;
  whitePieces?: { GuestId?: number; Id?: number };
}

const subscribeToSpectateStart = (roomId: string, currentUser: IUser) => {
  SocketService.sendData(
    "start-spectating",
    roomId,
    (data: SpectatingRoomInfo) => {
      console.log("start-spectating", data);
      if (data === false) return navigate("/");

      const whitePiecesId = data.whitePieces.Id || data.whitePieces.GuestId;
      const hostId = data?.host?.Id || data?.host?.GuestId;
      const hostColor = whitePiecesId === hostId ? "w" : "b";
      store.dispatch(
        spectatingActions.setRoomInfo({
          ...data,
          onMove: data.historyMoves.length % 2 === 0 ? "w" : "b",
          timer: {
            black:
              hostColor === "b" ? data.hostTimeLeft : data.secondPlayerTimeLeft,
            white:
              hostColor !== "b" ? data.hostTimeLeft : data.secondPlayerTimeLeft,
          },
          hostColor,
          moveHistory: data.historyMoves.map((m) => m.move),
          isReplay: false,
          gameFen:
            data.historyMoves.length !== 0
              ? data.historyMoves[data.historyMoves.length - 1].fen
              : INITIAL_FEN,
        })
      );
      // store.dispatch(spectatingActions.setGameElos(data.gameElos));
      // store.dispatch(
      //   spectatingActions.setGameStartDate(data.startDate || data.gameStartDate)
      // );
      // store.dispatch(spectatingActions.setGameRules(data.gameRules));
      // store.dispatch(
      //   spectatingActions.setMoveHistory(data.historyMoves.map((m) => m.move))
      // );
      // store.dispatch(
      //   spectatingActions.setHistoryWithTimestamp(data.historyMoves)
      // );
      // store.dispatch(spectatingActions.setOpponent(data.secondPlayer));
      // const hostColor = data?.whitePieces?.Id === data?.host?.Id ? "w" : "b";
      // store.dispatch(spectatingActions.setPlayerColor(hostColor));
      // store.dispatch(spectatingActions.setGameWinner(null));
      // store.dispatch(
      //   spectatingActions.startGame({
      //     black:
      //       hostColor === "b" ? data.hostTimeLeft : data.secondPlayerTimeLeft,
      //     white:
      //       hostColor === "w" ? data.hostTimeLeft : data.secondPlayerTimeLeft,
      //   })
      // );
    }
  );
};

// export const startGame = (
//   params: SpectatingRoomInfo,
//   beforeNavigateCb?: () => void
// ) => {
//   if (beforeNavigateCb) {
//     beforeNavigateCb();
//   }
// }

export default subscribeToSpectateStart;
