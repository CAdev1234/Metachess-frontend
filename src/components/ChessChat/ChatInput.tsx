import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import sendIcon from "../../assets/images/send.png";
import SocketService from "../../services/socket.service";
import { chatActions } from "../../store/chat/chat.actions";
import { Actions } from "../../store/gameplay/gameplay.action";
import { IAppState } from "../../store/reducers";

const ChatInput = () => {
  const messageRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  // const currentUser = useSelector((state: IAppState) => state.user.currentUser);
  const { winner } = useSelector((state: IAppState) => state.gameplay);
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    const message = messageRef.current?.value;
    formRef.current?.reset();
    if (!message || winner) return;
    console.log(message);
    SocketService.sendData("game-message", message, (sent: boolean) => {
      if (!sent) {
        toast.error("Message Could Not Be Sent");
        return;
      }
      console.log(sent);
      dispatch(
        Actions.newMessage({
          date: new Date(),
          message,
          isFromOpponent: false,
        })
      );
    });
  };
  return (
    <form className="chatInputWrapper" onSubmit={handleSubmit} ref={formRef}>
      <input
        placeholder="type something..."
        className="chatInputInput"
        ref={messageRef}
      />
      <button className="emojiInput">
        <img src={sendIcon} alt="send icon" />
      </button>
    </form>
  );
};

export default ChatInput;
