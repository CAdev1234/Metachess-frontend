import { IMessage } from "../../components/ChessChat";
import { createAction } from "../generators";
import { IUser } from "../user/user.interfaces";
import { IChatItem, IChatListItem, IFriend } from "./chat.interfaces";

export enum ACTION_TYPE {
  "TOGGLE_SIDE_CHAT" = "CHAT_TOGGLE_SIDE_CHAT",
  "TOGGLE_ADD_FRIEND_SEARCH" = "CHAT_TOGGLE_ADD_FRIEND",

  "FETCH_FRIENDS_LIST" = "CHAT_FETCH_FRIENDS_LIST",
  "SET_FRIENDS_LIST" = "CHAT_SET_FRIENDS_LIST",
  "FETCH_FRIENDS_REQUESTS" = "CHAT_FETCH_FRIENDS_REQUESTS",
  "SET_FRIENDS_REQUESTS" = "CHAT_SET_FRIENDS_REQUESTS",
  "SET_CHAT_OPEN" = "CHAT_SET_CHAT_OPEN",
  "SET_MESSAGES_OPENED" = "CHAT_SET_MESSAGES_OPENED",
  "ADD_FRIEND_REQUEST" = "CHAT_ADD_FRIEND_REQUEST",
  "SEND_FRIENDS_REQUESTS" = "CHAT_SEND_FRIENDS_REQUESTS",
  "ACCEPT_FRIEND_REQUEST" = "CHAT_ACCEPT_FRIEND_REQUEST",
  "REJECT_FRIEND_REQUEST" = "CHAT_REJECT_FRIEND_REQUEST",
  "ADD_FRIEND" = "CHAT_ADD_FRIEND",
  "REMOVE_FRIEND" = "CHAT_REMOVE_FRIEND",
  "SET_ACTIVE_CHAT" = "CHAT_SET_ACTIVE_CHAT",
  "SET_ACTIVE_CHAT_OPEN" = "CHAT_SET_ACTIVE_CHAT_OPEN",
  "NEW_MESSAGE" = "CHAT_NEW_MESSAGE",
  "FETCH_CHAT" = "CHAT_FETCH_CHAT",
  "SET_CHAT_LIST" = "CHAT_SET_CHAT_LIST",
  "FETCH_MESSAGES" = "CHAT_FETCH_MESSAGES",
  // "SET_MESSAGES" = "CHAT_SET_MESSAGES",
  "UPDATE_ACTIVE_CHAT_UNREAD" = "CHAT_UPDATE_ACTIVE_CHAT_UNREAD",
  "UPDATE_MESSAGES_ICON" = "UPDATE_MESSAGES_ICON"
}

export const chatActions = {
  toggleSideChat: createAction<boolean>(ACTION_TYPE.TOGGLE_SIDE_CHAT),
  toggleAddFriendSearch: createAction<boolean>(
    ACTION_TYPE.TOGGLE_ADD_FRIEND_SEARCH
  ),
  fetchMessages: createAction<{
    // friendId: number;
    // friend: IUser;
    // top?: number;
    // startingAfter?: number;
  }>(ACTION_TYPE.FETCH_MESSAGES),
  fetchFriendsList: createAction<any>(ACTION_TYPE.FETCH_FRIENDS_LIST),
  setFriendsList: createAction<IFriend[]>(ACTION_TYPE.SET_FRIENDS_LIST),

  fetchFriendsRequestsList: createAction<any>(
    ACTION_TYPE.FETCH_FRIENDS_REQUESTS
  ),
  setFriendsRequestsList: createAction<IFriend[]>(
    ACTION_TYPE.SET_FRIENDS_REQUESTS
  ),
  addFriendRequest: createAction<IFriend>(ACTION_TYPE.ADD_FRIEND_REQUEST),
  sendFriendsRequests: createAction<any>(ACTION_TYPE.SEND_FRIENDS_REQUESTS),
  setChatList: createAction<IChatListItem[]>(ACTION_TYPE.SET_CHAT_LIST),
  acceptFriendsRequest: createAction<any>(ACTION_TYPE.ACCEPT_FRIEND_REQUEST),
  refuseFriendsRequest: createAction<any>(ACTION_TYPE.REJECT_FRIEND_REQUEST),
  addFriend: createAction<IFriend>(ACTION_TYPE.ADD_FRIEND),
  setActiveChat: createAction<IChatItem>(ACTION_TYPE.SET_ACTIVE_CHAT),
  setActiveChatOpen: createAction<boolean>(ACTION_TYPE.SET_ACTIVE_CHAT_OPEN),
  setChatOpen: createAction<boolean>(ACTION_TYPE.SET_CHAT_OPEN),
  setMessagesOpened: createAction<boolean>(ACTION_TYPE.SET_MESSAGES_OPENED),
  fetchChat: createAction<{
    friendId: number;
    friend: IUser;
    top?: number;
    startingAfter?: number;
  }>(ACTION_TYPE.FETCH_CHAT),
  removeFriend: createAction<any>(ACTION_TYPE.REMOVE_FRIEND),
  updateUnreadMessages: createAction<{ id: number; unread: number }>(
    ACTION_TYPE.UPDATE_ACTIVE_CHAT_UNREAD
  ),
  newMessage: createAction<{ roomId: number; message: IMessage }>(
    ACTION_TYPE.NEW_MESSAGE
  ),
  updateMessagesIcon: createAction<any>(ACTION_TYPE.UPDATE_MESSAGES_ICON),
};
