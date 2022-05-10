import React, { useEffect, useState } from "react";
import ArrowIcon from "../../assets/images/up-arrow-white.png";
import { useDispatch, useSelector } from "react-redux";
import { IAppState } from "../../store/reducers";
import FriendRequestItem from "./FriendRequestItem";
import { chatActions } from "../../store/chat/chat.actions";
import NoRecord from "./NoRecord";

const FriendRequests = (): JSX.Element => {
  const dispatch = useDispatch();
  const [showRequests, setShowRequests] = useState(false);
  const [refresh, setRefresh] = useState(false)
  const { friendRequests } = useSelector((state: IAppState) => state.chat);
  
  useEffect(() => {
    dispatch(chatActions.fetchFriendsRequestsList());
  }, [refresh]);

  return (
    <div
      className={`friendRequestsContainer ${
        showRequests ? "showRequests" : ""
      }`}
    >
      <div
        className="friendRequestHeader"
        onClick={() => setShowRequests((s) => !s)}
      >
        <span>FRIEND REQUESTS {friendRequests.length}</span>
        <img src={ArrowIcon} className={!showRequests ? "down" : ""} />
      </div>
      {showRequests &&
        (friendRequests && friendRequests.length ? (
          friendRequests.map((friendReq) => (
            <FriendRequestItem setRefresh={setRefresh} key={friendReq.Id} friendReuest={friendReq} />
          ))
        ) : (
          <NoRecord>No active friend requests!</NoRecord>
        ))}
    </div>
  );
};
export default FriendRequests;
