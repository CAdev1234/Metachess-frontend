import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IAppState } from "../../store/reducers";
import SideChatHeader from "./SideChatHeader";
import ChatList from "./ChatList";
import FriendRequestsHeader from "./FriendRequests";
import FriendRequests from "./FriendRequests";

const SideChat = () => {
  const { chatOpened } = useSelector((state: IAppState) => state.chat);
  if (!chatOpened) return null;
  return (
    <div className="sideChatWrapper">
      <div className="sideChatContainer">
        <SideChatHeader />
        <div className={"sideChatMainItems"}>
          <ChatList />
          <FriendRequests />
        </div>
      </div>
    </div>
  );
};

export default SideChat;
