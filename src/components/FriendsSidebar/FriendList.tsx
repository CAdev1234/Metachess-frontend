import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import orderBy from "lodash/orderBy";
import SocketService from "../../services/socket.service";
import { chatActions } from "../../store/chat/chat.actions";
import { IFriend } from "../../store/chat/chat.interfaces";
import { IAppState } from "../../store/reducers";
import FriendListItem from "./FriendListItem";
import NoRecord from "./NoRecord";

export interface ISocketFriend {
  Id: string;
  State?: number;
}

const FriendList = (): JSX.Element => {
  const { friendsList } = useSelector((state: IAppState) => state.chat);

  const dispatch = useDispatch();
  const showAddFriend = () => {
    dispatch(chatActions.toggleAddFriendSearch(true));
  };

  useEffect(() => {
    dispatch(chatActions.fetchFriendsList());
  }, []);

  const updateFriendStatus = (friend: ISocketFriend) => {
    const friendIndex = friendsList.findIndex((f) => f.Id === friend.Id);
    console.log("updateFriendStatus " , friend.State)
    friendsList[friendIndex].Account.GameStatus = friend.State;
    dispatch(chatActions.setFriendsList(friendsList));
  };

  useEffect(() => {
    if (friendsList.length === 0) {
      return;
    }

    SocketService.subscribeTo({
      eventName: "friend-status",
      callback: (friend: ISocketFriend) => {
        updateFriendStatus(friend);
      },
    });
  }, [friendsList]);

  const orderedFriendsList = orderBy(
    friendsList,
    ["Account.IsOnline", "Account.Username"],
    ["desc", "asc"]
  );

  return (
    <>
      <div className="addFriend" onClick={showAddFriend}>
        + Add Friend
      </div>
      {orderedFriendsList && orderedFriendsList.length ? (
        orderedFriendsList
        .map((friend: IFriend) => (
          <FriendListItem friend={friend} key={friend.Id} />
        ))
      ) : (
        <NoRecord>No friends added yet!</NoRecord>
      )}
    </>
  );
};

export default FriendList;
