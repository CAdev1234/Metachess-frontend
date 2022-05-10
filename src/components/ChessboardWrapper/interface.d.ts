import { Square } from "chess.js";

export interface IPieceMove{
  sourceSquare: Square;
  targetSquare: Square;
  force?: boolean;
}