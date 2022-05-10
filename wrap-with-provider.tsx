import React, { useRef, useState } from "react";
import { connect, Provider } from "react-redux";

import store from "./src/store";
import SocketService from "./src/services/socket.service";
import API from "./src/services/api.service";
import queryString from "query-string";
import "./src/global.scss";
import TOKEN from "./src/services/token.service";
import { Actions as userActions } from "./src/store/user/user.action";
import { Actions as gameplayActions } from "./src/store/gameplay/gameplay.action";
import { navigate } from "gatsby";
import { IAppState } from "./src/store/reducers";
import {
  IGameResume,
  ISetPlayModePayload,
} from "./src/store/gameplay/gameplay.interfaces";
import { isSSR } from "./src/lib/utils";
import {
  IServerStatus,
  MAINTENANCE_MODE,
  IUser,
} from "./src/store/user/user.interfaces";
import { Actions as treasureHuntActions } from "./src/store/treasureHunt/treasureHunt.action";
import ResumeOldGameModal from "./src/components/ResumeOldGameModal";
import ResumeOldGameModalTreasureQuest from "./src/components/TreasureQuestResumeGame";
import { addMissedSocketActions } from "./src/lib/missedSocketActions";
import { ILoseMatchForLeaving } from "./src/interfaces/game.interfaces";
import { MAIN_WEBSITE } from "./src/config";
import { moveList } from "./src/store/treasureHunt/treasureHunt.interface";
import { getOpponentName } from "./src/helpers/getOpponentNameByPlayMode";
import { toast } from "react-toastify";
import { chatActions } from "./src/store/chat/chat.actions";

interface ISelectXProps {
  playMode: ISetPlayModePayload;
  loseMatchForLeaving: ILoseMatchForLeaving;
  serverStatus: IServerStatus;
  isResume: boolean;
  gameInProgress: boolean;
  gameInProgressUserNavigating: boolean;
  timeLeft: number;
  alreadyAuthenticated: boolean;
}

interface IActionProps {
  setLoseMatchForLeaving: typeof gameplayActions.setLoseMatchForLeaving;
  setGameInProgressAndUserNavigating: typeof treasureHuntActions.setGameInProgressAndUserNavigating;
}

