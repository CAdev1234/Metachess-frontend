import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SocketService from "../../services/socket.service";
import { chatActions } from "../../store/chat/chat.actions";
import { IAppState } from "../../store/reducers";
import GameChat from "../GameChat";
import MyMessages from "../MyMessages";
import SpectatingChat from "../SpectatingChat";
import BottomChatItem from "./BottomChatItem";

const BottomChat = () => {
  const dispatch = useDispatch();
  const { chatOpened, activeChat: chat } = useSelector(
    (state: IAppState) => state.chat
  );
  if (chatOpened) return null;
  return (
    <div className="bottomChatWrapper">
      {/* {activeChats || []
        ? activeChats.map((chat) => ( */}
      <BottomChatItem
        key={chat?.id || ""}
        item={chat}
        onCloseChat={() => {
          dispatch(chatActions.setActiveChat(null));
        }}
      />
      <MyMessages />
      <GameChat />
      <SpectatingChat />
    </div>
  );
};

export default BottomChat;
