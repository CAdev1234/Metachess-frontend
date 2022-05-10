import React from "react";
import CircleProgressBarBase from "../CirclePercentage";

const NewMatches = () => {
  return (
    <div className="matchesContainer shadowContainer">
      <div className="innerContent">
        <p className="sectionTitle">Matches</p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          paddingBottom: "2vmin",
        }}
      >
        <div>
          <div className="circleWrapper summaryCircleProgress">
            <CircleProgressBarBase
              className={"summaryCircleProgress"}
              percentage={50}
              trailStrokeColor={"rgba(255, 255, 255, 0.27)"}
              strokeColor={"#CCA66A"}
            />
            <div className="circleContent">
              <p className="circleTitle">{50}%</p>
            </div>
          </div>
          <p className="circleHeading">Lorem Ipsum</p>
        </div>
        <div>
          <div className="circleWrapper summaryCircleProgress">
            <CircleProgressBarBase
              className={"summaryCircleProgress"}
              percentage={50}
              trailStrokeColor={"rgba(255, 255, 255, 0.27)"}
              strokeColor={"#CCA66A"}
            />
            <div className="circleContent">
              <p className="circleTitle">{50}%</p>
            </div>
          </div>
          <p className="circleHeading">Lorem Ipsum</p>
        </div>
        <div>
          {" "}
          <div className="circleWrapper summaryCircleProgress">
            <CircleProgressBarBase
              className={"summaryCircleProgress"}
              percentage={50}
              trailStrokeColor={"rgba(255, 255, 255, 0.27)"}
              strokeColor={"#CCA66A"}
            />
            <div className="circleContent">
              <p className="circleTitle">{50}%</p>
            </div>
          </div>
          <p className="circleHeading">Lorem Ipsum</p>
        </div>
      </div>
    </div>
  );
};

export default NewMatches;