// console.log = () => {};
const X = (p: ISelectXProps & IActionProps & { children: any }) => {
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef<boolean>(false);
  if (!p.serverStatus) {
    store.dispatch(userActions.fetchServerStatus());
    return null;
  }
  // if (p.serverStatus && p.serverStatus.MaintenanceMode === MAINTENANCE_MODE.UNDER_MAINTENANCE) {
  //   setIsLoading(false);
  //   navigate("/maintenance");
  // }
  SocketService.subscribeTo({
    eventName: "app-settings-change",
    callback: (serverStatus: IServerStatus) => {
      if (serverStatus) {
        store.dispatch(userActions.setServerStatus(serverStatus));
      }
      if (serverStatus.MaintenanceMode === MAINTENANCE_MODE.UNDER_MAINTENANCE) {
        setIsLoading(false);
        navigate("/maintenance");
      }
    },
  });
  if (!initialized.current && !isSSR) {
    // const { token: queryToken } = queryString.parse(window.location.search);

    // if (queryToken) {
    //   TOKEN.remove();
    //   TOKEN.user = queryToken as string;
    //   API.initialize();
    // }
    const token = TOKEN.user;
    SocketService.init();
    SocketService.subscribeTo({
      eventName: "message",
      callback: (data: { sender: IUser; date: Date; message: string }) => {
        // console.log(data);
        store.dispatch(
          chatActions.newMessage({
            roomId: data.sender.Id || data.sender.GuestId,
            message: {
              Date: data.date,
              Message: data.message,
              Sender: data.sender,
            },
          })
        );
      },
    });
    SocketService.subscribeTo({
      eventName: "game-message",
      callback: (data: { date: Date; message: string }) => {
        console.log(data);
        store.dispatch(
          gameplayActions.newMessage({ ...data, isFromOpponent: true })
        );
      },
    });
    SocketService.subscribeTo({
      eventName: "running-match",
      callback: (runningMatch: IGameResume) => {
        console.log(runningMatch);
        navigate("/");
        setTimeout(() => {
          store.dispatch(
            gameplayActions.setLoseMatchForLeaving({
              opponentName: getOpponentName(
                false,
                null,
                runningMatch.opponent as IUser
              ),
              eloLost: runningMatch.gameElos.eloLose,
              eloDraw: runningMatch.gameElos.eloDraw,
            })
          );
        }, 1000);
        // store.dispatch(gameplayActions.resumeGame(runningMatch));
        // navigate("/game");

        // SocketService.sendData("resume-my-game", null, (...args: any) => {
        //   console.log("resume-my-game In running match - set-guest-token:", args);
        // });
      },
    });

    SocketService.subscribeTo({
      eventName: "user-disconnect",
      callback: () => {
        SocketService.closeConnection();
        store.dispatch(userActions.setAlreadyAuthenticated(true));
        // store.dispatch(gameplayActions.resumeGame(runningMatch));
        // navigate("/game");

        // SocketService.sendData("resume-my-game", null, (...args: any) => {
        //   console.log("resume-my-game In running match - set-guest-token:", args);
        // });
      },
    });
    SocketService.subscribeTo({
      eventName: "running-match-treasure-hunt",
      callback: (runningMatch: {
        attempts: moveList;
        leaveTimestamp: number;
      }) => {
        console.log("runningMatch: ", runningMatch);
        const timeLeft: number = Math.floor(
          (runningMatch.leaveTimestamp + 10 * 60000 - new Date().getTime()) /
            1000
        );
        console.log(new Date(runningMatch.leaveTimestamp), new Date());
        let loot: number = runningMatch.attempts.reduce((ac, cu) => {
          if (cu.level)
            return ac + p.serverStatus[`Level${cu.level}TreasureValue`];
          else return ac + 0;
        }, 0);
        store.dispatch(
          treasureHuntActions.resumeGame({
            moveList: runningMatch.attempts,
            loot,
            timeLeft,
          })
        );

        // SocketService.sendData("resume-my-game", null, (...args: any) => {
        //   console.log("resume-my-game In running match - set-guest-token:", args);
        // });
      },
    });
    // SocketService.subscribeTo({
    //   eventName: "app-settings-change",
    //   callback: (settings: string) => {
    //     if (typeof settings === "string") {
    //       store.dispatch(userActions.setUserSettings(JSON.parse(settings)));
    //     } else if (typeof settings === "object") {
    //       store.dispatch(userActions.setUserSettings(settings));
    //     }
    //   },
    // });
    addMissedSocketActions();
    if (p.serverStatus.MaintenanceMode === MAINTENANCE_MODE.UNDER_MAINTENANCE) {
      setIsLoading(false);
      navigate("/maintenance");
    } else if (!token) {
      const guestToken = TOKEN.guest;
      console.log("if not token");
      console.log("That is GuestToken_" + guestToken);
      SocketService.sendData(
        `set-guest-token`,
        guestToken,
        (params: {
          user: IUser;
          token: string;
          highestAIGameLevelWon: number;
        }) => {
          console.log(params);
          //@ts-ignore
          if (params === "already authenticated") {
            console.log(params);
            store.dispatch(userActions.setAlreadyAuthenticated(true));
            // navigate("/already-authenticated");
          }
          const tokenToSet = params.token ? params.token : guestToken;
          TOKEN.guest = tokenToSet;
          API.initialize();
          store.dispatch(
            userActions.setCurrentUser({
              ...params.user,
              HighestAIGameLevelWon: params.highestAIGameLevelWon,
            })
          );

          // SocketService.sendData("resume-my-game", null, (...args: any) => {
          //   console.log("resume-my-game Guest - set-guest-token:", args);
          // });
          setIsLoading(false);
        }
      );
    } else if (token) {
      console.log("Validated");
      SocketService.sendData(
        `set-user-token`,
        token,
        async (isTokenValid: boolean | string) => {
          console.log("Validated", token, isTokenValid);
          if (isTokenValid === "already authenticated") {
            store.dispatch(userActions.setAlreadyAuthenticated(true));
            // navigate("/already-authenticated");
          }
          if (!isTokenValid) {
            TOKEN.remove();
            return;
          }
          TOKEN.user = token;
          // SocketService.sendData("resume-my-game", null, (...args: any) => {
          //   console.log("resume-my-game User - set-user-token", args);
          // });
          API.initialize();
          store.dispatch(userActions.fetchCurrentUser());
          setIsLoading(false);
        }
      );
    }

    // if (
    //   window.location.pathname.indexOf("/game") === 0 &&
    //   p.playMode &&
    //   !p.playMode.isAI &&
    //   !p.playMode.isHumanVsHuman
    // ) {
    //   navigate("/");
    // }
    initialized.current = true;
  }

  // if (
  //   p.serverStatus &&
  //   p.serverStatus.MaintenanceMode === MAINTENANCE_MODE.UNDER_MAINTENANCE
  // ) {
  //   navigate("/maintenance");
  // }
  // }, []);
  return isLoading ? null : (
    <>
      {p.loseMatchForLeaving && !p.alreadyAuthenticated && (
        <ResumeOldGameModal
          onResume={() => {
            SocketService.sendData(
              "resume-my-game",
              null,
              (runningMatch: IGameResume) => {
                p.setLoseMatchForLeaving(null);
                console.log("Running match->>>", runningMatch);
                store.dispatch(gameplayActions.resumeGame(runningMatch));
              }
            );
          }}
          loseMatchForLeaving={p.loseMatchForLeaving}
          onLeave={() => {
            p.setLoseMatchForLeaving(null);
          }}
          leavingTime={30000} // todo: From backend value when user left game
        />
      )}
      {p.gameInProgress &&
        p.gameInProgressUserNavigating &&
        !p.alreadyAuthenticated && (
          <ResumeOldGameModalTreasureQuest
            onResume={() => {
              navigate("/treasurequest");
            }}
            onLeave={() => {
              console.log("here");
              p.setGameInProgressAndUserNavigating(false);
            }} // todo: From backend value when user left game
          />
        )}
      {p.children}
    </>
  );
};

const mapStateToProps = (state: IAppState) => ({
  playMode: state.gameplay.playMode,
  serverStatus: state.user.serverStatus,
  loseMatchForLeaving: state.gameplay.loseMatchForLeaving,
  gameInProgress: state.treasureHunt.gameInProgress,
  timeLeft: state.treasureHunt.timeLeft,
  gameInProgressUserNavigating: state.treasureHunt.gameInProgressUserNavigating,
  alreadyAuthenticated: state.user.alreadyAuthenticated,
});

const ConnectedX = connect<ISelectXProps>(mapStateToProps as any, {
  setLoseMatchForLeaving: gameplayActions.setLoseMatchForLeaving,
  setGameInProgressAndUserNavigating:
    treasureHuntActions.setGameInProgressAndUserNavigating,
})(X);

// eslint-disable-next-line react/display-name,react/prop-types
const Main = (p: any) => {
  // Instantiating store in `wrapRootElement` handler ensures:
  //  - there is fresh store for each SSR page
  //  - it will be called only once in browser, when React mounts
  return (
    <Provider store={store}>
      <ConnectedX>{p.element}</ConnectedX>
    </Provider>
  );
};

export default Main;
