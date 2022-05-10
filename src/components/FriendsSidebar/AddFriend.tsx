import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { chatActions } from "../../store/chat/chat.actions";
import { IAppState } from "../../store/reducers";
import { Actions as userActions } from "../../store/user/user.action";
import AddFriendListItem from "./AddFriendListItem";
import AddFriendSearchInput from "./AddFriendSearchInput";

const AddFriend = (): JSX.Element => {
  const dispatch = useDispatch();
  const { searchedUsersList } = useSelector((state: IAppState) => state.user);
  const { currentUser } = useSelector((state: IAppState) => state.user);

  const [searchText, setSearchText] = useState("");
  const onSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchText(val);
    if (val) {
      dispatch(userActions.searchUsers(val));
    } else {
      userActions.setSearchedUserList([]);
    }
  };
  useEffect(() => {
    setSearchText("");
  }, []);
  return (
    <>
      <AddFriendSearchInput value={searchText} onChange={onSearchTextChange} />
      {searchedUsersList
      .filter((user) => user.Id !== currentUser.Id)
      .map((user) => (
        <AddFriendListItem item={user} key={user.Id} />
      ))}
    </>
  );
};

export default AddFriend;
