import React from "react";

const UnseenNumber = ({ number }: { number: number }) => (
  <div className="unseenNumberIndicatorContainer">
    <p className="unseenNumberIndicatorTitle">{number}</p>
  </div>
);

export default UnseenNumber
