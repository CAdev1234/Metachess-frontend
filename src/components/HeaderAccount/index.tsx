import React , { useState , useEffect , useRef } from "react";
import { Link } from "gatsby";
import { IAppState } from "../../store/reducers";
import { connect, useDispatch , useSelector } from "react-redux";
import {
  IServerStatus,
  IUser,
  MAINTENANCE_MODE,
} from "../../store/user/user.interfaces";
import { getOpponentName } from "../../helpers/getOpponentNameByPlayMode";
import { chatActions } from "../../store/chat/chat.actions";
import { HeaderNavigatorItem } from "../Header";
import SearchIcon from "../../lib/svgIcons/SearchIcon";
import FriendsIcon from "../../lib/svgIcons/FriendsIcon";
import BellIcon from "../../lib/svgIcons/BellIcon";
import SmallPieceIcon from "../../assets/images/Subtracao_22.svg";
import ChatIcon from "../../lib/svgIcons/ChatIcon";
import warningIcon from "../../assets/images/warning.png";
import { MAIN_WEBSITE } from "../../config";
import MaintenancePage from "./MaintenancePage";
import TOKEN from "../../services/token.service";
import { IChatItem, IChatListItem } from "../../store/chat/chat.interfaces";
import ChatList from "../SideChat/ChatList";
// import SocketService from "../../services/socket.service";
  
interface ISelectProps {
  currentUser: IUser;
  serverStatus: IServerStatus;
}

const HeaderAccount = (props: ISelectProps) => {
  const dispatch = useDispatch();
  const { friendRequests } = useSelector((state: IAppState) => state.chat);
  const msgNumber = useSelector(
    (state: IAppState) => {
      let unseenMessages = 0
      if(state?.chat.chatList?.length) unseenMessages = state.chat.chatList?.map( (element: IChatListItem) => element.unseenCount ? element.unseenCount : 0 )?.reduce((a: number , b: number) => (a + b))
      if(!unseenMessages) return 0
      return unseenMessages
    }
  );
  // const initialized = useRef<boolean>(false);

  // const initialize = () => {
  //   initialized.current = true;
  //   SocketService.subscribeTo({
  //     eventName: "friend-request",
  //     callback: (e) => console.log('friend-request received',e)
  //   });
  //   SocketService.subscribeTo({
  //     eventName: "friend-added",
  //     callback: (e) => console.log('friend-request received',e)
  //   });
  // };

  // if (!initialized.current) initialize();
  
  useEffect(() => {
    dispatch(chatActions.fetchFriendsRequestsList());
    dispatch(chatActions.updateMessagesIcon(true))
   
  }, []);
 
  const openSideChatPanel = () => {
    dispatch(chatActions.toggleSideChat());
  };
  const openBottomMessages = () => {
    dispatch(chatActions.setChatOpen(true));
  };


  return (
    <div className="headerNavigatorContainer flex-end">
      {props.currentUser && props.currentUser.Username ? (
        <>
          {props.serverStatus.MaintenanceMode ===
            MAINTENANCE_MODE.NEW_GAMES_DISABLED ||
          (props.serverStatus.MaintenanceMode === MAINTENANCE_MODE.ONLINE &&
            props.serverStatus.MaintenanceTime &&
            props.serverStatus.MaintenanceDuration) ? (
            <MaintenanceInfo />
          ) : null}
          {/* <SearchIcon className="nav-icon" /> */}
          <ChatIcon number={msgNumber} className="nav-icon" onClick={openBottomMessages} />
          <FriendsIcon number={friendRequests?.length} className="nav-icon" onClick={openSideChatPanel} />
          {/* <img
            className="nav-icon"
            src={SmallPieceIcon}
            onClick={openBottomMessages}
          /> */}
          <Link to={"/profile"} className="headerAccountContainer">
            <span style={{ overflow: "hidden" }}>
              <img src={props.currentUser?.Avatar || SmallPieceIcon} />
            </span>

            <p className="headerNavigatorAccountTitle">
              {props.currentUser
                ? getOpponentName(false, null, props.currentUser)
                : ""}
            </p>
          </Link>
          <a
            className={`headerNavigatorItem `}
            style={{ marginLeft: "24px" }}
            onClick={() => {
              TOKEN.remove();
              window.location.reload();
            }}
          >
            <p className={`headerNavigatorItemTitle `}>Logout</p>
            {/* <div
        className={`headerActiveIndicator ${
          active ? "headerActiveIndicatorActive" : ""
        }`}
      /> */}
          </a>
        </>
      ) : (
        <>
          <div className="headerNavigatorContainer flex-end">
            {props.serverStatus.MaintenanceMode ===
              MAINTENANCE_MODE.NEW_GAMES_DISABLED ||
            (props.serverStatus.MaintenanceMode === MAINTENANCE_MODE.ONLINE &&
              props.serverStatus.MaintenanceTime &&
              props.serverStatus.MaintenanceDuration) ? (
              <MaintenanceInfo />
            ) : null}
            {/* <SearchIcon className="nav-icon mr-50" /> */}
            <HeaderNavigatorItem
              className="pr-50"
              url={`${MAIN_WEBSITE}login?r=game`}
              title="LOGIN"
            />
            <HeaderNavigatorItem
              url={`${MAIN_WEBSITE}signup?r=game`}
              title="SIGNUP"
            />
          </div>
        </>
      )}
    </div>
  );
};

const MaintenanceInfo = () => {
  return (
    <div className="maintenance-info">
      {/* <BellIcon className="nav-icon tooltip-info-icon" /> */}
      <img
        src={warningIcon}
        alt="warning"
        className="nav-icon tooltip-info-icon"
        style={{ height: "5vmin", width: "auto" }}
      />
      <div className="tooltip">
        <span className="tooltip-header"></span>
        <MaintenancePage />
      </div>
    </div>
  );
};

const mapStateToProps = (state: IAppState): ISelectProps => ({
  currentUser: state.user.currentUser,
  serverStatus: state.user.serverStatus,
});

const enhance = connect(mapStateToProps);

export default enhance(HeaderAccount);
