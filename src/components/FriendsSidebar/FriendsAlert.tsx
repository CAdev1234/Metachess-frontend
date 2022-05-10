import React from "react";
import ConfirmIcon from "../../assets/images/confirm-circle-green.png";
import CancelIcon from "../../assets/images/cancel-circle-red.png";
import { IFriend } from "../../store/chat/chat.interfaces";
import { IndexType } from "typescript";

interface IFriendReqProps{
    friend: IFriend,
    closeToast?: any,
    onConfirm: (friend: IFriend) => void,
    onDecline?: (friend: IFriend) => void,
    type: string
}

const alertMessage = (friend: IFriend , type: string): string => {
    const options: {[key: string]: string} = {
        "friendReq": `${friend.Account.Username} sent a friend request.`,
        "friendDel": `Remove ${friend.Account.Username} from your firends list.`
    }

    return options[type]
}

export default function FriendRequestAlert ({ friend , onConfirm, onDecline, closeToast, type }:IFriendReqProps) {
    return (
    <div className="friendsSidenar__toasthandle">
      {alertMessage(friend,type)}
      <div className="friendsSidenar__toasthandle__buttons">
        <button onClick={() => { onConfirm(friend); closeToast()} } >
           Confirm <img src={ConfirmIcon} alt="confirm icon" />
        </button>
        <button onClick={() => {if(onDecline){onDecline(friend)}; closeToast()} }>
           Decline <img src={CancelIcon} alt="confirm icon" />
        </button>
      </div>
    </div>
)}