import React from "react";
import CircleProgressBarBase from "../CirclePercentage";

interface Props {
  wins: number;
  loses: number;
  draws: number;
}

const WinRatio = ({ wins, loses, draws }: Props) => {
  const ratio = wins + loses + draws !== 0 ? (wins / (wins + loses + draws)).toFixed(2) : 0;
  const symbols = [
    {
      title: "Wins",
      count: wins,
      color: "#CCA66A",
    },
    {
      title: "Loses",
      count: loses,
      color: "rgba(255, 255, 255, 0.27)",
    },
    {
      title: "Draws",
      count: draws,
      color: "rgba(255, 255, 255, 0.8)",
    },
  ];
  return (
    <div className="winRatioWrapper">
      <div className="circleWrapper summaryCircleProgress">
        <CircleProgressBarBase
          className={"summaryCircleProgress"}
          percentage={ratio * 100}
          trailStrokeColor={"rgba(255, 255, 255, 0.27)"}
          strokeColor={"#CCA66A"}
        />
        <div className="circleContent">
          <p className="circleTitle">{ratio * 100}%</p>
          <p className="circleSubtitle">Winratio</p>
        </div>
      </div>
      <div className="symbols">
        {symbols.map((symbol, idx) => (
          <div className="symbolWrapper" key={idx}>
            <div className="titleWrapper">
              <p className="title" style={{ color: symbol.color }}>
                {symbol.title}
              </p>
            </div>
            <div className="titleWrapper">
              <p className="count" style={{ color: symbol.color }}>
                {symbol.count}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WinRatio;
