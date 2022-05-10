import { Action } from "../generators";
import { ACTION_TYPE } from "./chat.actions";
import { IChatItem, IChatReducer } from "./chat.interfaces";

const INITIAL_STATE: IChatReducer = {
  chatOpened: false,
  addFriendSearch: false,
  friendRequests: [],
  activeChat: null,
  chatList: [
    // {
    //   id: 1,
    //   friend: { Username: "John Doe" },
    //   unseenCount: 2,
    //   messages: [
    //     {
    //       Id: 0,
    //       Message: "What a nice move you made there!!",
    //       Date: new Date(),
    //       Sender: null,
    //     },
    //     {
    //       Id: 1,
    //       Sender: null,
    //       Message: "Hehe thanks!",
    //       Date: new Date(),
    //     },
    //     {
    //       Id: 1,
    //       Sender: null,
    //       Message: "Hehe thanks!",
    //       Date: new Date(),
    //     },
    //     {
    //       Id: 1,
    //       Sender: null,
    //       Message: "Hehe thanks!",
    //       Date: new Date(),
    //     },
    //   ],
    // },
  ],
  // chatList: [],
  friendsList: [],
  activeChatOpened: true,
  myMessagesOpened: false,
};

export default (
  state: IChatReducer = INITIAL_STATE,
  action: Action
): IChatReducer => {
  return {
    ...state,
    ...{
      [action.type]: {},
      [ACTION_TYPE.TOGGLE_SIDE_CHAT]: {
        chatOpened:
          action.payload === false
            ? action.payload
            : action.payload
            ? action.payload
            : !state.chatOpened,
        addFriendSearch: state.chatOpened ? false : state.addFriendSearch,
      },
      [ACTION_TYPE.SET_ACTIVE_CHAT]: {
        activeChat: action.payload,
      },
      [ACTION_TYPE.SET_CHAT_LIST]: {
        chatList: action.payload,
      },
      // [ACTION_TYPE.NEW_MESSAGE]: {
      //   activeChat: state.activeChat
      //     ? state.activeChat.id === action.payload?.roomId
      //       ? {
      //           ...state.activeChat,
      //           messages: [
      //             ...state.activeChat?.messages,
      //             action.payload?.message,
      //           ],
      //         }
      //       : state.activeChat
      //     : null,
      //   chatList: state.chatList.map((chat: IChatItem) => {
      //     if (chat.id === action.payload?.roomId) {
      //       return {
      //         ...chat,
      //         messages: [...chat.messages, action.payload?.message],
      //         unseenCount:
      //           chat.unseenCount + state.activeChat.id ===
      //           action.payload?.roomId
      //             ? 1
      //             : 0,
      //       };
      //     }
      //     return chat;
      //   }),
      // },
      // [ACTION_TYPE.SET_UNREAD]: {
      //   activeChats: {},
      // },
      // [ACTION_TYPE.NEW_MESSAGE]: (() => {

      // })(),
      [ACTION_TYPE.TOGGLE_ADD_FRIEND_SEARCH]: {
        addFriendSearch: action.payload,
      },
      [ACTION_TYPE.SET_FRIENDS_LIST]: {
        friendsList: action.payload,
      },
      [ACTION_TYPE.ADD_FRIEND]: {
        friendsList: [action.payload, ...state.friendsList],
      },
      [ACTION_TYPE.SET_FRIENDS_REQUESTS]: {
        friendRequests: action.payload,
      },
      [ACTION_TYPE.SET_MESSAGES_OPENED]: {
        myMessagesOpened: action.payload,
      },
      [ACTION_TYPE.SET_ACTIVE_CHAT_OPEN]: {
        activeChatOpened: action.payload,
        activeChat: state.activeChat
          ? {
              ...state.activeChat,
              unseenCount: action.payload ? 0 : state.activeChat?.unseenCount,
            }
          : null,
      },
      [ACTION_TYPE.ADD_FRIEND_REQUEST]: {
        friendRequests: [action.payload, ...state.friendRequests],
      },
    }[action.type],
  };
};
