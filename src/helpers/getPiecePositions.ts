import { ChessInstance } from "chess.js";
import { Piece } from "chessboardjsx";

export const getPiecePositions = (game: ChessInstance, pieceString: Piece) => {
  const piece = {
    color: pieceString[0].toLowerCase(),
    type: pieceString[1].toLowerCase(),
  };
  return []
    .concat(...game.board())
    .map((p, index) => {
      if (p !== null && p.type === piece.type && p.color === piece.color) {
        return index;
      }
    })
    .filter(Number.isInteger)
    .map((piece_index) => {
      const row = "abcdefgh"[piece_index % 8];
      const column = Math.ceil((64 - piece_index) / 8);
      return row + column;
    });
};
