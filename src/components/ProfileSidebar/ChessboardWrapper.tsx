import React, { CSSProperties, lazy, useEffect, useState } from "react";
import Chess, { ChessInstance, Square } from "chess.js";
import { getPiecePositions } from "../../helpers/getPiecePositions";
import { isSSR } from "../../lib/utils";
import CustomPiece from "../CustomPiece";
import { ISettings } from "./EditSettings";
const Chessboard = lazy(() => import("chessboardjsx"));

const ChessboardWrapper = ({ data }: { data: ISettings }) => {
  const [game, setGame] = useState<ChessInstance>(new (Chess as any)());
  const [squareStyles, setSquareStyles] = useState<{ [square in Square]?: CSSProperties }>({});
  const [pieceSquare, setPieceSquare] = useState<Square>(null);
  // useEffect(()=>{
  //     setGame()
  // },[]);
  const {
    BoardOddSquaresColor,
    BoardEvenSquaresColor,
    BoardLastPlaySquaresColor,
    BoardPossibleMovesColor,
    BoardPossibleCapturesColor,
    BoardCheckSquaresColor,
  } = data;
  if (!BoardOddSquaresColor || !BoardEvenSquaresColor) return null;
  const removeHighlight = (source: string, to: string) => {
    setSquareStyles({
      [source]: {
        background:
          (BoardLastPlaySquaresColor[0] === "#" ? "" : "#") +
          BoardLastPlaySquaresColor,
      },
      [to]: {
        background:
          (BoardLastPlaySquaresColor[0] === "#" ? "" : "#") +
          BoardLastPlaySquaresColor,
      },
    });
  };
  const handleMove = (to: Square) => {
    if (game.game_over()) return;
    const source = pieceSquare;
    const move = game.move({ from: pieceSquare, to });
    if (move === null) {
      return;
    }
    setPieceSquare(null);
    if (game.in_check()) {
      setSquareStyles({
        [getPiecePositions(game, `${game.turn()}K` as any)[0]]: {
          background:
            (BoardCheckSquaresColor[0] === "#" ? "" : "#") +
            BoardCheckSquaresColor,
        },
      });
    } else removeHighlight(source, to);
  };
  const handleClick = (square: Square) => {
    const pieceInfo = game.get(square);
    const pieceSquareInfo = game.get(pieceSquare);
    console.log(pieceInfo, pieceSquareInfo);
    if (
      pieceSquare &&
      (!pieceInfo || pieceInfo.color !== pieceSquareInfo.color)
    )
      return handleMove(square);
    if (!pieceInfo) return;
    if (pieceInfo && game.turn() !== pieceInfo.color) return;
    setPieceSquare(square);
    const moves = game.moves({ verbose: true, square });
    let arr: { [square in Square]?: CSSProperties } = {};
    for (const move of moves) {
      const canBeEaten = game.get(move.to);
      arr[move.to] = {
        background: canBeEaten
          ? `radial-gradient(circle, ${BoardPossibleCapturesColor[0] === "#" ? "" : "#"
          }${BoardPossibleCapturesColor} 36%, transparent 0)`
          : `radial-gradient(circle, ${BoardPossibleMovesColor[0] === "#" ? "" : "#"
          }${BoardPossibleMovesColor} 36%, transparent 0)`,
        borderRadius: "50%",
      };
    }
    setSquareStyles({
      ...arr,
      [square]: { background: "rgba(255, 255, 0, 0.4)" },
    });
  };
  return <>{!isSSR && (
    <React.Suspense fallback={<div />}>
      <Chessboard
        width={window && window.innerWidth < 500 ? 200 : 350}
        squareStyles={squareStyles}
        position={game.fen()}
        onSquareClick={handleClick}
        draggable={false}
        darkSquareStyle={{
          background: `${BoardOddSquaresColor[0] === "#" ? "" : "#"
            }${BoardOddSquaresColor} 0% 0% no-repeat padding-box`,
        }}
        lightSquareStyle={{
          background: `${BoardEvenSquaresColor[0] === "#" ? "" : "#"
            }${BoardEvenSquaresColor} 0% 0% no-repeat padding-box`,
        }}
        pieces={{
          wP: (pieceProps) => <CustomPiece name={"wP"} {...pieceProps} />,
          wN: (pieceProps) => <CustomPiece name={"wN"} {...pieceProps} />,
          wB: (pieceProps) => <CustomPiece name={"wB"} {...pieceProps} />,
          wR: (pieceProps) => <CustomPiece name={"wR"} {...pieceProps} />,
          wQ: (pieceProps) => <CustomPiece name={"wQ"} {...pieceProps} />,
          wK: (pieceProps) => <CustomPiece name={"wK"} {...pieceProps} />,
          bP: (pieceProps) => <CustomPiece name={"bP"} {...pieceProps} />,
          bN: (pieceProps) => <CustomPiece name={"bN"} {...pieceProps} />,
          bB: (pieceProps) => <CustomPiece name={"bB"} {...pieceProps} />,
          bR: (pieceProps) => <CustomPiece name={"bR"} {...pieceProps} />,
          bQ: (pieceProps) => <CustomPiece name={"bQ"} {...pieceProps} />,
          bK: (pieceProps) => <CustomPiece name={"bK"} {...pieceProps} />,
        }}
      />
    </React.Suspense>
  )}
    );
  </>
};

export default ChessboardWrapper;
