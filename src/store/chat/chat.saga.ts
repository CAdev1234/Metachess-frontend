import { all, call, put, select, takeLatest } from "redux-saga/effects";
import API from "../../services/api.service";
import { ENDPOINTS } from "../../services/endpoints";
import { ACTION_TYPE, chatActions } from "./chat.actions";
import { IChatItem, IChatListItem, IFriend } from "./chat.interfaces";
import { toast } from "react-toastify";
import { IMessage } from "../../components/ChessChat";
import { IAppState } from "../reducers";
import { IUser } from "../user/user.interfaces";

function* onFetchFriendsList() {
  try {
    const friendsList: IFriend[] = yield call(() =>
      API.execute("GET", ENDPOINTS.GET_FRIENDS)
    );
    yield put(chatActions.setFriendsList(friendsList));
  } catch (e) {
    yield put(chatActions.setFriendsList([]));
    console.log("err", e);
  }
}

function* onFetchFriendRequests() {
  try {
    const friendRequests: IFriend[] = yield call(() =>
      API.execute("GET", ENDPOINTS.GET_FRIEND_REQUESTS)
    );
    yield put(chatActions.setFriendsRequestsList(friendRequests));
  } catch (e) {
    yield put(chatActions.setFriendsRequestsList([]));
    console.log("err", e);
  }
}

function* onOpenMessages({ payload }: { payload: boolean }) {
  if (payload) {
    try {
      const chats: IChatListItem[] = yield call(() =>
        API.execute("GET", ENDPOINTS.GET_CHAT_HISTORY, null, [
          { name: "top", value: "10" },
        ])
      );
      const unreadMessages: {
        MessagesCount: number;
        Sender: Partial<IUser>;
      }[] = yield call(() => API.execute("GET", ENDPOINTS.GET_UNREAD_MESSAGES));
      // console.log(unreadMessages);
      const newChats: IChatListItem[] = chats.map((chat: IChatListItem) => {
        const inUnreadMessages = unreadMessages.find(
          (unreadChat: { MessagesCount: number; Sender: Partial<IUser> }) =>
            unreadChat.Sender.Id === chat.Account.Id
        );
        return inUnreadMessages
          ? { ...chat, unseenCount: inUnreadMessages.MessagesCount }
          : chat;
      });
      yield put(chatActions.setChatList(newChats));
    } catch (e) {
      console.log(e);
    }
  }
  yield put(chatActions.setMessagesOpened(payload));
}

function* onMessagesIconUpdate({ payload }: { payload: boolean }) {
  if (payload) {
    try {
      const chats: IChatListItem[] = yield call(() =>
        API.execute("GET", ENDPOINTS.GET_CHAT_HISTORY, null, [
          { name: "top", value: "10" },
        ])
      );
      const unreadMessages: {
        MessagesCount: number;
        Sender: Partial<IUser>;
      }[] = yield call(() => API.execute("GET", ENDPOINTS.GET_UNREAD_MESSAGES));
      // console.log(unreadMessages);
      const newChats: IChatListItem[] = chats.map((chat: IChatListItem) => {
        const inUnreadMessages = unreadMessages.find(
          (unreadChat: { MessagesCount: number; Sender: Partial<IUser> }) =>
            unreadChat.Sender.Id === chat.Account.Id
        );
        console.log("inUnreadMessages are ---> ",inUnreadMessages)

        return inUnreadMessages
          ? { ...chat, unseenCount: inUnreadMessages.MessagesCount }
          : chat;
      });
      yield put(chatActions.setChatList(newChats));
    } catch (e) {
      console.log(e);
    }
  }
}

