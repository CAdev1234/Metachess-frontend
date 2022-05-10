import React from "react";
import { Square } from "chess.js";
import { Piece } from "chessboardjsx";
import { SVG_PIECES } from "../../constants/svgPieces";


interface Props {
  isDragging: boolean;
  squareWidth: number;
  droppedPiece: Piece;
  targetSquare: Square;
  sourceSquare: Square;
  name: Piece | 'rK';
}

const CustomPiece = ({
  isDragging,
  squareWidth,
  droppedPiece,
  targetSquare,
  sourceSquare,
  name,
  ...restProps
}: Props) => {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <img
        src={SVG_PIECES[name]}
        style={{
          height: squareWidth * 0.8,
          width: squareWidth * 0.8,
          marginTop: "10%",
        }}
        {...restProps}
      />
    </div>
  );
};
export default CustomPiece;
