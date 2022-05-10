import React from "react";
import SquaredButton from "../SquaredButton";
import { AI_PLAY_MODE } from "../../constants/playModes";
import { useSelector } from "react-redux";
import { IAppState } from "../../store/reducers";
import lock from "../../assets/images/lock.png";

import "./warfront.scss";
interface IProps {
  setPlayMode: (p: AI_PLAY_MODE) => void;
  goBack: () => void;
}

const LockOverlay = ({
  level,
  children,
}: {
  level: number;
  children: JSX.Element;
}) => {
  const { HighestAIGameLevelWon }: { HighestAIGameLevelWon: number } =
    useSelector((state: IAppState) => state.user.currentUser);
  if (level <= HighestAIGameLevelWon + 1) return children;
  return (
    <div className="black-level-overlay">
      <div className="lock-image"></div>
      {children}
    </div>
  );
};

const PlayWithAISection = (props: IProps) => {
  const { HighestAIGameLevelWon }: { HighestAIGameLevelWon: number } =
    useSelector((state: IAppState) => state.user.currentUser);
  return (
    <div className={"playWithAISectionContainer"}>
      <div className={"backToSelection"}>
        <p
          className={"normal"}
          onClick={props.goBack}
        >{`< Choose a game mode`}</p>
      </div>
      <div className={"headerWrapper"}>
        <p className="header-heading">CHOOSE AI DIFFICULTY</p>
      </div>
      <div className={"squaredWrapper"}>
        <SquaredButton
          className={"noMargin"}
          onClick={() => {
            if (HighestAIGameLevelWon + 1 >= 1)
              props.setPlayMode(AI_PLAY_MODE.BEGINNER);
          }}
          title="BEGINNER"
        >
          <LockOverlay level={1}>
            <div className="bottomAlign">
              <span className="d-flex beginner"></span>
            </div>
          </LockOverlay>
        </SquaredButton>
        <SquaredButton
          className={"noMargin"}
          onClick={() => {
            if (HighestAIGameLevelWon + 1 >= 2)
              props.setPlayMode(AI_PLAY_MODE.ROOKIE);
          }}
          title="ROOKIE"
        >
          <LockOverlay level={2}>
            <div className="bottomAlign">
              <span className="d-flex horse"></span>
            </div>
          </LockOverlay>
        </SquaredButton>

        <SquaredButton
          onClick={() => {
            if (HighestAIGameLevelWon + 1 >= 3)
              props.setPlayMode(AI_PLAY_MODE.AMATEUR);
          }}
          title="AMATEUR"
        >
          <LockOverlay level={3}>
            <div className="bottomAlign">
              <span className="d-flex bishop"></span>
            </div>
          </LockOverlay>
        </SquaredButton>

        <SquaredButton
          className={"noMargin"}
          onClick={() => {
            if (HighestAIGameLevelWon + 1 >= 4)
              props.setPlayMode(AI_PLAY_MODE.INTERMEDIATE);
          }}
          title="INTERMEDIATE"
        >
          <LockOverlay level={4}>
            <div className="bottomAlign">
              <span className="d-flex rook"></span>
            </div>
          </LockOverlay>
        </SquaredButton>
      </div>
      <div className={"squaredWrapper"}>
        <SquaredButton
          className={"noMargin"}
          onClick={() => {
            if (HighestAIGameLevelWon + 1 >= 5)
              props.setPlayMode(AI_PLAY_MODE.PROFESSIONAL);
          }}
          title="PROFESSIONAL"
        >
          <LockOverlay level={5}>
            <div className="bottomAlign">
              <span className="d-flex king"></span>
            </div>
          </LockOverlay>
        </SquaredButton>

        <SquaredButton
          className={"noMargin"}
          onClick={() => {
            if (HighestAIGameLevelWon + 1 >= 6)
              props.setPlayMode(AI_PLAY_MODE.WORLD_CLASS);
          }}
          title="WORLD CLASS"
        >
          <LockOverlay level={6}>
            <div className="bottomAlign">
              <span className="d-flex queen"></span>
            </div>
          </LockOverlay>
        </SquaredButton>
        <SquaredButton
          className={"noMargin"}
          onClick={() => {
            if (HighestAIGameLevelWon + 1 >= 7)
              props.setPlayMode(AI_PLAY_MODE.MASTER);
          }}
          title="MASTER"
        >
          <LockOverlay level={7}>
            <div className="bottomAlign">
              <span className="d-flex master"></span>
            </div>
          </LockOverlay>
        </SquaredButton>
        <SquaredButton
          className={"noMargin"}
          onClick={() => {
            if (HighestAIGameLevelWon + 1 >= 8)
              props.setPlayMode(AI_PLAY_MODE.GRAND_MASTER);
          }}
          title="GRAND MASTER"
        >
          <LockOverlay level={8}>
            <div className="bottomAlign">
              <span className="d-flex grand-master"></span>
            </div>
          </LockOverlay>
        </SquaredButton>
      </div>
      <div className={"squaredWrapper"}>
        <SquaredButton
          className={"noMargin"}
          onClick={() => {
            if (HighestAIGameLevelWon + 1 >= 9)
              props.setPlayMode(AI_PLAY_MODE.LEGEND);
          }}
          title="LEGEND"
        >
          <LockOverlay level={9}>
            <div className="bottomAlign">
              <span className="d-flex legend"></span>
            </div>
          </LockOverlay>
        </SquaredButton>
        <SquaredButton
          className={"noMargin"}
          onClick={() => {
            if (HighestAIGameLevelWon + 1 >= 10)
              props.setPlayMode(AI_PLAY_MODE.IMMORTAL);
          }}
          title="IMMORTAL"
        >
          <LockOverlay level={10}>
            <div className="bottomAlign">
              <span className="d-flex immortal"></span>
            </div>
          </LockOverlay>
        </SquaredButton>
      </div>
    </div>
  );
};

export default PlayWithAISection;
