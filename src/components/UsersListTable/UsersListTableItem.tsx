import React from "react";
// import { IUserListItem } from ".";
import { IAppState } from "../../store/reducers";
import { connect } from "react-redux";
import { IUser } from "../../store/user/user.interfaces";
import {
  GameType,
  GameMode,
  PieceSide,
} from "../../interfaces/game.interfaces";
import { IGameItem } from "../../store/games/games.interfaces";
import { getOpponentName } from "../../helpers/getOpponentNameByPlayMode";
import {
  canPlayGame,
  getGameTypeElo,
  getGameTypeName,
} from "../../helpers/gameTypeHelper";
import { SVG_ASSETS } from "../../constants/svgAssets";

interface Props {
  item: IGameItem;
  index?: number;
  currentUser: IUser;
  onPress: (id: string) => void;
}
const UserListTableItem = ({ item, onPress, currentUser }: Props) => {
  const hostRating = getGameTypeElo(item.gameRules.type, item.host);
  const canPlay = canPlayGame(item, currentUser);

  const isMyRoom =
    currentUser.Id === item.host.Id &&
    currentUser.GuestId === item.host.GuestId;

  const itemClick = (roomId: string) => {
    if (!canPlay) return;

    onPress(roomId);
  };

  return (
    <tr
      onClick={() => itemClick(item.roomId)}
      className={`usersListTableItemWrapper cells ${
        item.gameRules.chessCoin ? "markedRed" : ""
      } ${!canPlay ? "cannot-play" : ""} ${isMyRoom ? "my-room" : ""}`}
    >
      <td className="nameWrapper">
        <p>{getOpponentName(false, null, item.host)}</p>
      </td>
      <td>
        <p>{`${getGameTypeName(item.gameRules.time.base)} - ${
          item.gameRules.mode === GameMode.Casual ? "Casual" : "Rated"
        }`}</p>
      </td>
      <td className="elo">
        <p>{hostRating}</p>
      </td>
      <td>
        <p>{`${item.gameRules.time.base}+${item.gameRules.time.increment}`}</p>
      </td>
      <td className="side">
        {item.gameRules.hostSide === PieceSide.Black ? (
          <img src={SVG_ASSETS.bSide} />
        ) : item.gameRules.hostSide === PieceSide.White ? (
          <img src={SVG_ASSETS.wSide} />
        ) : (
          <img src={SVG_ASSETS.bwSide} />
        )}
      </td>
    </tr>
  );
};

const mapStateToProps = ({ user: { currentUser } }: IAppState): any => ({
  currentUser,
});

export default connect(mapStateToProps)(UserListTableItem);
