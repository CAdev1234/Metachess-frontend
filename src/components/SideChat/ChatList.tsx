import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IAppState } from "../../store/reducers";
import UserItem from "./UserItem";
import { IChatItem, IChatListItem } from "../../store/chat/chat.interfaces";
import { chatActions } from "../../store/chat/chat.actions";
import { IUser } from "../../store/user/user.interfaces";

const ChatList = () => {
  const dispatch = useDispatch();
  const { chatOpened, chatList } = useSelector(
    (state: IAppState) => state.chat
  );
  if (chatList.length === 0)
    return <p style={{ color: "#fff" }}>No Chats To Show!</p>;
  return (
    <div className="chatList">
      {/* <div className="chatListItem "><p className="userInfo">+ Add friend</p></div> */}
      {(chatList || []).map((item: IChatListItem) => (
        <UserItem
          key={item.Account.Id}
          item={item}
          onClick={() => {
            // dispatch(
            //   chatActions.setActiveChat({
            //     friend: item.Account as IUser,
            //     unseenCount: item.unseenCount || 0,
            //     id: item.Account.Id,
            //   })
            // );
            dispatch(
              chatActions.fetchChat({
                friendId: item.Account.Id,
                friend: item.Account as IUser,
                startingAfter: 0,
              })
            );
          }}
        />
      ))}
    </div>
  );
};

export default ChatList;
