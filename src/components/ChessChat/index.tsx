import React from "react";
import { IUser } from "../../store/user/user.interfaces";
import ChessMessages from "./Chat";
import ChatInput from "./ChatInput";

export interface IMessage {
  Id?: number;
  Sender: IUser;
  Message: string;
  Date: Date;
}

// const messages: IMessage[] = [
//   {
//     id: "0",
//     senderId: '0',
//     text: "What a nice move you made there!!",
//     time: new Date(),
//   },
//   {
//     id: "1",
//     senderId: '1',
//     text: "Hehe thanks!",
//     time: new Date(),
//   },

// ];

const Chat = ({ ...restProps }): JSX.Element => {
  return (
    <div className="chessChatContainer" {...restProps}>
      <ChessMessages messages={messages} />
      <ChatInput />
    </div>
  );
};

export default Chat;
