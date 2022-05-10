// import Chessboard from "chessboardjsx";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { isSSR } from "../../lib/utils";
import { Actions } from "../../store/user/user.action";
import { squareStyles } from "../../pages/treasurequest";
import CustomPiece from "../CustomPiece";
import sound from "../../assets/images/sound.png";
import noSound from "../../assets/images/noSound.png";
import ChessboardWrapper from "./ChessboardWrapper";

const Chessboard = React.lazy(() => import("chessboardjsx"));

export interface ISettings {
  BoardOddSquaresColor?: string;
  BoardEvenSquaresColor?: string;
  BoardLastPlaySquaresColor?: string;
  BoardPossibleMovesColor?: string;
  BoardPossibleCapturesColor?: string;
  BoardCheckSquaresColor?: string;
  TreasureQuestSound?: boolean;
}

interface IProps {
  setEditing: Function;
  settings: ISettings;
}

const EditSettings = (props: IProps) => {
  const [settings, setSettings] = useState<ISettings>(props.settings);
  let id: NodeJS.Timer = null;
  const dispatch = useDispatch();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    props.setEditing(false);
    dispatch(Actions.updateSettings(settings));
  };
  const handleChange = (e: any, name: string): void => {
    if (!e.target) return;
    if (id) clearTimeout(id);
    const temp = e.target.value;
    id = setTimeout(
      () =>
        setSettings({
          ...settings,
          [name]: temp,
        }),
      500
    );
  };
  // const highlightSquare = (sourceSquare: any, squaresToHighlight: any) => {
  //   const highlightStyles = [...squaresToHighlight].reduce((a, c) => {
  //     const canBeEaten = c === "d5";
  //     return {
  //       ...a,
  //       ...{
  //         [c]: {
  //           background: canBeEaten
  //             ? `radial-gradient(circle, ${settings.BoardPossibleCapturesColor} 36%, transparent 0)`
  //             : `radial-gradient(circle, ${settings.BoardPossibleMovesColor} 36%, transparent 0)`,
  //           borderRadius: "50%",
  //         },
  //       },
  //     };
  //   }, {});
  //   setSquareStyles({
  //     ...squareStyles,
  //     ...highlightStyles,
  //     ["d4"]: { background: settings.BoardCheckSquaresColor },
  //   });
  // };
  // useEffect(() => {
  //   setSquareStyles({
  //     ["d4"]: { background: settings.BoardCheckSquaresColor },
  //   });
  // }, [settings]);
  // // console.log(squareStyles, settings);
  // const handlePieceClick = (piece: string): void => {
  //   setSquareStyles({
  //     ["d4"]: { background: settings.BoardCheckSquaresColor },
  //   });

  //   switch (piece) {
  //     case "d4":
  //       highlightSquare(piece, ["e5", "c5", "d5", "c4", "d3", "c3", "e3"]);
  //       break;
  //     case "e4":
  //       highlightSquare(piece, ["e5", "d5"]);
  //       break;
  //     case "e7":
  //       break;
  //   }
  // };
  return (
    <div className="Form-container">
      <div className="Form-wrapper">
        <form
          className="signup-page__form"
          style={{ gap: "2vmin", marginTop: "4vmin" }}
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <div className="three-inputs">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                className="Lables"
                style={{
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: "2vmin",
                }}
              >
                Board even squares color
              </label>
              <input
                type="color"
                name=""
                value={settings.BoardEvenSquaresColor}
                id=""
                onChange={(e: any) => handleChange(e, "BoardEvenSquaresColor")}
              />
            </div>{" "}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                className="Lables"
                style={{
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: "2vmin",
                }}
              >
                Board odd squares color
              </label>
              <input
                type="color"
                name=""
                value={settings.BoardOddSquaresColor}
                id=""
                onChange={(e: any) => handleChange(e, "BoardOddSquaresColor")}
              />
            </div>{" "}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                className="Lables"
                style={{
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: "2vmin",
                }}
              >
                Board possible move squares color
              </label>
              <input
                type="color"
                name=""
                value={settings.BoardPossibleMovesColor}
                id=""
                onChange={(e: any) =>
                  handleChange(e, "BoardPossibleMovesColor")
                }
              />
            </div>{" "}
          </div>
          <div className="three-inputs">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                className="Lables"
                style={{
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: "2vmin",
                }}
              >
                Board last move square color
              </label>
              <input
                type="color"
                name=""
                value={settings.BoardLastPlaySquaresColor}
                id=""
                onChange={(e: any) =>
                  handleChange(e, "BoardLastPlaySquaresColor")
                }
              />
            </div>{" "}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                className="Lables"
                style={{
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: "2vmin",
                }}
              >
                Board check square color
              </label>
              <input
                type="color"
                name=""
                value={settings.BoardCheckSquaresColor}
                id=""
                onChange={(e: any) => handleChange(e, "BoardCheckSquaresColor")}
              />
            </div>{" "}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                className="Lables"
                style={{
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: "2vmin",
                }}
              >
                Board possible capture square color
              </label>
              <input
                type="color"
                name=""
                value={settings.BoardPossibleCapturesColor}
                id=""
                onChange={(e: any) =>
                  handleChange(e, "BoardPossibleCapturesColor")
                }
              />
            </div>{" "}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              className="Lables"
              htmlFor="soundOn"
              style={{ color: "rgba(255,255,255,0.6)", marginBottom: "2vmin" }}
            >
              <label
                className="Lables"
                style={{
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: "2vmin",
                  display: "inline-block"
                }}
              >
                Treasure Quest Sound
              </label>
              <br />
              <img
                src={settings.TreasureQuestSound ? sound : noSound}
                alt="sound"
                style={{ height: window && window.innerWidth < 500 ? "8vmin" : "4vmin", width: "auto" }}
              />
            </label>
            <input
              type="checkbox"
              name=""
              style={{ display: "none" }}
              checked={settings.TreasureQuestSound}
              id="soundOn"
              onChange={(e: any) =>
                setSettings({
                  ...settings,
                  TreasureQuestSound: e.target.checked,
                })
              }
            />
          </div>{" "}

          <ChessboardWrapper data={settings} />
          <button className="claimButton">Update</button>
        </form>
      </div>
    </div>
  );
};

export default EditSettings;
