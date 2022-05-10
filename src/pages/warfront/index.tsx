import React from "react";
import ChooseModeWarfrontSection from "../../components/ChooseModeWarfrontSection";
import {
  MODES,
  AI_PLAY_MODE,
  TREASURE_QUEST_MODES,
} from "../../constants/playModes";
import { connect } from "react-redux";
import { Actions as GameplayActions } from "../../store/gameplay/gameplay.action";
import { Actions as UserActions } from "../../store/user/user.action";
import { Actions as TreasureQuestActions } from "../../store/treasureHunt/treasureHunt.action";
import { navigate } from "gatsby";
import { IAppState } from "../../store/reducers";
import { IServerStatus } from "../../store/user/user.interfaces";

interface IActionProps {
  setPlayMode: typeof GameplayActions.setPlayMode;
  setPlayerColor: typeof GameplayActions.setPlayerColor;
  setChoseMode: typeof UserActions.setChoseMode;
  setGameStartDate: typeof GameplayActions.setGameStartDate;
  setTreasureQuestMode: typeof TreasureQuestActions.setTreasureQuestMode;
  setTreasureQuestGameStartDate: typeof TreasureQuestActions.setGameStartDate;
}

interface ISelectChooseModeProps {
  serverStatus: IServerStatus;
  choseMode: MODES;
}

const ChoseMode = (props: ISelectChooseModeProps & IActionProps) => {
  const { choseMode } = props;
  console.log("asdfadf", choseMode);

  return (
    <div className="choseModeContainer m-auto">
      {choseMode === MODES.CHOSE_MODE && (
        <ChooseModeWarfrontSection setMode={props.setChoseMode} />
      )}
    </div>
  );
};

const mapStateToProps = (state: IAppState) => ({
  serverStatus: state.user.serverStatus,
  choseMode: state.user.choseMode,
});

const connected = connect<ISelectChooseModeProps, IActionProps>(
  mapStateToProps as any,
  {
    setPlayMode: GameplayActions.setPlayMode,
    setPlayerColor: GameplayActions.setPlayerColor,
    setChoseMode: UserActions.setChoseMode,
    setGameStartDate: GameplayActions.setGameStartDate,
    setTreasureQuestMode: TreasureQuestActions.setTreasureQuestMode,
    setTreasureQuestGameStartDate: TreasureQuestActions.setGameStartDate,
  }
)(ChoseMode);

export default connected;
