import React, { useState } from "react";
import { IChatItem } from "../../store/chat/chat.interfaces";
import { IUser } from "../../store/user/user.interfaces";
import SmallLogo from "../../assets/images/Subtracao_22.svg";
import CloseIcon from "../../assets/images/close-icon-white2.png";
import UnseenNumber from "./UnseenNumber";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChessMessages";
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "../../store/chat/chat.actions";
import { IAppState } from "../../store/reducers";
import { getOpponentName } from "../../helpers/getOpponentNameByPlayMode";
interface Props {
  item: IChatItem;
  onCloseChat: () => void;
}

const BottomChatItem = ({ item, onCloseChat }: Props) => {
  // const [isOpen, setIsOpen] = useState(false);
  const isOpen = useSelector((state: IAppState) => state.chat.activeChatOpened);
  const dispatch = useDispatch();

  const setIsOpen = (value: boolean) =>
    dispatch(chatActions.setActiveChatOpen(value));

  const closeChat = () => {
    if (isOpen) setIsOpen(false);
    else onCloseChat();
  };

  const onClick = () => {
    if(isOpen) setIsOpen(false)
    else{
      dispatch(
        chatActions.fetchChat({
          friendId: item.friend.Id,
          friend: item.friend as IUser,
          startingAfter: 0,
        })
      );
      setIsOpen(true);
    }
  }


  if (!item) return null;
  return (
    <div className={`bottomChatItemWrapper bottom__chat__itemWrapper ${isOpen ? " openedItem" : "closeItemChat"}`}>
      <div className="bottomChatHeader">
        <div className="userInfo" onClick={onClick}>
          <img className="chatIcon" src={item?.friend?.Avatar || SmallLogo} />
          <p>{getOpponentName(false, null, item?.friend)}</p>
          { item?.unseenCount ? (
            <UnseenNumber number={item?.unseenCount} />
          ) : null}
        </div>
        <div className="bottomChatHeader__closeIcon" onClick={closeChat}>
            <img className="closeIcon chat__content_closeIcon" src={CloseIcon}  />
        </div>
        {/* <p
          style={{ fontSize: "14px", fontWeight: 800, color: "#fff" }}
          onClick={closeChat}
          className="closeIcon"
        >
          X
        </p> */}
      </div>
      {isOpen && (
          <div className="chatContainer">
            <ChatMessages messages={item?.messages} />
            <ChatInput accountId={item?.id} />
          </div>
      ) }
    </div>
  );
};

export default BottomChatItem;
