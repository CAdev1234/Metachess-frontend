import React from "react";
import moment from "moment";
import { IMessage } from "../ChessChat";
import { getOpponentName } from "../../helpers/getOpponentNameByPlayMode";
import SmallPieceIcon from "../../assets/images/Subtracao_22.svg";
interface Props {
  message: IMessage;
  isFromUser: boolean;
  firstRef: any;
  lastRef: any;
  showSender?: boolean;
}

const getMessageString:( (date:Date) => string) = (date) => {
  let dateNow = (new Date()).toLocaleString().split(',')[0] 
  let dayName = new Date(date).toDateString().split(' ')[0]
  let localString = (new Date(date)).toLocaleString() 
  let splits = localString.split(',')

  let day = splits[0] === dateNow ? 'Today' : dayName
  let time = splits[1].split(':').splice(0,2).join(':')
  let amOrPm = splits[1].includes('AM') ? 'AM' : 'PM'
  return `${day}, ${time}${amOrPm}`
}

const Message = ({
  message,
  isFromUser,
  firstRef,
  lastRef,
  showSender,
}: Props) => {
  // const timeOfMessageString = moment(message.Date).format("ddd, h:mm");
  return (
    <>
      {showSender && (
        <p
          style={{
            color: "#fff",
            fontSize: "12px",
            margin: "0",
            alignSelf: isFromUser ? "flex-end" : "flex-start",
            // overflow: "hidden",
            display: "flex",
            // flexDirection:"row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={message.Sender.Avatar || SmallPieceIcon}
            style={{ height: "20px", width: "20px", borderRadius: "50%" }}
          />{" "}
          {getOpponentName(false, null, message.Sender)}
        </p>
      )}
      <div
        className={`messageWrapper ${isFromUser ? "userMessageWrapper" : ""}`}
        ref={firstRef || lastRef}
      >
        <p className={`messageText ${isFromUser ? "userMessageText" : ""}`}>
          {message.Message}
        </p>
        <p className={`messageTime ${isFromUser ? "userMessageTime" : ""}`}>
          {getMessageString(message.Date)}
        </p>
      </div>
    </>
  );
};

export default Message;
