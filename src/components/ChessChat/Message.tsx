import React from "react";
import { IMessage } from ".";
import moment from "moment";
interface Props {
  message: IMessage;
  isFromUser: boolean;
}

const Message = ({ message, isFromUser }: Props) => {
  const timeOfMessageString = moment(message.time).format("HH:mm:ss");
  return (
    <div className={`messageWrapper ${isFromUser ? "userMessageWrapper" : ""}`}>
      <p className={`messageText ${isFromUser ? "userMessageText" : ""}`}>
        {message.text}
      </p>
      <p className={`messageTime ${isFromUser ? "userMessageTime" : ""}`}>
        {timeOfMessageString}
      </p>
    </div>
  );
};

export default Message;
