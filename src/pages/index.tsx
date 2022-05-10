import { navigate } from "gatsby";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import BorderedGameButton from "../components/BorderedGameButton";
import { MODES } from "../constants/playModes";
// import Chessboard2D from "../assets/images/Chessboard2D.png";
import Chessboard2D from "../assets/images/Chessboard2D.png";
import Chessboard3D from "../assets/images/Chessboard3D.png";
import Chessboard3DWarF from "../assets/images/Chessboard3DWarF.png";
import { Actions as UserActions } from "../store/user/user.action";


const ChooseGame = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(UserActions.setChoseMode(MODES.CHOSE_MODE));
  }, []);

  return (
    <div className={"choseModeSectionContainer m-auto"}>
      <div className={"headerWrapper"}>
        <p className="header-heading">GAME</p>
      </div>
      <div className="borderedButtonWrapper">
        <BorderedGameButton
          GameIcon={<img src={Chessboard2D} className="game-2d-icon" />}
          title="2D"
          available
          onPlayClick={() => navigate("/2d/choose-mode")}
        />
        <BorderedGameButton
          GameIcon={<img src={Chessboard3D} className="game-3d-icon" />}
          title="3D"
        />
        <BorderedGameButton
          GameIcon={<img src={Chessboard3DWarF} className="game-3df-icon" />}
          title="3D"
          subtitle="War-front"
          available
          onPlayClick={() => navigate("/warfront")}
        />
      </div>
    </div>
  );
};

export default ChooseGame;
