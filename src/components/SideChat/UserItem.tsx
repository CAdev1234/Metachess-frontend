import React from "react";
import SmallLogo from "../../assets/images/Subtracao_22.svg";

import UnseenNumber from "../BottomChat/UnseenNumber";
import { IChatItem, IChatListItem } from "../../store/chat/chat.interfaces";
import OnlineStatus from "./OnlineStatus";

interface Props {
  item: IChatListItem;
  onClick: () => void;
}

const UserItem = ({ item, onClick }: Props) => (
  <div className="chatListItem" onClick={onClick} style={{ cursor: "pointer" }}>
    <div
      className="userInfo"
      // onClick={onClick}
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "1vmax",
      }}
    >
      <img className="chatIcon" src={item.Account.Avatar || SmallLogo} />
      <p style={{ color: "#fff" }}>
        {item.Account.Username}
        <br />
        <span style={{ fontWeight: "lighter", fontSize: "12px" }}>
          {
            item.LastMessage.length > 30
            ?
            item.LastMessage.split("").slice(0, 34).join("") + '...'
            :
            item.LastMessage
          }
        </span>
      </p>
      {item.unseenCount ? <UnseenNumber number={item.unseenCount} /> : null}
    </div>
    {/* <OnlineStatus status={item.status} /> */}
    <hr style={{ margin: "1vmin 0" }} />
  </div>
);

export default UserItem;
