import React , { useState , useEffect } from "react";
import PieceIcon from "../../assets/images/Subtracao_23.svg";
import CancelIcon from "../../assets/images/cancel-circle-red.png";
import { IFriend } from "../../store/chat/chat.interfaces";
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "../../store/chat/chat.actions";
import { getOpponentName } from "../../helpers/getOpponentNameByPlayMode";
import { toast } from "react-toastify";
import FirendsAlert from "./FriendsAlert"
import { IAppState } from "../../store/reducers";
import SocketService from "../../services/socket.service";
import Modal from '../Modal'

interface IProps {
  friend: IFriend;
}

enum AccountState { 
  Online = 1, 
  Offline, 
  PlayingTreasure, 
  PlayingAIGame, 
  PlayingOnline, 
  PlayingTournament, 
  Spectating, 
  Lobby 
}

const FriendListItem = ({ friend }: IProps): JSX.Element => {

  const dispatch = useDispatch();
  const [clicked, setClicked] = useState(false)
  const removeFriend = () => {
    dispatch(chatActions.removeFriend(friend.Id));
  };
  // const [friendStatus,setFriendStatus] = useState(AccountState[friend?.Account?.GameStatus])

  const onRemove = () => {
    setClicked(true)
    toast.info(<FirendsAlert type="friendDel" onConfirm={removeFriend} friend={friend}/>,{ closeOnClick: false , autoClose: false, onClose: () => setClicked(false)})
  }
  const activeChat = useSelector((state: IAppState) => state.chat.activeChat);
  const addActiveChat = () => {
    if (activeChat?.id === friend.Account.Id) {
      dispatch(chatActions.toggleSideChat(false));
      dispatch(chatActions.setActiveChatOpen(true));
      return;
    }
    dispatch(
      chatActions.fetchChat({
        friendId: friend.Account.Id,
        friend: friend.Account,
        startingAfter: 0,
      })
    );

    // useEffect(() => {
  
    //   SocketService.subscribeTo({
    //     eventName: "friend-status",
    //     callback: (payload: any) => {
    //       toast.success(`${friend.Account.Username} changed status.`, {
    //         autoClose: 10000,
    //         closeOnClick: false,
    //       });
    //       dispatch(chatActions.addFriend(friend));
    //       console.log('friend-status triggered with the response', payload)
    //       // setFriendStatus(AccountState[State])

    //     },
    //   });
    // }, []);

    // useEffect(() => {
    //   console.log('friend status updated on useEffect', friendStatus)
    // },[friendStatus])
  };
  const statusClass = `statusCircle ${friend.Account.GameStatus !== 2 ? "on" : "off"}`;

  return (
    <div className="friendsListItem">
      <div className="friendInfo" onClick={addActiveChat}>
        <div className="avatar">
          <img src={PieceIcon} />
          <div className={statusClass}></div>
        </div>
        <div className="friendNameText">
          <span>{friend.Account.Username}</span>
          <span>{friend.Account.GameStatus ? AccountState[friend.Account.GameStatus] : "Offline"}</span>
        </div>
        {/* {item.unseenCount && (
            <span className="unseenCount">{item.unseenCount}</span>
          )} */}
      </div>
      <div className="friendStatus">
        {
          !clicked &&
          <img
            className="remove-friend-icon"
            src={CancelIcon}
            onClick={onRemove}
          />
        }
        
      </div>
    </div>
  );
};

export default FriendListItem;
