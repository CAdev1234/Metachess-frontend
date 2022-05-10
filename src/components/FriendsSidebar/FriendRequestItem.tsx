import React from "react";
import PieceIcon from "../../assets/images/Subtracao_23.svg";
import ConfirmIcon from "../../assets/images/confirm-circle-green.png";
import CancelIcon from "../../assets/images/cancel-circle-red.png";
import { useDispatch } from "react-redux";
import { chatActions } from "../../store/chat/chat.actions";
import { IFriend } from "../../store/chat/chat.interfaces";

interface IProps {

  friendReuest: IFriend;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>

}

const FriendRequestItem = ({ setRefresh,friendReuest }: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const confirmRequest = () => {
    dispatch(chatActions.acceptFriendsRequest(friendReuest.Id));
    setRefresh( (state:Boolean) => !state)
  };
  const refuseRequest = () => {
    dispatch(chatActions.refuseFriendsRequest(friendReuest.Id));
  };
  return (
    <div className="friendsListItem">
      <div className="friendInfo">
        <img src={PieceIcon} />
        <span className="friendNameText friendRequestListItem">
          {friendReuest.Account.Fullname || friendReuest.Account.Username}
        </span>
      </div>
      <div className="friendRequestActions">
        <img src={ConfirmIcon} onClick={confirmRequest} />
        <img src={CancelIcon} onClick={refuseRequest} />
      </div>
    </div>
  );
};

export default FriendRequestItem;
