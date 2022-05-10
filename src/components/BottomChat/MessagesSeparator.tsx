import React from "react";

interface Props {
  title: string;
}

const MessagesSeparator = ({ title }: Props) => (
  <div className="separatorWrapper">
    <div className="separatorLine"></div>
    <p className={"separatorTitle"}>{title}</p>
    <div className="separatorLine"></div>
  </div>
);

export default MessagesSeparator;
