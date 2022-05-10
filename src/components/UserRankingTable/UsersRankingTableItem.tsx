import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { IUserListItem } from ".";
// import { IAppState } from "../../store/reducers";
// import { connect } from "react-redux";
// import { IUser } from "../../store/user/user.interfaces";
import dummyUser from "../../assets/images/user.png";
import { Actions } from "../../store/leaderboard/leaderboard.action";
import {
  IFetchLeaderboardPayload,
  ILeaderboardReducer,
  ILeaderBoardResult,
} from "../../store/leaderboard/leaderboard.interfaces";
import { IAppState } from "../../store/reducers";
// import {
//   GameType,
//   GameMode,
//   PieceSide,
// } from "../../interfaces/game.interfaces";
// import { IGameItem } from "../../store/games/games.interfaces";
// import { getOpponentName } from "../../helpers/getOpponentNameByPlayMode";
// import {
//   canPlayGame,
//   getGameTypeElo,
//   getGameTypeName,
// } from "../../helpers/gameTypeHelper";
// import { SVG_ASSETS } from "../../constants/svgAssets";

const UserListTableItem = ({
  option,
  type,
  quickPlayTime,
  page,
}: {
  option: string;
  type: string;
  quickPlayTime: number;
  page: number;
}) => {
  const { Leaderboard }: ILeaderboardReducer = useSelector(
    (state: IAppState): ILeaderboardReducer => state.leaderboard
  );
  const [leaderBoard, setLeaderBoard] =
    useState<ILeaderBoardResult[]>(Leaderboard);
  console.log(leaderBoard, option);
  useEffect(() => {
    // switch (option) {
    //   case "G":
    //     temp = leaderboard.aiGamesLeaderboard;
    //     break;
    //   case "Q":
    //     temp = leaderboard.quickPlayLeaderboard;
    //     break;
    //   case "Bu":
    //     temp = leaderboard.bulletLeaderboard;
    //     break;
    //   case "Bl":
    //     temp = leaderboard.blitzLeaderboard;
    //     break;
    //   case "Cl":
    //     temp = leaderboard.classicalLeaderboard;
    //     break;
    //   case "Ra":
    //     temp = leaderboard.rapidLeaderboard;
    //     break;
    // }
    setLeaderBoard(Leaderboard);
  }, [Leaderboard]);
  const dispatch = useDispatch();
  useEffect(() => {
    const dateNow = new Date();
    const allTime = new Date(1).getTime();
    const requestObj: IFetchLeaderboardPayload = {
      beginDate: allTime,
      endDate: dateNow.getTime(),
      top: 10,
      skip: (page - 1) * 10,
      type: "",
    };
    if (type[0] === "M") {
      if (option === "G") {
        requestObj.type = "ai";
        dispatch(Actions.fetchLeaderboard(requestObj));
      } else {
        requestObj.type = "qp";
        switch (quickPlayTime) {
          case 0:
            requestObj.beginDate = new Date(
              dateNow.getFullYear(),
              dateNow.getMonth(),
              dateNow.getDate() - 7
            ).getTime();
            break;
          case 1:
            requestObj.beginDate = new Date(
              dateNow.getFullYear(),
              dateNow.getMonth() - 1,
              dateNow.getDate()
            ).getTime();
            break;
        }
        // console.log(requestObj)
        dispatch(Actions.fetchLeaderboard(requestObj));
      }
    } else {
      let gameType: number;
      switch (option) {
        case "Bu":
          gameType = 2;
          break;
        case "Cl":
          gameType = 1;
          break;
        case "Bl":
          gameType = 4;
          break;
        case "Ra":
          gameType = 3;
          break;
      }
      dispatch(
        Actions.fetchLeaderboard({
          ...requestObj,
          gameType,
          type: "r",
        })
      );
    }
  }, [option, quickPlayTime, type, page]);
  if (type[0] === "M") {
    return (
      <>
        {leaderBoard.map((user: ILeaderBoardResult, i: number) => (
          <tr>
            {" "}
            <td className="tableRankItemTextWrapper">
              {(page - 1) * 10 + i + 1}
            </td>
            <td
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "2vmax",
                height: "6vmin",
              }}
            >
              <img src={user.Account.Avatar || dummyUser} alt="userDP" />
              <p
                className="tableRankItemTextWrapper"
                style={{
                  width: " 100%",
                  height: " 100%",
                  display: " flex",
                  alignItems: " center",
                  justifyContent: " center",
                  padding: 0,
                }}
              >
                {user.Account.Username}
              </p>
            </td>
            <td className="tableRankItemTextWrapper">{user.Games}</td>
            <td className="tableRankItemTextWrapper">
              {user.Account.AverageRating}
            </td>
            {(option === "G" && (
              <td className="tableRankItemTextWrapper">
                {(user.Wins * 100) / user.Games}%
              </td>
            )) ||
              null}
            {(option !== "G" && (
              <>
                <td className="tableRankItemTextWrapper">
                  6000
                  {i < 3 ? <span className="claimText">Claim</span> : null}
                </td>
                <td className="tableRankItemTextWrapper">
                  {user.Account.WalletAddress
                    ? `${user.Account.WalletAddress.slice(
                        0,
                        5
                      )} --- ${user.Account.WalletAddress.slice(-5)}`
                    : null}
                </td>
              </>
            )) ||
              null}
          </tr>
        ))}
      </>
    );
  } else {
    return (
      <>
        {leaderBoard.map((user: ILeaderBoardResult, i: number) => (
          <tr>
            {" "}
            <td className="tableRankItemTextWrapper">{i + 1}</td>
            <td
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "2vmax",
                height: "6vmin",
              }}
            >
              <img src={user.Account.Avatar || dummyUser} alt="userDP" />
              <p
                className="tableRankItemTextWrapper"
                style={{
                  width: " 100%",
                  height: " 100%",
                  display: " flex",
                  alignItems: " center",
                  justifyContent: " center",
                  padding: 0,
                }}
              >
                {user.Account.Username}
              </p>
            </td>
            <td className="tableRankItemTextWrapper">{user.Games}</td>
            <td className="tableRankItemTextWrapper">
              {user.Account.AverageRating}
            </td>
            <td className="tableRankItemTextWrapper">
              {(user.Wins * 100) / user.Games}%
            </td>
          </tr>
        ))}
      </>
    );
  }
};
export default UserListTableItem;
