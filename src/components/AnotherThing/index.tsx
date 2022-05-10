import React from "react";
import { useSelector } from "react-redux";
import { IAppState } from "../../store/reducers";
import CircleProgressBarBase from "../CirclePercentage";

const AnotherThing = () => {
  const userStats: {
    WonGames: number;
    DrawGames: number;
    LostGames: number;
    TreasuresFound: number;
    TreasureGames: number;
  } = useSelector((state: IAppState) => state.user.userStats);
  return (
    <div className="anotherThingContainer shadowContainer">
      <div className="innerContent">
        <p className="sectionTitle">Treasure Quest</p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "column",
            gap: "8vmin",
            boxSizing: "border-box",
            marginTop: "4vmin",
            marginBottom: "6vmin",
          }}
        >
          <div className="container">
            <p className="text">Treasure Quest Games Played</p>
            <div className="circleWrapperContainer">
              <div className="circleWrapper summaryCircleProgress">
                <CircleProgressBarBase
                  className={"summaryCircleProgress"}
                  percentage={0}
                  trailStrokeColor={"rgba(255, 255, 255, 0.27)"}
                  strokeColor={"#CCA66A"}
                  width="13vmin"
                />
                {/* <div className="circleContent"> */}
                <p className="circleTitle">{userStats.TreasureGames}</p>
                {/* </div> */}
              </div>
            </div>
          </div>
          <div className="container" style={{ flexDirection: "row-reverse" }}>
            <p className="text">Treasures Found</p>
            <div className="circleWrapperContainer">
              <div
                className="circleWrapper summaryCircleProgress"
                style={{ marginTop: "1vmin" }}
              >
                <CircleProgressBarBase
                  className={"summaryCircleProgress"}
                  percentage={0}
                  trailStrokeColor={"rgba(255, 255, 255, 0.27)"}
                  strokeColor={"#CCA66A"}
                  width="13vmin"
                />
                {/* <div className="circleContent"> */}
                <p className="circleTitle">{userStats.TreasuresFound}</p>
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnotherThing;
