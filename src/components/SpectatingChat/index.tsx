import React, { useState } from "react";
import CloseIcon from "../../assets/images/close-icon-white2.png";
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "../../store/chat/chat.actions";
import { IAppState } from "../../store/reducers";
import { Actions } from "../../store/spectate/spectate.action";
import { getOpponentName } from "../../helpers/getOpponentNameByPlayMode";
import ChatInput from "./Chatinput";
import ChessMessages from "./ChessMessages";
import UnseenNumber from "../BottomChat/UnseenNumber";

const MyMessages = () => {
  const {
    spectatingChatOpen: isOpen,
    spectatingChatShowing,
    spectatingMessages,
    unreadCount,
  } = useSelector((state: IAppState) => state.spectate);
  const dispatch = useDispatch();

  const setIsOpen = (value: boolean) =>
    dispatch(Actions.setGameChatOpen(value));

  const closeChat = () => {
    if (isOpen) setIsOpen(false);
    else dispatch(Actions.setGameChatShow(false));
  };

  const onClick = () => {
    setIsOpen(!isOpen);
  }

  if (!spectatingChatShowing) return null;
  return (
    <div className={`bottomChatItemWrapper bottom__chat__itemWrapper ${isOpen ? " openedItem" : "closeItemChat"}`}>
      <div  className="bottomChatHeader">
        <div className="userInfo" onClick={onClick}>
          <p>Spectator's Chat</p>
          {!isOpen && unreadCount ? (
            <UnseenNumber number={unreadCount} />
          ) : null}
        </div>
        <div className="bottomChatHeader__closeIcon" onClick={closeChat}>
            <img className="closeIcon chat__content_closeIcon" src={CloseIcon}  />
        </div>
      </div>
      {isOpen && (
          <div className="chatContainer">
            <ChessMessages messages={spectatingMessages} />
            <ChatInput />
          </div>
      )}
    </div>
  );
};

export default MyMessages;
