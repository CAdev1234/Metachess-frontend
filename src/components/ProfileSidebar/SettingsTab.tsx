import React, { useState } from "react";
import { useSelector } from "react-redux";
import EditIcon from "../../assets/images/EditIcon.png";
import { IAppState } from "../../store/reducers";
import { IServerStatus } from "../../store/user/user.interfaces";
import EditSettings from "./EditSettings";
import sound from "../../assets/images/sound.png";
import noSound from "../../assets/images/noSound.png";
import ChessboardWrapper from "./ChessboardWrapper";

const SettingsTab = () => {
  const [editing, setEditing] = useState<boolean>(false);
  const { serverStatus }: { serverStatus: IServerStatus } = useSelector(
    (state: IAppState) => state.user
  );
  const settings = {
    BoardOddSquaresColor: serverStatus.BoardOddSquaresColor,
    BoardEvenSquaresColor: serverStatus.BoardEvenSquaresColor,
    BoardLastPlaySquaresColor: serverStatus.BoardLastPlaySquaresColor,
    BoardPossibleMovesColor: serverStatus.BoardPossibleMovesColor,
    BoardPossibleCapturesColor: serverStatus.BoardPossibleCapturesColor,
    BoardCheckSquaresColor: serverStatus.BoardCheckSquaresColor,
    TreasureQuestSound: serverStatus.TreasureQuestSound,
  };
  const standardSettingsTab: JSX.Element = (
    <>
      <div className="info">
        <p className="subtitle">Board even squares color</p>
        <div
          className="display-color"
          style={{ background: settings.BoardEvenSquaresColor }}
        ></div>
      </div>
      <div className="info">
        <p className="subtitle">Board odd squares color</p>
        <div
          className="display-color"
          style={{ background: settings.BoardOddSquaresColor }}
        ></div>
      </div>
      <div className="info">
        <p className="subtitle">Board check square color</p>
        <div
          className="display-color"
          style={{ background: settings.BoardCheckSquaresColor }}
        ></div>
      </div>
      <div className="info">
        <p className="subtitle">Board last move square color</p>
        <div
          className="display-color"
          style={{ background: settings.BoardLastPlaySquaresColor }}
        ></div>
      </div>
      <div className="info">
        <p className="subtitle">Board possible move squares color</p>
        <div
          className="display-color"
          style={{ background: settings.BoardPossibleMovesColor }}
        ></div>
      </div>
      <div className="info">
        <p className="subtitle">Board possible capture square color</p>
        <div
          className="display-color"
          style={{ background: settings.BoardPossibleCapturesColor }}
        ></div>
      </div>
      <div className="info">
        <p className="subtitle">Treasure Quest Sound</p>
        <img
          src={settings.TreasureQuestSound ? sound : noSound}
          alt="sound"
          style={{ height: window && window.innerWidth < 500 ? "8vmin" : "4vmin", width: "auto" }}
        />
      </div>
      <ChessboardWrapper data={settings} />
    </>
  );
  return (
    <div className="tabContent">
      <div className="overallItem" style={{ position: "relative" }}>
        <p className="tabTitle">Game Settings</p>
        {!editing ? (
          <img
            src={EditIcon}
            alt="edit Icon"
            style={{
              // borderRadius: "50%",
              width: window && window.innerWidth < 500 ? "8vmin" : "4vmin",
              height: window && window.innerWidth < 500 ? "8vmin" : "4vmin",
              position: "absolute",
              right: 0,
              background: "#fff",
              borderRadius: "10px",
              cursor: "pointer",
              top: 0,
            }}
            onClick={() => setEditing(true)}
          />
        ) : null}
        <div className="ratings-area" style={{ flexDirection: "column" }}>
          {editing ? (
            <EditSettings setEditing={setEditing} settings={settings} />
          ) : (
            standardSettingsTab
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
