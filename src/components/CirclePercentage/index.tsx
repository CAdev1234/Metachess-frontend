import React from "react";

const INITIAL_OFFSET = 25;
const circleConfig = {
  viewBox: "0 0 38 38",
  x: "19",
  y: "19",
  radio: "15.91549430918954",
};

interface Props {
  className?: string;
  trailStrokeColor?: string;
  strokeColor?: string;
  percentage: number;
  children?: JSX.Element;
  width?: string;
}

const CircleProgressBarBase = ({
  className,
  trailStrokeColor = "#E84343",
  strokeColor = "#297BFB",
  percentage,
  width = "170px",
  children,
}: Props) => {
  return (
    <figure className={`circlePercentageWrapper ${className}`}>
      <svg viewBox={circleConfig.viewBox} style={{ width }}>
        <circle
          className="ring"
          cx={circleConfig.x}
          cy={circleConfig.y}
          r={circleConfig.radio}
          strokeWidth="4"
          fill="transparent"
          stroke={trailStrokeColor}
        />

        <circle
          className="path"
          cx={circleConfig.x}
          cy={circleConfig.y}
          r={circleConfig.radio}
          fill="transparent"
          stroke={strokeColor}
          strokeDasharray={`${percentage} ${100 - percentage}`}
          strokeDashoffset={INITIAL_OFFSET}
          strokeWidth="4"
        />
      </svg>
    </figure>
  );
};

export default CircleProgressBarBase;
