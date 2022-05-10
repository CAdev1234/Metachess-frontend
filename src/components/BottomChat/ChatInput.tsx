import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import sendIcon from "../../assets/images/send.png";
import SocketService from "../../services/socket.service";
import { chatActions } from "../../store/chat/chat.actions";
import { IAppState } from "../../store/reducers";

const ChatInput = ({ accountId }: { accountId: number }) => {
  const messageRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const currentUser = useSelector((state: IAppState) => state.user.currentUser);
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    const message = messageRef.current?.value;
    if (!message) return;
    console.log(message);
    SocketService.sendData(
      "message",
      { message, accountId },
      (sent: boolean) => {
        if (!sent) {
          toast.error("Message Could Not Be Sent");
          return;
        }
        // console.log(sent);
        dispatch(
          chatActions.newMessage({
            roomId: accountId,
            message: {
              Date: new Date(),
              Sender: currentUser,
              Message: message,
            },
          })
        );
      }
    );
    formRef.current?.reset();
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
