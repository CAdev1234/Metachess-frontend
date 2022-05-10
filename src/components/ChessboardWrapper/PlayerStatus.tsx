import React from "react";
import { Piece } from "chessboardjsx";
import { SVG_PIECES, BOARD_PIECES } from "../../constants/svgPieces";
import { IUser } from "../../store/user/user.interfaces";
import { getOpponentName } from "../../helpers/getOpponentNameByPlayMode";
import { ISetPlayModePayload } from "../../store/gameplay/gameplay.interfaces";
import { GameType } from "../../interfaces/game.interfaces";
import { getGameTypeElo, getGameTypeNameByType } from "../../helpers/gameTypeHelper";

interface Props {
  player: IUser;
  reverse?: boolean;
  chessAscii: string;
  playMode: ISetPlayModePayload;
  name?: string;
  gameType: GameType;
  isReplay: boolean;
  color: "b" | "w";
}

const PlayerStatus = ({
  player,
  playMode,
  name,
  reverse,
  gameType,
  isReplay,
  chessAscii: originalChessAscii = "",
  color,
}: Props) => {
  let chessAscii = originalChessAscii;
  const pieceNames: string[] = BOARD_PIECES.filter(
    (pieceName) => pieceName[0] !== color
  );
  if (reverse) pieceNames.reverse();
  const wonPieces: Piece[] = pieceNames.filter((opponentsPiece: string) => {
    const fenPiece =
      color === "b"
        ? opponentsPiece[1].toUpperCase()
        : opponentsPiece[1].toLowerCase();
    const indexOfPiece = chessAscii.indexOf(fenPiece);
    const newChessAscii = chessAscii.replace(fenPiece, "x");
    if (chessAscii !== newChessAscii) {
      chessAscii = newChessAscii;
      return false;
    }
    return true;
  }) as Piece[];

  return (
    <div className={`playerStatus ${reverse ? "playerStatusReversed" : ""}`}>
      <p className={"chessboardOpponentName"}>{name ? name : getOpponentName(playMode.isAI, playMode.aiMode, player)}</p>
      {player && !isReplay && gameType &&
        <div className="elo-container">
          <div className="elo">
            {getGameTypeElo(gameType, player)}
          </div>
          <div className="mode">
            {getGameTypeNameByType(gameType)}
          </div>
        </div>
      }
      <div className="wonFiguresWrapper">
        {wonPieces.map((pieceName, i) => (
          <img
            key={i}
            src={SVG_PIECES[pieceName]}
            className="wonPieceImage"
          />
        ))}
      </div>
    </div>
  );
};

export default PlayerStatus;
