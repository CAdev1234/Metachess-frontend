import React , { useState } from "react";
import { useDispatch } from "react-redux";
import PieceIcon from "../../assets/images/Subtracao_23.svg";
import { chatActions } from "../../store/chat/chat.actions";
import { IUser } from "../../store/user/user.interfaces";

interface IProps {
  item: IUser;
}
const AddFriendListItem = ({ item }: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const [sent, setSent] = useState(false)
  const sendFriendReq = () => {
    if(sent) return
    dispatch(chatActions.sendFriendsRequests(item.Id));
    setSent(true)
  };
  return (
    <>
      <div className="friendsListItem">
        <div className="friendInfo">
          <img src={PieceIcon} />
          <span className="friendNameText">{item.Username}</span>
        </div>
        <div className="addFriendActions" onClick={sendFriendReq}>
          {
            !sent 
            ?
            <span>+</span>
            : 
            <span>(sent)</span>
          }
        </div>
      </div>
    </>
  );
};

export default AddFriendListItem;
