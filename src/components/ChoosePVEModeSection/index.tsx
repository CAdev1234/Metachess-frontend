import React, { useRef, useState, MouseEvent } from "react";
import SquaredButton from "../SquaredButton";
import { MODES } from "../../constants/playModes";
import { IAppState } from "../../store/reducers";
import { connect } from "react-redux";
import MaintenanceModal from "../MaintenanceModal";
import { Actions as UserActions } from "../../store/user/user.action";
import {
  IServerStatus,
  IUser,
  MAINTENANCE_MODE,
} from "../../store/user/user.interfaces";
import moment from "moment";
interface IProps {
  setMode: typeof UserActions.setChoseMode;
}

interface ISelectChooseModeSectionProps {
  serverStatus: IServerStatus;
  user: IUser;
  todayAttempts: number;
}
const ChoosePVEModeSection = (
  props: ISelectChooseModeSectionProps & IProps
) => {
  // const [userSeenMaintenance, setUserSeenMaintenance] = useState(true);
  const tooltipRef1 = useRef<HTMLSpanElement>(null);
  const tooltipRef2 = useRef<HTMLSpanElement>(null);
  const path = window.location.href.includes("warfront");
  console.log("props", path)
  return (
    <div className={"choseModeSectionContainer"}>
      {/* {!userSeenMaintenance &&
        props.serverStatus.Status !== MAINTENANCE_MODE.NEW_GAMES_DISABLED && (
          <MaintenanceModal
            setUserSeen={() => {
              setUserSeenMaintenance(true);
            }}
          />
        )} */}
      <div className={"headerWrapper"}>
        <p className="header-heading">CHOOSE A GAME MODE</p>
      </div>
      <div className={"squaredWrapper"}>
        <SquaredButton
          onClick={() =>
          // !path && (
            props.serverStatus.MaintenanceMode === MAINTENANCE_MODE.ONLINE &&
            props.setMode(MODES.PLAY_AI)
            //)
          }
          title="Play With AI"
          className="tooltip"
          onMouseEnter={() =>
            props.serverStatus.MaintenanceMode ===
              MAINTENANCE_MODE.NEW_GAMES_DISABLED &&
            tooltipRef1.current.classList.add("visible")
          }
          onMouseLeave={() =>
            props.serverStatus.MaintenanceMode ===
              MAINTENANCE_MODE.NEW_GAMES_DISABLED &&
            tooltipRef1.current.classList.remove("visible")
          }
        >
          <div className={"bottomAlign mb-25 mb-0"}>
            <span className="d-flex pawn"></span>
            <span className="squaredButtonTitle mb-35">VS</span>
            <span className="d-flex user"></span>

            <span className="tooltiptext" ref={tooltipRef1}>
               <p style={{ textTransform: "capitalize" }}>
                The scheduled maintenance would start in approximately 30 minutes, we
                have temporarily disabled gameplay until the maintenance is complete.
              </p>
            </span>
          </div>
        </SquaredButton>
        <SquaredButton
          onClick={() => {
            if (
              props.user &&
              props.user.Username &&
              props.todayAttempts &&
              props.serverStatus.MaintenanceMode === MAINTENANCE_MODE.ONLINE
            ) {
              console.log("hello")
              props.setMode(MODES.PLAY_TREASURE_QUEST);
            }
          }}
          title="Treasure Quest"
          className="tooltip"
          onMouseEnter={() =>
            (!props.user ||
              !props.user.Username ||
              !props.todayAttempts ||
              props.serverStatus.MaintenanceMode ===
                MAINTENANCE_MODE.NEW_GAMES_DISABLED) &&
            tooltipRef2.current.classList.add("visible")
          }
          onMouseLeave={() =>
            // (!props.user ||
            //   !props.user.Username ||
            //   !props.todayAttempts ||
            //   props.serverStatus.MaintenanceMode ===
            //     MAINTENANCE_MODE.NEW_GAMES_DISABLED) &&
            tooltipRef2.current.classList.remove("visible")
          }
        >
          <div className={"bottomAlign mb-25 mb-0"}>
            <span className="d-flex chest"></span>
            <span className="d-flex user user-1"></span>

            <span className="tooltiptext" ref={tooltipRef2}>
              {props.serverStatus.MaintenanceMode ===
                MAINTENANCE_MODE.NEW_GAMES_DISABLED ?<p style={{ textTransform: "capitalize" }}>
                The scheduled maintenance would start in approximately 30 minutes, we
                have temporarily disabled gameplay until the maintenance is complete.
              </p> : props.user.GuestId ? (
                <p>Guests are not allowed to play this mode</p>
              ):<p style={{ textTransform: "capitalize" }}>You have exceeded the number of attempts for today</p>
                }
            </span>
          </div>
        </SquaredButton>
      </div>
    </div>
  );
};

const mapStateToProps = (state: IAppState) => ({
  serverStatus: state.user.serverStatus,
  user: state.user.currentUser,
  todayAttempts: state.treasureHunt.playAttemptsRemaining,
});

const connected = connect<ISelectChooseModeSectionProps>(
  mapStateToProps as any
)(ChoosePVEModeSection);

export default connected;
