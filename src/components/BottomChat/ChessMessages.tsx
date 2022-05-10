import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "../../store/chat/chat.actions";
import { IAppState } from "../../store/reducers";
import { IMessage } from "../ChessChat";
import Message from "./Message";
import MessagesSeparator from "./MessagesSeparator";

interface Props {
  messages: any[];
  small?: boolean;
  isGame?: boolean;
}

const ChessMessages = ({ messages, small, isGame }: Props) => {
  const user = useSelector((state: IAppState) => state.user.currentUser);
  const firstMessageRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  // const activeChat = useSelector((state: IAppState) => state.chat.activeChat);
  const dispatch = useDispatch();
  const firstScroll = useRef<boolean>(false);
  const observer = useRef(
    new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && firstScroll.current && !isGame) {
        // const scroll = messageContainerRef.current.scrollTop;
        dispatch(chatActions.fetchMessages());
      }
    })
  );
  // const firstMessageRef = useCallback((el:any) => {
  //   // console.log("firstRef", args);
  //   const observer = new IntersectionObserver(
  // }, []);
  // const lastMessageRef = useRef<HTMLDivElement>(null);
  // if(!messages)return
  const lastMessageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const currentElement = firstMessageRef.current;
    const currentObserver = observer.current;
    // if (firstScroll.current) {
    if (currentElement) {
      currentObserver.observe(currentElement);
    }
    // }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [firstMessageRef.current]);
  useEffect(() => {
    const currentElement = lastMessageRef.current;
    if (currentElement) {
      currentElement.scrollIntoView();
      setTimeout(() => (firstScroll.current = true), 100);
    }
  }, []);
  return (
    <div
      className={"scrollMessagesWrapper" + small ? " small" : ""}
      ref={messageContainerRef}
    >
      {/* <MessagesSeparator title="Start" /> */}
      {(messages || []).map((message: IMessage, i) => (
        <Message
          // ref={
          //   i === 0
          //     ? firstMessageRef
          //     : i === messages.length - 1
          //     ? lastMessageRef
          //     : null
          // }
          key={message.Id}
          lastRef={i === messages.length - 1 ? lastMessageRef : null}
          firstRef={i === 0 ? firstMessageRef : null}
          isFromUser={(user.Id || user.GuestId) === message.Sender.Id}
          message={message}
        />
      ))}
    </div>
  );
};

export default ChessMessages;
