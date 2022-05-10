import { IMessage } from "../../components/ChessChat";
import { IUser } from "../user/user.interfaces";

export interface IChatReducer {
  chatOpened: boolean;
  activeChatOpened: boolean;
  myMessagesOpened: boolean;
  addFriendSearch: boolean;
  activeChat: IChatItem;
  chatList: IChatListItem[];
  friendsList: IFriend[];
  friendRequests: IFriend[];
}

export interface IChatListItem {
  Account: Partial<IUser>;
  LastMessage: string;
  LastMessageDate: number;
  unseenCount: number;
}

export interface IChatItem {
  id: number;
  // name: string;
  friend: IUser;
  unseenCount: number;
  messages?: IMessage[];
  status?: "online" | string;
}
export interface IFriend {
  Id: string;
  Account: IUser & {
    Fullname: string;
    IsOnline?: boolean;
    GameStatus?: number
  };
}
