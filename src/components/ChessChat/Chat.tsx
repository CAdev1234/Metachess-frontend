import React from "react";
import { IMessage } from ".";
import Message from "./Message";
import MessagesSeparator from "./MessagesSeparator";

const USER_ID = "1";

interface Props {
  messages: IMessage[];
  small?: boolean
}

const ChessMessages = ({ messages, small }: Props) => {
  return (
    <div className={"scrollMessagesWrapper" + small ? ' small' : ''}>
      <MessagesSeparator title="Start" />
      {messages.map((message) => (
        <Message isFromUser={USER_ID === message.senderId} message={message} />
      ))}
    </div>
  );
};

export default ChessMessages;
