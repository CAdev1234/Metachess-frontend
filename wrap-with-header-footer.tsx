import React from "react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatWrapper from "./src/components/ChatWrapper";
import FriendsSidebar from "./src/components/FriendsSidebar";
import Header from "./src/components/Header";
import MaintenanceModal from "./src/components/MaintenanceModal";
import PageBackground from "./src/components/PageBackground";
import SideChat from "./src/components/SideChat";
import ToastProvider from "./src/components/ToastProvider";
import { IAppState } from "./src/store/reducers";
import {
  IServerStatus,
  MAINTENANCE_MODE,
} from "./src/store/user/user.interfaces";

export default ({ element, props }: { element: JSX.Element; props: any }) => {
  console.log("url", props);
  return (
    <div
      className={` ${props.path.includes("/game") ? "no-scroll" : ""} ${
        props.path.includes("/warfront")
          ? "warFrontWrapperContainer"
          : "wrapContainer"
      }`}
    >
      <Header {...props} />
      <>
        <main className={"wrapPage"}>
          <ChatWrapper>
            <ToastProvider>{element}</ToastProvider>
          </ChatWrapper>
        </main>
        {/* <Footer {...props}  /> */}
        {/* <SideChat /> */}
        <FriendsSidebar />
        <PageBackground />
        <ToastContainer
          autoClose={3000}
          hideProgressBar
          closeOnClick
          rtl={false}
          draggable
          pauseOnHover
          theme="colored"
        />
        <MaintenanceModal showClose={true} />
      </>
    </div>
  );
};
