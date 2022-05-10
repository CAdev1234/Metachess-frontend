import React, { useState } from "react";
import CloseIcon from "../../assets/images/close-icon-white2.png";
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "../../store/chat/chat.actions";
import { IAppState } from "../../store/reducers";
import { Actions } from "../../store/gameplay/gameplay.action";
import { getOpponentName } from "../../helpers/getOpponentNameByPlayMode";
import ChatInput from "../ChessChat/ChatInput";
import ChessMessages from "../BottomChat/ChessMessages";
import UnseenNumber from "../BottomChat/UnseenNumber";

const MyMessages = () => {
  const {
    gameChatOpen: isOpen,
    gameChatShowing,
    opponent,
    unreadCount,
    gameMessages,
  } = useSelector((state: IAppState) => state.gameplay);
  const dispatch = useDispatch();
  const setIsOpen = (value: boolean) =>
    dispatch(Actions.setGameChatOpen(value));

  const closeChat = () => {
    if (isOpen) setIsOpen(false);
    else dispatch(Actions.setGameChatShow(false));
  };

  const onClick = () => {
    setIsOpen(!isOpen)
  }

  if (!gameChatShowing) return null;
  return (
    <div className={`bottomChatItemWrapper bottom__chat__itemWrapper ${isOpen ? " openedItem" : "closeItemChat"}`}>
      <div className="bottomChatHeader">
        <div className="userInfo" onClick={onClick} >
          <p>{getOpponentName(false, null, opponent)}</p>
          {!isOpen && unreadCount ? (
            <UnseenNumber number={unreadCount} />
          ) : null}
        </div>
        <div className="bottomChatHeader__closeIcon" onClick={closeChat}>
            <img className="closeIcon chat__content_closeIcon" src={CloseIcon}  />
        </div>
      </div>
      {isOpen &&
          <div className="chatContainer">
            <ChessMessages messages={gameMessages} isGame={false} />
            <ChatInput />
          </div>
      }
    </div>
  );
};

export default MyMessages;
