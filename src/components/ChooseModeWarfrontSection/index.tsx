import React, { useState } from "react";
import SquaredButton from "../SquaredButton";
import { MODES } from "../../constants/playModes";
import { IAppState } from "../../store/reducers";
import { Actions as UserActions } from "../../store/user/user.action";
import { navigate } from "gatsby";
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
const ChooseModeWarfrontSection = (props: ISelectChooseModeSectionProps & IProps) => {
  return (
    <div className={"choseModeSectionContainer"}>
      <div className={"headerWrapper"}>
        <p className="header-heading">CHOOSE A GAME MODE</p>
      </div>
      <div className={"squaredWrapper"}>
        <SquaredButton
          onClick={() => {
            props.setMode(MODES.PVE_MODE);
            navigate("/warfront/choose-mode");
          }}
          title="PLAYER VS ENVIRONMENT"
        >
          <div className={"bottomAlign multiple mb-25"}>
            <p className="header-heading-title">PVE</p>
          </div>
        </SquaredButton>
        <SquaredButton
          onClick={() => {
            props.setMode(MODES.PVP_MODE);
            navigate("/warfront/choose-mode");
          }}
          title="PLAYER VS PLAYER"
        >
          <div className={"bottomAlign multiple mb-25"}>
            <p className="header-heading-title">PVP</p>
          </div>
        </SquaredButton>
      </div>
    </div>
  );
};

const mapStateToProps = (state: IAppState) => ({
  serverStatus: state.user.serverStatus,
});

const connected = connect<ISelectChooseModeSectionProps>(
  mapStateToProps as any
)(ChooseModeWarfrontSection);

export default connected;
