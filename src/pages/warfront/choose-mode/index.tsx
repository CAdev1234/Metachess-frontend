import React from "react";
import ChoseModeSection from "../../../components/ChoseModeSection";
import PlayWithAISection from "../../../components/PlayWithAISection";
import {
  MODES,
  AI_PLAY_MODE,
  TREASURE_QUEST_MODES,
} from "../../../constants/playModes";
import { connect } from "react-redux";
import { Actions as GameplayActions } from "../../../store/gameplay/gameplay.action";
import { Actions as UserActions } from "../../../store/user/user.action";
import { Actions as TreasureQuestActions } from "../../../store/treasureHunt/treasureHunt.action";
import { navigate } from "gatsby";
import PlayWithHumanSection from "../../../components/PlayWithHumanSection";
import ChoosePVEModeSection from "../../../components/ChoosePVEModeSection";
import ChoosePVPModeSection from "../../../components/ChoosePVPModeSection";
import PlayTournamentSection from "../../../components/PlayTournamentSection";
import TreasureQuestRulesSection from "../../../components/TreasureQuestRulesSection";
import { IAppState } from "../../../store/reducers";
import { IServerStatus } from "../../../store/user/user.interfaces";
import { GAME_MODES } from "../../../constants/playModes";

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
  const setAIPlayMode = (playMode: AI_PLAY_MODE) => {
    props.setPlayMode({
      isAI: true,
      isHumanVsHuman: false,
      aiMode: playMode,
    });
    props.setGameStartDate(new Date().getTime());
    //props.setPlayerColor(Math.random() >= 0.5 ? "b" : "w");
    props.setPlayerColor("w");
    navigate("/warfront/game");
  };

  const setTreasureQuestPlayMode = (playMode: TREASURE_QUEST_MODES) => {
    props.setTreasureQuestMode({
      treasureQuestMode: playMode,
    });
    props.setTreasureQuestGameStartDate(new Date().getTime());
    navigate("/treasurequest");
  };

  const onJoinRoom = (roomName: string) => {
    props.setPlayMode({
      isHumanVsHuman: true,
      roomName,
      isCreate: false,
    });
    navigate("/warfront/game");
  };
  const onGoBack = () => {
    props.setChoseMode(MODES.CHOSE_MODE);
  };

  const { choseMode } = props;
  console.log("choose", choseMode);
  return (
    <div className="choseModeContainer m-auto">
      {choseMode === MODES.CHOSE_MODE && (
        <ChoseModeSection setMode={props.setChoseMode} />
      )}
      {choseMode === MODES.PVE_MODE && (
        <ChoosePVEModeSection setMode={props.setChoseMode} />
      )}
      {choseMode === MODES.PVP_MODE && (
        <ChoosePVPModeSection setMode={props.setChoseMode} gameMode={GAME_MODES.WARFRONT}  />
      )}
      {choseMode === MODES.PLAY_TREASURE_QUEST && (
        <TreasureQuestRulesSection
          setTreasureMode={setTreasureQuestPlayMode}
          goBack={onGoBack}
        />
      )}
      {choseMode === MODES.PLAY_AI && (
        <PlayWithAISection setPlayMode={setAIPlayMode} gameMode={GAME_MODES.WARFRONT} goBack={onGoBack} />
      )}
      {choseMode === MODES.PLAY_WITH_HUMAN && (
        <PlayWithHumanSection goBack={onGoBack} onJoinRoom={onJoinRoom} gameMode={GAME_MODES.WARFRONT} />
      )}
      {choseMode === MODES.PLAY_TOURNAMENT && (
        <PlayTournamentSection onJoinRoom={onJoinRoom} />
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