function* onFetchChat({
  payload,
}: {
  payload: {
    friendId: number;
    top: number;
    // startingAfter: number;
    friend: IUser;
    open?: false;
  };
}) {
  try {
    const chatList: IChatListItem[] = yield select(
      (state) => state.chat.chatList
    );
    const query: IQuery[] = [
      { name: "friendId", value: `${payload.friendId}` },
      {
        name: "top",
        value: `25`,
      },
    ];
    const messages: IMessage[] = yield call(() =>
      API.execute("GET", ENDPOINTS.GET_CHAT, null, query)
    );
    yield call(() => {
      API.execute("POST", ENDPOINTS.SET_MESSAGES_READ, null, [
        { name: "friendId", value: `${payload.friendId}` },
      ]);
    });
    const unseenCount: number = 0;
    yield put(
      chatActions.setChatList(
        chatList.map((chat: IChatListItem) =>
          chat.Account.Id === payload.friendId ? { ...chat, unseenCount } : chat
        )
      )
    );
    yield put(
      chatActions.setActiveChat({
        id: payload.friendId,
        messages: messages.reverse(),
        unseenCount,
        friend: payload.friend,
      })
    );
    yield put(chatActions.toggleSideChat(false));
  } catch (e) {
    console.log("err", e);
  }
}

function* onFetchMessages() {
  try {
    const firstChat: IMessage = yield select(
      (state: IAppState) => state.chat.activeChat.messages[0]
    );
    const activeChat: IChatItem = yield select(
      (state: IAppState) => state.chat.activeChat
    );
    const query: IQuery[] = [
      { name: "friendId", value: `${activeChat.friend.Id}` },
      {
        name: "top",
        value: `25`,
      },
      {
        name: "startingAfter",
        value: `${firstChat.Id}`,
      },
    ];
    const messages: IMessage[] = yield call(() =>
      API.execute("GET", ENDPOINTS.GET_CHAT, null, query)
    );
    yield call(() => {
      API.execute("POST", ENDPOINTS.SET_MESSAGES_READ, null, [
        { name: "friendId", value: `${activeChat.friend.Id}` },
      ]);
    });
    // const unreadMessages: number = yield call(() => {
    //   API.execute("GET", ENDPOINTS.GET_UNREAD_MESSAGES, null, [
    //     { name: "friendId", value: `${payload.friendId}` },
    //   ]);
    // });
    yield put(
      chatActions.setActiveChat({
        ...activeChat,
        messages: [...messages.reverse(), ...activeChat.messages],
        unseenCount: 0,
      })
    );
    yield put(chatActions.toggleSideChat(false));
  } catch (e) {
    console.log("err", e);
  }
}

function* onNewMessage({ payload }: any) {
  const { chat: state } = (yield select()) as IAppState;
  try {
    const activeChatOpened = state.activeChatOpened;
    const currentChatId = parseInt(state.activeChat?.id);
    const currentChatReceivedMessage =
      currentChatId === parseInt(payload?.roomId);
    if (currentChatReceivedMessage) {
      console.log(activeChatOpened, currentChatId);
      console.log("recieved message current",state.activeChat?.unseenCount,activeChatOpened,state.activeChat?.unseenCount + (!activeChatOpened ? 1 : 0))
      yield put(
        chatActions.setActiveChat({
          ...state.activeChat,
          messages: [...state.activeChat?.messages, payload?.message],
          unseenCount:
            state.activeChat?.unseenCount + (!activeChatOpened ? 1 : 0),
        })
      );
      yield put(
        chatActions.setChatList(
          state.chatList.map((chat: IChatListItem) => {
            if (chat.Account.Id === currentChatId) {
              return {
                ...chat,
                LastMessage: payload?.message.Message,
                unseenCount: chat.unseenCount + (!activeChatOpened ? 1 : 0),
              };
            }
            return chat;
          })
        )
      );
    } else {
      console.log("recieved message current else",state.activeChat?.unseenCount,activeChatOpened,state.activeChat?.unseenCount + (!activeChatOpened ? 1 : 0))
      yield put(
        chatActions.setChatList(
          state.chatList.map((chat: IChatListItem) => {
            console.log("recieved message current else",chat.unseenCount)
            if (chat.Account.Id === payload?.roomId) {
              if(chat.unseenCount){
                return {
                  ...chat,
                  LastMessage: payload?.message.Message,
                  unseenCount: chat.unseenCount + 1,
                };
              }
              return {
                ...chat,
                LastMessage: payload?.message.Message,
                unseenCount:  1,
              };
            }
            return chat;
          })
        )
      );
    }
  } catch (e) {
    console.log("err", e);
  }
}

