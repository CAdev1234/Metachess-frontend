import React, { useEffect, useState } from "react";
import UsersListTableHeader from "./UsersRankingTableHeader";
import UserListTableItem from "./UsersRankingTableItem";
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

const UsersListTable = ({
  option,
  type,
  quickPlayTime,
}: {
  option: string;
  type: string;
  quickPlayTime: number;
}) => {
  const [page, setPage] = useState<number>(1);
  const { totalResults }: { totalResults: number } = useSelector(
    (state: IAppState) => state.leaderboard
  );
  useEffect(() => {
    setPage(1);
  }, [option, quickPlayTime]);
  const nextCondition: boolean =
    totalResults !== 0 && (page + 1) * 10 <= totalResults;
  const prevCondition: boolean = totalResults !== 0 && page - 1 > 0;
  const firstCondition: boolean = totalResults !== 0 && page !== 1;
  const lastCondition: boolean =
    totalResults !== 0 && page !== Math.ceil(totalResults / 10);
  return (
    <div className="usersRankingTable">
      <table>
        <thead>
          <UsersListTableHeader option={option} type={type} />
        </thead>
        <tbody>
          {/* {(gameItems || []).map((item, index) => (
            <UserListTableItem
              key={item.roomId}
              index={index}
              item={item}
              onPress={onItemPress}
            />
          ))} */}
          <UserListTableItem
            option={option}
            type={type}
            quickPlayTime={quickPlayTime}
            page={page}
          />
        </tbody>
      </table>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "2vmax",
          float: "left",
          marginTop: "4vmin",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            fontWeight: "bolder",
            color: prevCondition ? "#fff" : "rgba(255,255,255,0.6)",
            cursor: prevCondition ? "pointer" : "no-drop",
          }}
          onClick={() => {
            if (prevCondition) setPage(page - 1);
          }}
        >
          {"<"} Previous
        </p>
        <p
          style={{
            fontSize: "12px",
            fontWeight: "bolder",
            color: nextCondition ? "#fff" : "rgba(255,255,255,0.6)",
            cursor: nextCondition ? "pointer" : "no-drop",
          }}
          onClick={() => {
            if (nextCondition) setPage(page + 1);
          }}
        >
          Next {">"}
        </p>

        <p
          style={{
            fontSize: "12px",
            fontWeight: "bolder",
            color: firstCondition ? "#fff" : "rgba(255,255,255,0.6)",
            cursor: firstCondition ? "pointer" : "no-drop",
          }}
          onClick={() => {
            if (firstCondition) setPage(1);
          }}
        >
          First
        </p>
        <p
          style={{
            fontSize: "12px",
            fontWeight: "bolder",
            color: lastCondition ? "#fff" : "rgba(255,255,255,0.6)",
            cursor: lastCondition ? "pointer" : "no-drop",
          }}
          onClick={() => {
            if (lastCondition) setPage(Math.ceil(totalResults / 10));
          }}
        >
          Last
        </p>
      </div>
      {/* <div className="listItems">
        
      </div> */}
    </div>
  );
};
export default UsersListTable;
