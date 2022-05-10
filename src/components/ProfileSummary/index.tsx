import React from "react";
import { useSelector } from "react-redux";
import { IAppState } from "../../store/reducers";
import WinRatio from "./WinRatio";

const ProfileSummary = () => {
  const userStats: {
    WonGames: number;
    DrawGames: number;
    LostGames: number;
    TreasuresFound: number;
    TreasureGames: number;
  } = useSelector((state: IAppState) => state.user.userStats);
  return (
    <div className="profileSummaryContainer shadowContainer">
      <div className="innerContent profileSummaryInnerContent">
        <p className="sectionTitle">Summary</p>
        <WinRatio wins={userStats.WonGames} loses={userStats.LostGames} draws={userStats.DrawGames} />
      </div>
    </div>
  );
};

export default ProfileSummary;