function* onSendFriendRequest(action: any) {
  try {
    yield call(() =>
      API.execute(
        "POST",
        ENDPOINTS.SEND_FRIEND_REQUEST,
        null,
        null,
        action.payload
      )
    );
    toast.success("Friend request sent successfully!");
  } catch (e: any) {
    let errorText = "";
    console.log("err", e);
    if (e.status == 400) {
      switch (e.data) {
        case 1:
          errorText = "You can't invite yourself";
        case 2:
          errorText = "User not found";
        case 3:
          errorText = "Already added as friend";
      }
    } else if (e.status == 406) {
      errorText = "Limit of friends exceeded (200)";
    } else if (e.status == 409) {
      errorText = "Friend request was already sent to that user!";
    } else {
      errorText = "Something went wrong, please try again!";
    }
    toast.error(errorText);
  }
}

function* onAcceptFriendRequest(action: any) {
  try {
    const res: string = yield call(() =>
      API.execute(
        "POST",
        ENDPOINTS.ACCEPT_FRIEND_REQUEST,
        null,
        null,
        action.payload
      )
    );
    yield all([
      put(chatActions.fetchFriendsList()),
      put(chatActions.fetchFriendsRequestsList()),
    ]);
    toast.success("Friend request accepted successfully!");
  } catch (e: any) {
    let errorText = "";
    if (e.status == 406) {
      errorText = "Limit of friends exceeded (200)";
    } else {
      errorText = "Something went wrong, please try again!";
    }
    toast.error(errorText);
  }
}

function* onRefuseFriendRequest(action: any) {
  try {
    const res: string = yield call(() =>
      API.execute(
        "POST",
        ENDPOINTS.REJECT_FRIEND_REQUEST,
        null,
        null,
        action.payload
      )
    );
    yield put(chatActions.fetchFriendsRequestsList());
    toast.success("Friend request rejected successfully!");
  } catch (e: any) {
    toast.error("Something went wrong, please try again!");
  }
}

function* onRemoveFriend(action: any) {
  try {
    const res: string = yield call(() =>
      API.execute("POST", ENDPOINTS.REMOVE_FRIEND, null, null, action.payload)
    );
    yield put(chatActions.fetchFriendsList());
  } catch (e: any) {
    toast.error("Something went wrong, please try again!");
  }
}

function* watchFetchFriendsList() {
  yield takeLatest(ACTION_TYPE.FETCH_FRIENDS_LIST as any, onFetchFriendsList);
}

function* watchSendFriendRequest() {
  yield takeLatest(
    ACTION_TYPE.SEND_FRIENDS_REQUESTS as any,
    onSendFriendRequest
  );
}

function* watchFetchfriendRequests() {
  yield takeLatest(
    ACTION_TYPE.FETCH_FRIENDS_REQUESTS as any,
    onFetchFriendRequests
  );
}

function* watchAcceptfriendRequest() {
  yield takeLatest(
    ACTION_TYPE.ACCEPT_FRIEND_REQUEST as any,
    onAcceptFriendRequest
  );
}

function* watchRefusefriendRequest() {
  yield takeLatest(
    ACTION_TYPE.REJECT_FRIEND_REQUEST as any,
    onRefuseFriendRequest
  );
}

function* watchFetchChat() {
  yield takeLatest(ACTION_TYPE.FETCH_CHAT as any, onFetchChat);
}

function* watchRemovefriend() {
  yield takeLatest(ACTION_TYPE.REMOVE_FRIEND as any, onRemoveFriend);
}

function* watchNewMessage() {
  yield takeLatest(ACTION_TYPE.NEW_MESSAGE as any, onNewMessage);
}

function* watchOpenMessages() {
  yield takeLatest(ACTION_TYPE.SET_CHAT_OPEN as any, onOpenMessages);
}

function* watchFetchMessages() {
  yield takeLatest(ACTION_TYPE.FETCH_MESSAGES as any, onFetchMessages);
}

function* watchMessagesIconUpdate() {
  yield takeLatest(ACTION_TYPE.UPDATE_MESSAGES_ICON as any, onMessagesIconUpdate);
}

export default [
  watchFetchFriendsList,
  watchFetchfriendRequests,
  watchSendFriendRequest,
  watchAcceptfriendRequest,
  watchRefusefriendRequest,
  watchRemovefriend,
  watchNewMessage,
  watchFetchChat,
  watchOpenMessages,
  watchFetchMessages,
  watchMessagesIconUpdate
];
