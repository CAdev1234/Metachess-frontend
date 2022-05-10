import React, { useState } from "react";
import SquaredButton from "../SquaredButton";
import { MODES } from "../../constants/playModes";
import { IAppState } from "../../store/reducers";
import { Actions as UserActions } from "../../store/user/user.action";
import { connect } from "react-redux";
import {
  IServerStatus,
  MAINTENANCE_MODE,
} from "../../store/user/user.interfaces";
interface IProps {
  setMode: typeof UserActions.setChoseMode;
}

interface ISelectChooseModeSectionProps {
  serverStatus: IServerStatus;
}
const ChoseModeSection = (props: ISelectChooseModeSectionProps & IProps) => {
  // const isServerOnline =
  //   props.serverStatus.MaintenanceMode === MAINTENANCE_MODE.ONLINE;
  return (
    <div className={"choseModeSectionContainer"}>
      <div className={"headerWrapper"}>
        <p className="header-heading">CHOOSE A GAME MODE</p>
      </div>
      <div className={"squaredWrapper"}>
        <SquaredButton
          // className={!isServerOnline ? "no-cursor" : ""}
          onClick={() => {
            // if (props.serverStatus && isServerOnline) {
            return props.setMode(MODES.PVE_MODE);
            // }
          }}
          title="PLAYER VS ENVIRONMENT"
        >
          <div className={"bottomAlign multiple mb-25"}>
            <p className="header-heading-title">PVE</p>
          </div>
        </SquaredButton>
        <SquaredButton
          // className={!isServerOnline ? "no-cursor" : ""}
          onClick={() => {
            // if (props.serverStatus && isServerOnline) {
            return props.setMode(MODES.PVP_MODE);
            // }
          }}
          title="PLAYER VS PLAYER"
        >
          <div className={"bottomAlign multiple mb-25"}>
            <p className="header-heading-title">PVP</p>
          </div>
        </SquaredButton>
        {/* <SquaredButton
          onClick={() => props.setMode(MODES.PLAY_AI)}
          title="PLAY WITH AI"
        >
          <div className={"bottomAlign mb-25"}>
            <span className="d-flex pawn"></span>
          </div>
        </SquaredButton>
        <SquaredButton
          className={!isServerOnline ? "no-cursor" : ""}
          onClick={() => {
            if (props.serverStatus && isServerOnline) {
              return props.setMode(MODES.PLAY_WITH_HUMAN);
            }
          }}
          title="PLAY WITH HUMAN"
        >
          <div className={"bottomAlign multiple mb-25"}>
            <span className="d-flex user"></span>
            <span className="squaredButtonTitle mb-35">VS</span>
            <span className="d-flex user"></span>
          </div>
        </SquaredButton>
        <SquaredButton title="TOURNAMENT" className="tournamentSquad">
          <span className="d-flex pawn"></span>
          <span className="tLine-1"></span>
          <span className="d-flex user user-1"></span>
          <span className="tLine-2"></span>
          <span className="d-flex user user-2"></span>
          <span className="tLine-3"></span>
        </SquaredButton> */}
      </div>
    </div>
  );
};

const mapStateToProps = (state: IAppState) => ({
  serverStatus: state.user.serverStatus,
});

const connected = connect<ISelectChooseModeSectionProps>(
  mapStateToProps as any
)(ChoseModeSection);

export default connected;
