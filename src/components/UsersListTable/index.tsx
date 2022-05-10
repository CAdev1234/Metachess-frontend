import React, { useEffect } from "react";
import UsersListTableHeader from "./UsersListTableHeader";
import UserListTableItem from "./UsersListTableItem";
import SocketService from "../../services/socket.service";
import { IGameItem, RoomEvent } from "../../store/games/games.interfaces";
import { IAppState } from "../../store/reducers";
import { connect, useSelector } from "react-redux";
import { Actions as GamesActions } from "../../store/games/games.action";
import { Actions as GameplayActions } from "../../store/gameplay/gameplay.action";
import { Actions as UserActions } from "../../store/user/user.action";
import { getOpponentName } from "../../helpers/getOpponentNameByPlayMode";
import {
  GameMode,
  GameRules,
  PieceSide,
  GameType,
} from "../../interfaces/game.interfaces";
import { navigate } from "gatsby";
import { IUser } from "../../store/user/user.interfaces";
import isEmpty from "lodash/isEmpty";
import subscribeToGameStart from "../../lib/gameStart";
import { toast } from "react-toastify";

// export interface IUserListItem {
//   id: string;
//   name: string;
//   badge?: string;
//   rating?: string | number;
//   time: string;
//   chessCoins?: string;
//   status: boolean;
//   gameType: GameType;
// }

interface ISelectProps {
  gameItems: IGameItem[];
}

interface IActionProps {
  setGameItems: typeof GamesActions.setGameItems;
  setPlayerColor: typeof GameplayActions.setPlayerColor;
  setGameRules: typeof GameplayActions.setGameRules;
  setOpponent: typeof GameplayActions.setOpponent;
  setPlayMode: typeof GameplayActions.setPlayMode;
  modifyGameItems: typeof GamesActions.modifyGameItems;
  setCurrentUser: typeof UserActions.setCurrentUser;
}

interface IProps extends ISelectProps, IActionProps {
  usersList?: IGameItem[];
  currentUser: IUser;
}

interface IJoinRoomsPage {
  user: IUser;
  rooms: IGameItem[];
}

// const mapGameItemsToUserList = (gameItem: IGameItem): IUserListItem => {
//   return {
//     id: gameItem.roomId,
//     name: getOpponentName(false, null, gameItem.host),
//     time: `${gameItem.gameRules.time.base}+${gameItem.gameRules.time.increment}`,
//     status: !isEmpty(gameItem.gameRules.chessCoin),
//     chessCoins:
//       gameItem.gameRules.chessCoin &&
//       `${gameItem.gameRules.chessCoin.minium}-${gameItem.gameRules.chessCoin.maxium}`,
//     gameType: gameItem.gameRules.type,
//     rating:
//       // gameItem.gameRules.mode.toString() === GameMode.Rated.toString() &&
//       `${gameItem.gameRules.rating.minium}-${gameItem.gameRules.rating.maxium}`,
//     badge:
//       gameItem.gameRules.mode.toString() === GameMode.Rated.toString()
//         ? `badge`
//         : null,
//   };
// };

const UsersListTable = ({
  setGameItems,
  setPlayerColor,
  setGameRules,
  setOpponent,
  setPlayMode,
  setCurrentUser,
  modifyGameItems,
}: IProps) => {
  const { currentUser } = useSelector((state: IAppState) => state.user);
  const gameItems = useSelector(({ games }: IAppState) => games.gameItems);
  useEffect(() => {
    SocketService.subscribeTo({
      eventName: "rooms-page",
      callback: (args: IGameItem) => {
        modifyGameItems(args);
      },
    });
    SocketService.sendData(
      `join-rooms-page`,
      null,
      ({ rooms, user }: IJoinRoomsPage) => {
        setCurrentUser({ ...user });
        setGameItems(rooms);
      }
    );

    return () => {
      // console.log("leaving the game",{currentUser,gameItems})
      // SocketService.unSubscribeTo({
      //   eventName: "rooms-page",
      //   callback: (args: IGameItem) => {
      //     modifyGameItems(args);
      // }});

      SocketService.sendData(`leave-rooms-page`, null, () => {});

    };
  }, []);

  const onItemPress = (roomId: string) => {
    // subscribeToGameStart();

    // SocketService.sendData("join-game", roomId, (stringForNow: boolean) => {
    //   // TODO: Will be typeof GameRules
    //   console.log("join-game:", stringForNow);
    // });
    navigate(`/join-game?roomId=${roomId}`);
  };
  console.log(gameItems);
  return (
    <div className="usersListTable">
      <table>
        <thead>
          <UsersListTableHeader />
        </thead>
        <tbody>
          {(gameItems || []).map((item, index) => (
            <UserListTableItem
              key={item.roomId}
              index={index}
              item={item}
              onPress={
                item.host.Id !== currentUser.Id
                ?
                onItemPress
                :
                () => toast.warn("You can't join a room created by yourself")
              }
            />
          ))}
        </tbody>
      </table>

      {/* <div className="listItems">
        
      </div> */}
    </div>
  );
};

const connected = connect(null, {
  setGameItems: GamesActions.setGameItems,
  modifyGameItems: GamesActions.modifyGameItems,
  setPlayerColor: GameplayActions.setPlayerColor,
  setGameRules: GameplayActions.setGameRules,
  setOpponent: GameplayActions.setOpponent,
  setPlayMode: GameplayActions.setPlayMode,
  setCurrentUser: UserActions.setCurrentUser,
});

export default connected(UsersListTable);
