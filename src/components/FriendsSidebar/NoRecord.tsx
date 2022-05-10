import React from "react";

const NoRecord = ({ children }: { children: string }): JSX.Element => {
  return (
    <div className="friendsListItem noRecord">
      <span>{children}</span>
    </div>
  );
};

export default NoRecord;
