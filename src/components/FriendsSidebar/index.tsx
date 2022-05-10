import React, { useContext  , useEffect } from "react";
import { toast } from "react-toastify";
import FriendRequests from "./FriendRequests";
import { useDispatch, useSelector } from "react-redux";
import { IAppState } from "../../store/reducers";
import { chatActions } from "../../store/chat/chat.actions";
import SocketService from "../../services/socket.service";
import FriendList from "./FriendList";
import FirendsAlert from "./FriendsAlert"
import AddFriend from "./AddFriend";
import { IFriend } from "../../store/chat/chat.interfaces";
import CloseIcon from "../../assets/images/close-icon-white2.png";
import SideChat from "../SideChat";

const MAX_NUM_FRIENDS = 200;



const FriendsSidebar = (): JSX.Element => {
  const dispatch = useDispatch();
  const { chatOpened, addFriendSearch } = useSelector(
    (state: IAppState) => state.chat
  );
  const { friendsList } = useSelector((state: IAppState) => state.chat);

  useEffect(() => {
    SocketService.subscribeTo({
      eventName: "friend-request",
      callback: (friend: IFriend) => {
        toast.info(<FirendsAlert type="friendReq" onDecline={onDecline} onConfirm={onConfirm} friend={friend}/>,{ closeOnClick: false})
        dispatch(chatActions.addFriendRequest(friend));
      },
    });

    SocketService.subscribeTo({
      eventName: "friend-added",
      callback: (friend: IFriend) => {
        toast.success(`${friend.Account.Username} accepted your friend request.`, {
          autoClose: 10000,
          closeOnClick: false,
        });
        dispatch(chatActions.addFriend(friend));
      },
    });
  }, []);

  const showFriendsList = () => {
    dispatch(chatActions.toggleAddFriendSearch(false));
  };

  const onConfirm = (friend: IFriend) => {
    console.log('CONFIRMED')
    dispatch(chatActions.acceptFriendsRequest(friend.Id));
    dispatch(chatActions.fetchFriendsRequestsList());

  }

  const onDecline = (friend: IFriend) => {
    console.log('CLOSED')
    dispatch(chatActions.refuseFriendsRequest(friend.Id));
    dispatch(chatActions.fetchFriendsRequestsList());
  }

 

  return (
    <div className={`friendsSidebarWrapper ${chatOpened ? "sidebarOpen" : ""}`}>
      <div className="friendsSidebarContainer">
        <div className="friendsHeader">
          <div style={{ cursor: "pointer" }} onClick={showFriendsList}>
            <span>Friends</span>
            <span style={{ marginLeft: "16px" }}>
              {friendsList.length}/{MAX_NUM_FRIENDS}
            </span>
          </div>
          <img
            src={CloseIcon}
            onClick={() => dispatch(chatActions.toggleSideChat())}
          />
        </div>
        <div className="friendsList">
          {addFriendSearch ? <AddFriend /> : <FriendList />}
        </div>
        {!addFriendSearch && <FriendRequests />}
     
      </div>
      {/* <SideChat /> */}
    </div>
  );
};

export default FriendsSidebar;
