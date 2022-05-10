import React, { useEffect, useRef, useState } from "react";
//import Chessboard from "chessboardjsx";
import tutorial from "./tutorial.module.scss";
import API from "../../services/api.service";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { ENDPOINTS } from "../../services/endpoints";
import Chess from "chess.js";
import  dummy  from "./dummyGame.json";
import SocketService from "../../services/socket.service";
const Chessboard = React.lazy(() => import("chessboardjsx"));
const WINDOW_WIDTH_LIMIT = 768;

const moves = new Array(20).fill({white: "d4", black: "d6"})


function Tutorial()  {

  const [puzzle, setPuzzle] = useState(null);
  const [fen, setFen] = useState("start");
  const [dropSquareStyle, setDropSquareStyle]  = useState({});
  const [squareStyles, setSquareStyles]  = useState({});
  const [pieceSquare, setPieceSquare]  = useState("");
  const [square, setSquare]  = useState("");
  const [history, setHistory]  = useState([]);
  const [game, setGame] =  useState(null);
  const [gamePuzzle, setGamePuzzle] = useState(null)
  const [totalMoves, setTotalMoves] = useState(null)
  const [currentMove, setCurrentMove] = useState(0)
  const [playState, setPlayState] = useState(<div></div>)
  const [boardWidth, setBoardWidth] = useState(480)
  const [isValidPiece, setIsValidPiece] = useState(false)
  const [lastMove, setLastMove] = useState({to: "", from: ""})


  const findGame = () => {

    const gamePuzzle = dummy.games[Math.floor(Math.random() * 2)];

    setGamePuzzle(gamePuzzle)
    setTotalMoves(gamePuzzle.rightMoves.length)
    setGame(new Chess(gamePuzzle.fen))

    setFen(gamePuzzle.fen)


  }


  useEffect(() => {

    API.execute("GET", ENDPOINTS.GET_RANDOM_PUZZLE).then(res => {

      findGame()

      setPuzzle(res)

      SocketService.sendData("start-puzzle-game", res.Id);

    }, err => {

      toast(<div>{err}</div>)

    });

    return () => SocketService.sendData("leave-puzzle-game", null, null);

  }, []);

  useEffect(() => {

    if(game && fen != "start") {

      const turn = game.turn()

      // if((puzzle.IsWhite && turn === "b") || (!puzzle.IsWhite && turn === "w")) {

      //   agentMove(gamePuzzle.agentMoves[currentMove])

      // }

      if(((gamePuzzle.IsWhite && turn === "b") || (!gamePuzzle.IsWhite && turn === "w")) && currentMove <= totalMoves - 1) {

        setTimeout(() => {
          agentMove(gamePuzzle.agentMoves[currentMove])
        }, 200)

      }


    }

  }, [game, fen, puzzle, gamePuzzle, currentMove])

  useEffect(() => {

    if(game) {
      setPlayState(<div>  <p> <h3> <strong> Your Turn </strong> </h3>  </p>  <p>  Best Move For { gamePuzzle.IsWhite? "White" : "Black"} </p>  </div>)

    }

  }, [game, gamePuzzle])

  useEffect(() => {

    const screenWidth = window.innerWidth;

    if(screenWidth < WINDOW_WIDTH_LIMIT) setBoardWidth(screenWidth * 0.94)

  }, [])

  useEffect(() => {

    if (isValidPiece) {

      setSquareStyles(squareStyling({ pieceSquare, history }))

      const move = game.move({
        from: pieceSquare,
        to: square,
        promotion: "q" // always promote to a queen for example simplicity
      });

      // illegal move
      if (move === null) return getPossibleMoves(pieceSquare);
  
    }

  }, [isValidPiece, pieceSquare])

  const onPieceClick = (piece: string) => {

    if(piece[0] === game.turn()) {

      setIsValidPiece(true)

    } else {

      setIsValidPiece(false)

    }

  }

  const onDrop = ({ sourceSquare, targetSquare }: any) => {
    // see if the move is legal
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q" // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;

    setFen(game.fen())
    setHistory(game.history())

    //setLastMove({ from: move.from, to: move.to })

    validateMove(move)

  }

  // show possible moves
  const highlightSquare = (sourceSquare: any, squaresToHighlight: any) => {
    const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
      (a, c) => {
        return {
          ...a,
          ...{
            [c]: {
              background:
                "radial-gradient(circle, #fffc00 36%, transparent 40%)",
              borderRadius: "50%",
              width: "30px"
            }
          },
          ...squareStyling({
            history: history,
            pieceSquare: pieceSquare
          })
        };
      },
    {}
    )
    setSquareStyles({ ...squareStyles, ...highlightStyles })
  };

  const moveStyling = ({ from, to}: any) => {

    return {
      [from]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
      [to]: { backgroundColor: "rgba(255, 255, 0, 0.4)"}
    };

  }

  const squareStyling = ({ pieceSquare, history}: any) => {
    const sourceSquare = history.length && history[history.length - 1].from;
    const targetSquare = history.length && history[history.length - 1].to;

    return {
      [pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
      ...(history.length && {
        [sourceSquare]: {
          backgroundColor: "rgba(255, 255, 0, 0.4)"
        }
      }),
      ...(history.length && {
        [targetSquare]: {
          backgroundColor: "rgba(255, 255, 0, 0.4)"
        }
      })
    };
  };

  const agentMove = ({ from, to }: any) => {

    const move = game.move({
      from: from,
      to: to,
      promotion: "q" // always promote to a queen for example simplicity
    });

    if (move === null) return;

    setFen(game.fen())
    setHistory(game.history({verbose: true}));

    setSquareStyles(moveStyling({from, to}))
    
    setLastMove({from, to});

  }

  const getPossibleMoves = (square: any) => {

    // get list of possible moves for this square
    const moves = game.moves({
      square: square,
      verbose: true
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    const squaresToHighlight = [];
    for (let i = 0; i < moves.length; i++) {
      squaresToHighlight.push(moves[i].to);
    }

    highlightSquare(square, squaresToHighlight);
  };


  const onSquareClick = (square: any) => {

    setPieceSquare(square)

    const move = game.move({
      from: pieceSquare,
      to: square,
      promotion: "q" // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return getPossibleMoves(square);

    setFen(game.fen())
    setHistory(game.history({verbose: true}));
    setPieceSquare("")

    validateMove(move)

  };

  const validateMove = (move: any) => {

    setCurrentMove(x => x + 1)

    if(move.from !== gamePuzzle.rightMoves[currentMove].from ||
      move.to !== gamePuzzle.rightMoves[currentMove].to ) {

      setPlayState(<div className={tutorial.wrong}>
                      <p> <h3> <strong> Wrong Move </strong> </h3>  </p>
                      <p> Try another move </p>
                      {/* <p>  <button> View Solution </button> </p>  */}
                    </div>)

      setTimeout(() => {

        game.undo()
        setFen(game.fen())
        setCurrentMove(x => x - 1)
        setHistory([])

        setSquareStyles(moveStyling(lastMove))

      }, 200)

    } else if (currentMove >= totalMoves - 1) {

      setPlayState(<div className={tutorial.success}>
                    <p> <h3> <strong> Correct Move</strong> </h3>  </p>
                    <p onClick={ () => {
                      setGamePuzzle(null)
                      findGame()
                    }}> Continue Learning </p>
                  </div>)

      setSquareStyles(moveStyling({ from: move.from, to: move.to }))

    }

  }

  const onDragOverSquare = (square: any) => {

    const dropSquareStyle = square === "e4" || square === "d4" || square === "e5" || square === "d5" ? { backgroundColor: "cornFlowerBlue" } : { boxShadow: "inset 0 0 1px 4px rgb(255, 255, 0)" }

    setDropSquareStyle(dropSquareStyle);

  };

  const onSquareRightClick = (square : any) => setSquareStyles({ [square]: { backgroundColor: "deepPink" } });

  if (!puzzle) return (<div> <Loader /> </div>)

  return (
    <div className={tutorial.main}>

      <div className={tutorial.leftPanel}>

        {
          <div className={tutorial.gameInfo}>
            <p> Puzzle: {puzzle.Name} </p>
            <p> Survive Turns: {puzzle.SurviveTurns}</p>
            <p> Increment Time: {puzzle.IncrementTime}</p>
            <p> Base Time: {puzzle.BaseTime}</p>
            <p> Game Type: {puzzle.Type}</p>
          </div>
        }
        
      </div>

      <div className={tutorial.centerPanel} >

        <React.Suspense fallback={<div />}>
          <Chessboard
            id={"train"}
            width={boardWidth}
            position={fen}
            orientation={"black"}
            onSquareClick={onSquareClick}
            onDrop={onDrop}
            squareStyles={squareStyles}
            dropSquareStyle={dropSquareStyle}
            onDragOverSquare={onDragOverSquare}
            onSquareRightClick={onSquareRightClick}
            onPieceClick={onPieceClick}
            />
        </React.Suspense>

      </div>

      <div className={tutorial.rightPanel}>

        <div className={tutorial.tableWrapper}>

          <table className={tutorial.table}>

            <tbody>

              {
                moves.map((move, index) => {
                  return <tr> <td> {index + 1} </td> <td> {move.white} </td> <td>{move.black} </td></tr>
                })
              }

            </tbody>

          </table>

        </div>


        <div className={tutorial.gameState}>

          { playState }

        </div>

      </div>

    </div>
  );
}

export default Tutorial;
