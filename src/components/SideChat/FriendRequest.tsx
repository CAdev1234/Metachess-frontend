import React from "react";
import SmallLogo from "../../assets/images/Subtracao_22.svg";
import ConfirmCircleIcon from "../../assets/images/confirm-circle-green.png";
import CancelCircleIcon from "../../assets/images/cancel-circle-red.png";
import { IUser } from "../../store/user/user.interfaces";

interface Props {
  onPressCancel: () => void;
  onPressConfirm: () => void;
  item: IUser;
}

const FriendRequest = ({ onPressCancel, onPressConfirm, item }: Props) => (
  <div className="chatListItem">
    <div className="userInfo">
      <img className="chatIcon" src={SmallLogo} />
      <p>{item.Fullname}</p>
    </div>
    <div className="buttonsWrapper">
      <img src={ConfirmCircleIcon} onClick={onPressConfirm} />

      <img src={CancelCircleIcon} onClick={onPressCancel} />
    </div>
  </div>
);

export default FriendRequest;
