import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "../../store/chat/chat.actions";
import { IAppState } from "../../store/reducers";
import { ISpectatingMessage } from "../../store/spectate/spectate.interfaces";
import { IMessage } from "../ChessChat";
import Message from "../BottomChat/Message";
import NotificationMessage from "./NotificationMessage";

interface Props {
  messages: any[];
  small?: boolean;
  isGame?: boolean;
}

const ChessMessages = ({ messages, small, isGame }: Props) => {
  const user = useSelector((state: IAppState) => state.user.currentUser);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const currentElement = lastMessageRef.current;
    if (currentElement) {
      currentElement.scrollIntoView();
    }
  }, []);
  return (
    <div className={"scrollMessagesWrapper" + small ? " small" : ""}>
      {/* <MessagesSeparator title="Start" /> */}
      {(messages || []).map((message: ISpectatingMessage, i) =>
        message.isNotification ? (
          <NotificationMessage message={message.message} />
        ) : (
          <Message
            // ref={
            //   i === 0
            //     ? firstMessageRef
            //     : i === messages.length - 1
            //     ? lastMessageRef
            //     : null
            // }
            //   key={message}
            lastRef={i === messages.length - 1 ? lastMessageRef : null}
            isFromUser={(user.Id || user.GuestId) === message.sender.Id}
            firstRef={null}
            showSender={true}
            message={{
              Message: message.message,
              Sender: message.sender,
              Date: message.date,
            }}
          />
        )
      )}
    </div>
  );
};

export default ChessMessages;
