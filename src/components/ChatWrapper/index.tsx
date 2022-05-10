import React from "react";
import { useSelector } from "react-redux";
import { IAppState } from "../../store/reducers";
import BottomChat from "../BottomChat";
import MyMessages from "../MyMessages";
import SideChat from "../SideChat";
const ChatWrapper = ({ children }: { children: any }) => {
  return (
    <>
      {children}
      <BottomChat />
      {/* <SideChat /> */}
    </>
  );
};

export default ChatWrapper;
