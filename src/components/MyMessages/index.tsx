import React, { useState } from "react";
import CloseIcon from "../../assets/images/close-icon-white2.png";
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "../../store/chat/chat.actions";
import { IAppState } from "../../store/reducers";
import ChatList from "../SideChat/ChatList";

const MyMessages = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { myMessagesOpened } = useSelector((state: IAppState) => state.chat);
  const dispatch = useDispatch();
  const closeChat = () => {
    if(isOpen){
      setIsOpen(false)
      return
    }
    else dispatch(chatActions.setChatOpen(false));
  };

  const toggleChat = () => {
    setIsOpen( open => !open )
  }

  if (!myMessagesOpened) return null;
  return (
    <div className={`bottom__chat__itemWrapper__mymessages bottom__chat__itemWrapper bottomChatItemWrapper ${isOpen ? " openedItem" : "closeItemChat"}`}>
      <div className={`chatContent chat__content ${!isOpen && "closeItemChat"}`}>
          <div className="bottomChatHeader" >
            <div className="userInfo" onClick={(e) => toggleChat()}>
              <p>My Messages</p>
            </div>
            <div className="bottomChatHeader__closeIcon" onClick={closeChat}>
              <img src={CloseIcon} className="closeIcon chat__content_closeIcon"  />
            </div>
          </div>
          {
            isOpen
            &&
            <div className="chatContainer">
              <ChatList />
            </div>
          }
        </div>
    </div>
  );
};

export default MyMessages;
