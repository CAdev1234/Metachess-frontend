import React, { useState } from "react";
import SmallArrowLeft from "../../assets/images/small-arrow-left.png";
import SmallArrowRight from "../../assets/images/small-arrow-right.png";

interface Props {
  onClickNext: (date: Date) => void;
  onClickPrev: (date: Date) => void;
  title: string;
}

const ProfileDateRange = ({ onClickNext, onClickPrev, title }: Props) => {
  return (
    <div className="dateRangeWrapper">
      <p className="leftIcon"
        onClick={() => onClickPrev(new Date())}> {"<"}</p>
      <p className="title">{title}</p>
      <p className="leftIcon"
        onClick={() => onClickNext(new Date())}> {">"}</p>
      {/* <div
        className="invisibleButton left"
      />
      <div
        className="invisibleButton right"
      /> */}
    </div>
  );
};

export default ProfileDateRange;
