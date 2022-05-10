import React, { useState } from "react";
import UpArrow from "../../assets/images/up-arrow-white.png";
import { useSelector } from "react-redux";
import { IAppState } from "../../store/reducers";
import FriendRequest from "./FriendRequest";
const FriendRequests = () => {
  const [expanded, setExpanded] = useState(false);
  const { friendRequests } = useSelector((state: IAppState) => state.chat);
  return (
    <div className={"friendRequestsWrapper"}>
      <div
        className="sideChatHeaderWrapper"
        onClick={() => setExpanded(!expanded)}
      >
        <p>FRIEND REQUESTS</p>
        <img  src={UpArrow} />
      </div>
        {(friendRequests || []).map((friendRequest) => (
          <FriendRequest onPressCancel={() =>{}} onPressConfirm={() =>{}} item={friendRequest} />
        ))}
    </div>
  );
};

export default FriendRequests;
