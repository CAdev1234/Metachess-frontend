import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import sendIcon from "../../assets/images/send.png";
import SocketService from "../../services/socket.service";
import { chatActions } from "../../store/chat/chat.actions";
import { Actions } from "../../store/spectate/spectate.action";
import { IAppState } from "../../store/reducers";

const ChatInput = () => {
  const messageRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const currentUser = useSelector((state: IAppState) => state.user.currentUser);
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    const message = messageRef.current?.value;
    if (!message || currentUser.GuestId) return;
    console.log(message);
    SocketService.sendData(
      "game-spectator-message",
      message,
      (sent: boolean) => {
        if (!sent) {
          toast.error("Message Could Not Be Sent");
          return;
        }
        console.log(sent);
        dispatch(
          Actions.newMessage({
            date: new Date(),
            message,
            sender: currentUser,
            isNotification: false,
          })
        );
      }
    );
    formRef.current?.reset();
  };
  return (
    <form className="chatInputWrapper" onSubmit={handleSubmit} ref={formRef}>
      {currentUser.GuestId ? (
        <div
          className="chatInputInput"
          style={{ background: "#777", color: "#eee" }}
        >
          Guests Cannot Send Messages
        </div>
      ) : (
        <input
          placeholder="type something..."
          className="chatInputInput"
          ref={messageRef}
        />
      )}
      <button className="emojiInput">
        <img src={sendIcon} alt="send icon" />
      </button>
    </form>
  );
};

export default ChatInput;
