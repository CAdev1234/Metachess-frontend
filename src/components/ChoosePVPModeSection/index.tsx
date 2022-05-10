import React, { useRef, useState } from "react";
import SquaredButton from "../SquaredButton";
import { MODES } from "../../constants/playModes";
import { IAppState } from "../../store/reducers";
import { connect } from "react-redux";
import { Actions as UserActions } from "../../store/user/user.action";
import MaintenanceModal from "../MaintenanceModal";
import {
  IServerStatus,
  MAINTENANCE_MODE,
} from "../../store/user/user.interfaces";
interface IProps {
  setMode: typeof UserActions.setChoseMode;
  gameMode: String
}

interface ISelectChooseModeSectionProps {
  serverStatus: IServerStatus;
}
const ChoosePVPModeSection = (
  props: ISelectChooseModeSectionProps & IProps
) => {
  const tooltipRef1 = useRef<HTMLSpanElement>(null);
  const tooltipRef2 = useRef<HTMLSpanElement>(null);
  const path = window.location.href.includes("warfront");
  // const [userSeenMaintenance, setUserSeenMaintenance] = useState(true);
  return (
    <div className={"choseModeSectionContainer"}>
      {/* {!userSeenMaintenance &&
        props.serverStatus.Status !== MAINTENANCE_MODE.ONLINE && (
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
          onClick={() => {
            // setUserSeenMaintenance(false);
            
            if (
              props.serverStatus.MaintenanceMode === MAINTENANCE_MODE.ONLINE
            ) {
              //if(!path) return props.setMode(MODES.PLAY_WITH_HUMAN);
              return props.setMode(MODES.PLAY_WITH_HUMAN);
            }
          }}
          title="PLAY WITH HUMAN"
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
          <div className={"bottomAlign multiple mb-25"}>
            <span className="d-flex user user-2"></span>
            <span className="squaredButtonTitle mb-35">VS</span>
            <span className="d-flex user"></span>

            <span className="tooltiptext" ref={tooltipRef1}>
              {props.serverStatus.MaintenanceMode ===
              MAINTENANCE_MODE.NEW_GAMES_DISABLED
                ? "Gameplay is disabled due to server maintenance"
                : ""}
            </span>
          </div>
        </SquaredButton>
        {
            window.location.href.includes("warfront") ? (
              <SquaredButton
              onClick={() => {
                // setUserSeenMaintenance(false);
                if (
                  props.serverStatus.MaintenanceMode === MAINTENANCE_MODE.ONLINE
                ) {
                  //if(!path) return props.setMode(MODES.PLAY_TOURNAMENT);

                  return props.setMode(MODES.PLAY_TOURNAMENT);
                  
                }
              }}
              title="TOURNAMENT"
              className="tournamentSquad tooltip"
              onMouseEnter={() =>
                props.serverStatus.MaintenanceMode ===
                  MAINTENANCE_MODE.NEW_GAMES_DISABLED &&
                tooltipRef2.current.classList.add("visible")
              }
              onMouseLeave={() =>
                props.serverStatus.MaintenanceMode ===
                  MAINTENANCE_MODE.NEW_GAMES_DISABLED &&
                tooltipRef2.current.classList.remove("visible")
              }
            >
              <div className={"bottomAlign multiple mb-25"}>
                <span className="humanTournament"></span>
      
                <span className="tooltiptext" ref={tooltipRef2}>
                  {props.serverStatus.MaintenanceMode ===
                  MAINTENANCE_MODE.NEW_GAMES_DISABLED
                    ? "Gameplay is disabled due to server maintenance"
                    : ""}
                </span>
              </div>
              
            </SquaredButton>
            ) : (
              <SquaredButton
              onClick={() => {
                // setUserSeenMaintenance(false);
                if (
                  props.serverStatus.MaintenanceMode === MAINTENANCE_MODE.ONLINE
                ) {
                  return props.setMode(MODES.PLAY_TOURNAMENT);
                }
              }}
              title="TOURNAMENT"
              className="tournamentSquad tooltip"
              onMouseEnter={() =>
                props.serverStatus.MaintenanceMode ===
                  MAINTENANCE_MODE.NEW_GAMES_DISABLED &&
                tooltipRef2.current.classList.add("visible")
              }
              onMouseLeave={() =>
                props.serverStatus.MaintenanceMode ===
                  MAINTENANCE_MODE.NEW_GAMES_DISABLED &&
                tooltipRef2.current.classList.remove("visible")
              }
            >
              <span className="d-flex pawn"></span>
              <span className="tLine-1"></span>
              <span className="d-flex user user-1"></span>
              <span className="tLine-2"></span>
              <span className="d-flex user user-2"></span>
              <span className="tLine-3"></span>
    
              <span className="tooltiptext" ref={tooltipRef2}>
                {props.serverStatus.MaintenanceMode ===
                MAINTENANCE_MODE.NEW_GAMES_DISABLED
                  ? "Gameplay is disabled due to server maintenance"
                  : ""}
              </span>
            </SquaredButton>
            )
        }
      </div>
    </div>
  );
};

const mapStateToProps = (state: IAppState) => ({
  serverStatus: state.user.serverStatus,
});

const connected = connect<ISelectChooseModeSectionProps>(
  mapStateToProps as any
)(ChoosePVPModeSection);

export default connected;
