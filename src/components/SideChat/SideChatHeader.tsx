import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IAppState } from "../../store/reducers";
import CloseIcon from "../../assets/images/close-icon-white.png";
import { chatActions } from "../../store/chat/chat.actions";
const SideChatHeader = () => {
  const dispatch = useDispatch();
  const { chatOpened, activeChat } = useSelector(
    (state: IAppState) => state.chat
  );
  return (
    <div
      className="sideChatHeaderWrapper"
      onClick={() => dispatch(chatActions.toggleSideChat())}
    >
      <p>FRIENDS</p>
      <img src={CloseIcon} />
    </div>
  );
};

export default SideChatHeader;
