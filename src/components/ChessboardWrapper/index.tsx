import { Component, CSSProperties, LegacyRef, Ref, RefObject } from "react";
import React from "react";
import Chess, { ChessInstance, Square } from "chess.js";
import { Piece } from "chessboardjsx";
import Sounds from "../../lib/sound";
import Stockfish from "../../lib/stockfish";
import { IPieceMove } from "./interface";
import { isSSR } from "../../lib/utils";
import CustomPiece from "../CustomPiece";
import { getPiecePositions } from "../../helpers/getPiecePositions";
import PlayerStatus from "./PlayerStatus";
import { AI_PLAY_MODE } from "../../constants/playModes";
import { INITIAL_FEN } from "./../../constants/playModes";
import { connect } from "react-redux";
import { IAppState } from "../../store/reducers";
import { IServerStatus, IUser } from "../../store/user/user.interfaces";
import {
  ISetPlayModePayload,
  ITimer,
} from "../../store/gameplay/gameplay.interfaces";
import { getGameType } from "../../helpers/gameTypeHelper";
import {
  GameRules,
  SpectatingGameRules,
} from "../../interfaces/game.interfaces";
import Timer from "../Timer";
import { getOpponentName } from "../../helpers/getOpponentNameByPlayMode";
const Chessboard = React.lazy(() => import("chessboardjsx"));
const WINDOW_WIDTH_LIMIT = 768;

interface IState {
  squareStyles: { [square in Square]?: CSSProperties };
  dropSquareStyle: CSSProperties;
  pieceSquare: Square;
  squareStylesExceptions: {
    checkOrCheckmate?: { [square in Square]?: CSSProperties };
    lastMove?: { [square in Square]?: CSSProperties };
  };
  gameReady: boolean;
  blackTimerTime: number;
  whiteTimerTime: number;
  blackChecked: boolean;
  whiteChecked: boolean;
  isFastHide: boolean;
}

interface IProps {
  fen: string;
  playerColor: "b" | "w";
  handleMove: (
    fen: string,
    playerOnMove: string,
    move: string,
    shouldRerender?: boolean,
    isCheck?: boolean,
    isCheckmate?: boolean,
    isDraw?: boolean,
    isRepetition?: boolean,
    isStalemate?: boolean
  ) => void;
  skillLevel: number;
  maximumError: number;
  probability: number;
  timerLimit: number;
  timerBonus: number;
  isAI: boolean;
  aiDifficulty: AI_PLAY_MODE;
  opponent: IUser;
  onGameEnd: (
    winner: "b" | "w" | "draw",
    replay: boolean,
    calledByChessboard: boolean
  ) => void;
  chessSize?: number;
  currentUser: IUser;
  timer: ITimer;
  isReplay: boolean;
  playMode: ISetPlayModePayload;
  gameRules: GameRules;
  moveHistoryData: string[];
  serverStatus: IServerStatus;
  onReplayPrevious: () => void;
  onReplayNext: () => void;
}

class ChessboardWrapper extends Component<IProps, IState> {
  game: ChessInstance;
  constructor(props: any) {
    super(props);
    this.state = {
      squareStyles: {},
      squareStylesExceptions: {
        checkOrCheckmate: {},
        lastMove: {},
      },
      dropSquareStyle: {},
      pieceSquare: null,
      blackTimerTime: props.timerLimit,
      whiteTimerTime: props.timerLimit,
      gameReady: true,
      blackChecked: false,
      whiteChecked: false,

      isFastHide: false,
    };
  }

  wrapperRef: RefObject<HTMLDivElement> = React.createRef();
  chessboard: typeof Chessboard | (() => null) = (): any => null;
  stockfish: any;
  moveSound: boolean = false;
  captureSound: boolean = false;
  checkSound: boolean = false;
  checkmateSound: boolean = false;
  stalemateSound: boolean = false;
  sourceDrag: Square = null;

  componentDidMount() {
    const { skillLevel, maximumError, probability, playerColor } = this.props;
    this.game = new (Chess as any)();
    this.chessboard = Chessboard;
    this.forceUpdate();
    if (this.props.isAI) {
      Stockfish.init(
        skillLevel,
        maximumError,
        probability,
        playerColor,
        this.game,
        this.handleMove,
        this.props.aiDifficulty
      );
    }
  }

  componentWillReceiveProps(nextProps: IProps) {
    this.game.load(nextProps.fen);
    if (nextProps.fen === INITIAL_FEN) {
      this.setState(
        {
          //squareStyles: {},
          squareStylesExceptions: {
            checkOrCheckmate: {},
            lastMove: {},
          },
          isFastHide: true,
        },
        () => {
          this.setState({
            isFastHide: false,
          });
        }
      );
    }
    if (!this.props.isAI && nextProps.isReplay) {
      this.forceUpdate();
    } else if (!this.props.isAI) return;
    if (!nextProps.fen && this.props.playerColor !== "w") {
      Stockfish.handleAIPlay();
    }
  }

  onPieceClick = (testId: string) => {
    // console.log("onPieceClick", testId);
    const pieceSquareId = testId;
    if (
      pieceSquareId.length === 2 &&
      pieceSquareId[0] >= "a" &&
      pieceSquareId[0] <= "h" &&
      pieceSquareId[1] >= "1" &&
      pieceSquareId[1] <= "8"
    ) {
      this.onSquareClick(pieceSquareId as Square);
    }
  };

  // keep clicked square style and remove hint squares
  removeHighlightSquare = (
    square = this.state.pieceSquare,
    callback?: () => void
  ) => {
    document.querySelectorAll(".eatable").forEach((el) => {
      console.log(el);
      el.classList.remove("eatable");
    });
    console.log(square);
    this.setState(
      {
        squareStyles: squareStyling({ square }),
      },
      callback
    );
  };

  // show possible moves
  highlightSquare = (sourceSquare: any, squaresToHighlight: any) => {
    const { pieceSquare, squareStyles } = this.state;
    const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
      (a, c) => {
        const canBeEaten =
          this.game.get(c) &&
          this.game.get(c).color === (this.game.turn() === "b" ? "w" : "b");
        // console.log(c);
        document
          .querySelector(`div[data-squareid="${c}"]`)
          .classList.add(canBeEaten ? "eatable" : undefined);
        return {
          ...a,
          ...{
            [c]: {
              background: canBeEaten
                ? `radial-gradient(circle, ${this.props.serverStatus.BoardPossibleCapturesColor} 36%, transparent 0)`
                : `radial-gradient(circle, ${this.props.serverStatus.BoardPossibleMovesColor} 36%, transparent 0)`,
              borderRadius: "50%",
            },
          },
          ...squareStyling({
            pieceSquare,
          }),
        };
      },
      {}
    );
    this.setState({
      squareStyles: {
        ...squareStyles,
        ...highlightStyles,
      },
    });
  };

  onDrop = ({
    sourceSquare,
    targetSquare,
  }: {
    sourceSquare: Square;
    targetSquare: Square;
    piece: Piece;
  }) => {
    this.sourceDrag = null;
    // this.removeHighlightSquare();
    this.handleMove({ sourceSquare, targetSquare });
  };

  // central squares get diff dropSquareStyles
  onDragOverSquare = (square: Square) => {
    if (this.sourceDrag) return;
    this.sourceDrag = square;
    if (this.state.pieceSquare)
      this.removeHighlightSquare(this.state.pieceSquare, () =>
        this.highlightPossibleSquares(this.state.pieceSquare)
      );
    else {
      this.highlightPossibleSquares(this.sourceDrag);
    }
  };

  playerCanPlay = (): boolean => {
    if (this.props.isReplay) {
      return false;
    }
    return this.props.playerColor === this.game?.turn();
  };
  allowDrag = (obj: { piece: Piece; sourceSquare: Square }) =>
    this.props.playerColor === obj.piece[0];

  onSquareClick = (square: Square) => {
    // console.log(square);
    console.log(this.state.pieceSquare);
    if (!this.playerCanPlay()) {
      return;
    }
    const { pieceSquare } = this.state;
    const squareInfo = this.game.get(square);
    // console.log(squareInfo);
    if (
      pieceSquare === null ||
      (this.props.playerColor === squareInfo?.color &&
        this.game.turn() === this.props.playerColor)
    ) {
      //  player initial select piece
      this.resetSelectedPiece(square);
    } else {
      this.handleMove({
        sourceSquare: pieceSquare,
        targetSquare: square,
      });
    }
  };

  onSquareRightClick = (square: any) =>
    this.setState({
      squareStyles: { [square]: { background: "deepPink" } },
    });

  resetSelectedPiece = (square: Square = null) => {
    this.removeHighlightSquare(this.state.pieceSquare, () =>
      this.setState(
        {
          pieceSquare: square,
        },
        () => this.highlightPossibleSquares(square)
      )
    );
  };

  handleMove = (nextMove: IPieceMove | string, isAI?: boolean) => {
    if (
      nextMove &&
      this.props.playerColor &&
      this.props.playerColor !== this.game.turn() &&
      !isAI
    ) {
      return;
    }
    const { pieceSquare } = this.state;
    // see if the move is legal
    const move = this.game.move(
      typeof nextMove === "string"
        ? nextMove
        : {
            from: nextMove.sourceSquare,
            to: nextMove.targetSquare,
            promotion: "q", // always promote to a queen for example simplicity
          }
    );

    if (pieceSquare) {
      this.setState({ pieceSquare: null });
    }

    // illegal move
    if (move === null) {
      return;
    }
    const { from: sourceSquare, to: targetSquare } = move;

    this.setSquareStylesExceptions({ sourceSquare, targetSquare });
    const newFen = this.game.fen();
    if (
      this.game.in_stalemate() ||
      this.game.in_threefold_repetition() ||
      this.game.in_draw()
    ) {
      this.stalemateSound = true;
    } else if (this.game.in_checkmate()) {
      this.checkmateSound = true;
    } else if (this.game.in_check()) {
      this.checkSound = true;
    } else if (move.captured) {
      this.captureSound = true;
    } else {
      this.moveSound = true;
    }
    const moveHistory =
      this.game.history().length > 1
        ? this.game.history()[1]
        : this.game.history()[0];
    this.props.handleMove(
      newFen,
      this.game.turn(),
      moveHistory,
      true,
      this.game.in_check(),
      this.game.in_checkmate(),
      this.game.in_draw(),
      this.game.in_threefold_repetition(),
      this.game.in_stalemate()
    );
    if (!isAI) {
      this.removeHighlightSquare(sourceSquare);
      this.forceUpdate(() => {
        if (this.props.isAI) {
          setTimeout(() => {
            Stockfish.handleAIPlay();
          }, 500);
        }
      });
    }
  };

  highlightPossibleSquares = (square: Square) => {
    // get list of possible moves for this square
    const moves = this.game.moves({
      square,
      verbose: true,
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) {
      return;
    }

    const squaresToHighlight: Square[] = [];
    moves.forEach((move) => {
      squaresToHighlight.push(move.to);
    });
    this.highlightSquare(square, squaresToHighlight);
  };

  onMouseOverSquare = (square: Square) => {
    if (this.props.playerColor !== this.game.turn()) {
      return;
    }
    this.highlightPossibleSquares(
      this.state.pieceSquare ? this.state.pieceSquare : square
    );
  };

  onMouseOutSquare = (square: Square) => {
    !this.state.pieceSquare && this.removeHighlightSquare();
  };
  calcWidth = (sw: number, sh: number) => {
    if (!sw) {
      return "100%";
    }
    if (sw < 768) {
      return sw;
    }
    return 768;
  };

  // if color is not passed and if last move was check it will empty object
  setSquareStylesExceptions({
    color,
    sourceSquare,
    targetSquare,
  }: {
    color?: string;
    sourceSquare?: Square;
    targetSquare?: Square;
  }) {
    console.log("hello");
    const { squareStyles } = this.state;
    if (color) {
      this.setState({
        blackChecked: true,
        squareStylesExceptions: {
          checkOrCheckmate: {
            [getPiecePositions(this.game, `${color}K` as Piece)[0]]: {
              // background: "rgba(255, 0, 0, 0.4)",
              background: this.props.serverStatus.BoardCheckSquaresColor,
            },
          },
        },
      });
    } else {
      this.setState({
        blackChecked: true,
        squareStylesExceptions: {
          checkOrCheckmate: {},
          lastMove: {
            [sourceSquare]: {
              ...(squareStyles && squareStyles[sourceSquare]
                ? squareStyles[sourceSquare]
                : {}),
              background: this.props.serverStatus.BoardLastPlaySquaresColor,
            },
            [targetSquare]: {
              ...(squareStyles && squareStyles[targetSquare]
                ? squareStyles[targetSquare]
                : {}),
              background: this.props.serverStatus.BoardLastPlaySquaresColor,
            },
          },
        },
      });
    }
  }

  componentDidUpdate() {
    if (this.moveSound) {
      setTimeout(async () => {
        await Sounds.move();
      }, 300);
      this.moveSound = false;
    }
    if (this.captureSound) {
      setTimeout(async () => {
        await Sounds.capture();
      }, 300);
      this.captureSound = false;
    }
    if (this.checkSound) {
      setTimeout(async () => {
        await Sounds.check();
      }, 300);
      this.setSquareStylesExceptions({ color: this.game.turn() });
      this.checkSound = false;
    }
    if (this.checkmateSound) {
      setTimeout(async () => {
        await Sounds.checkmate();
        this.props.onGameEnd(
          this.game.turn() === "b" ? "w" : "b",
          this.props.isReplay,
          true
        );
      }, 300);
      this.setSquareStylesExceptions({ color: this.game.turn() });
      this.checkmateSound = false;
    }

    if (this.stalemateSound) {
      setTimeout(async () => {
        await Sounds.stalemate();
        this.props.onGameEnd("draw", this.props.isReplay, true);
      }, 300);
      this.stalemateSound = false;
    }
  }

  render() {
    const { squareStyles, squareStylesExceptions } = this.state;
    const {
      playerColor,
      opponent,
      timerLimit,
      timerBonus,
      playMode,
      currentUser,
      timer,
      gameRules,
      ...restProps
    } = this.props;

    let windowWidth = 1280;
    if (!isSSR) windowWidth = window.innerWidth;
    // console.log("playMode", playMode);
    // console.log("time", gameRules);
    // console.log("time", spectatingGameRules);
    // const gameType = (playMode != undefined && playMode != null && playMode.isAI) ? null : getGameType(gameRules.time.base || spectatingGameRules.time.base);

    const gameType = playMode.isAI ? null : getGameType(gameRules.time.base);
    // const opponentName = "INTERMEDIATE AI";
    let windowHeight = WINDOW_WIDTH_LIMIT;
    // const limitedHeight =
    if (!isSSR) windowHeight = window.innerHeight;
    let chessWidth =
      windowWidth <= WINDOW_WIDTH_LIMIT
        ? windowWidth
        : (windowWidth * 800) / 1920;
    let chessHeight = WINDOW_WIDTH_LIMIT;

    if (this.wrapperRef?.current) {
      chessHeight = this.wrapperRef.current.clientHeight;
      if (chessHeight < chessWidth) chessWidth = chessHeight;
    }
    const chessAscii = this.game ? this.game.ascii() : "";
    const combinedSquareStyles = {
      ...squareStylesExceptions.lastMove,
      ...squareStyles,
      ...squareStylesExceptions.checkOrCheckmate,
    };
    console.log(chessWidth, WINDOW_WIDTH_LIMIT, chessHeight);

    return (
      <div
        className="chessboardContainer"
        style={{ maxWidth: chessWidth }}
        {...restProps}
      >
        {playMode != null && !playMode.isAI && (
          <Timer
            className="timer-mobile mt-20"
            timeLeft={playerColor === "b" ? timer?.white : timer?.black}
          />
        )}
        <PlayerStatus
          chessAscii={chessAscii}
          gameType={gameType}
          isReplay={this.props.isReplay}
          color={playerColor === "b" ? "w" : "b"}
          playMode={playMode}
          player={opponent}
        />
        <div
          className={"chessboardWrapper"}
          style={{ minWidth: chessWidth }}
          ref={this.wrapperRef}
        >
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              justifyContent: "start",
            }}
          >
            {!isSSR && (
              <React.Suspense fallback={<div />}>
                {this.state.isFastHide ? null : (
                  <this.chessboard
                    showNotation={true}
                    width={chessWidth}
                    position={this.game?.fen()}
                    onDrop={this.onDrop}
                    draggable={this.playerCanPlay()}
                    allowDrag={this.allowDrag}
                    orientation={playerColor === "b" ? "black" : "white"}
                    squareStyles={combinedSquareStyles}
                    onDragOverSquare={this.onDragOverSquare}
                    onSquareClick={this.onPieceClick}
                    //onPieceClick={this.onPieceClick}
                    darkSquareStyle={{
                      background: `${this.props.serverStatus.BoardEvenSquaresColor} 0% 0% no-repeat padding-box`,
                    }}
                    lightSquareStyle={{
                      background: `${this.props.serverStatus.BoardOddSquaresColor} 0% 0% no-repeat padding-box`,
                    }}
                    pieces={{
                      wP: (pieceProps) => (
                        <CustomPiece name={"wP"} {...pieceProps} />
                      ),
                      wN: (pieceProps) => (
                        <CustomPiece name={"wN"} {...pieceProps} />
                      ),
                      wB: (pieceProps) => (
                        <CustomPiece name={"wB"} {...pieceProps} />
                      ),
                      wR: (pieceProps) => (
                        <CustomPiece name={"wR"} {...pieceProps} />
                      ),
                      wQ: (pieceProps) => (
                        <CustomPiece name={"wQ"} {...pieceProps} />
                      ),
                      wK: (pieceProps) => (
                        <CustomPiece name={"wK"} {...pieceProps} />
                      ),
                      bP: (pieceProps) => (
                        <CustomPiece name={"bP"} {...pieceProps} />
                      ),
                      bN: (pieceProps) => (
                        <CustomPiece name={"bN"} {...pieceProps} />
                      ),
                      bB: (pieceProps) => (
                        <CustomPiece name={"bB"} {...pieceProps} />
                      ),
                      bR: (pieceProps) => (
                        <CustomPiece name={"bR"} {...pieceProps} />
                      ),
                      bQ: (pieceProps) => (
                        <CustomPiece name={"bQ"} {...pieceProps} />
                      ),
                      bK: (pieceProps) => (
                        <CustomPiece name={"bK"} {...pieceProps} />
                      ),
                    }}
                  />
                )}
              </React.Suspense>
            )}
            {this.props.isReplay && windowWidth < 768 && (
              <div
                style={{
                  width: "100%",
                  height: "10vh",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: "bolder",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                  onClick={this.props.onReplayPrevious}
                >
                  {"<"} Previous
                </p>

                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: "bolder",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                  onClick={this.props.onReplayNext}
                >
                  Next {">"}
                </p>
              </div>
            )}
          </div>
        </div>
        <PlayerStatus
          chessAscii={chessAscii}
          gameType={gameType}
          isReplay={this.props.isReplay}
          color={playerColor === "w" ? "w" : "b"}
          playMode={playMode}
          player={currentUser}
          reverse={true}
          name={getOpponentName(false, null, currentUser)}
        />
        {!playMode.isAI && (
          <Timer
            className="timer-mobile"
            timeLeft={playerColor === "w" ? timer?.white : timer?.black}
          />
        )}
      </div>
    );
  }
}

// const mapStateToProps = ({
//   user: { currentUser },
// }: IAppState): any => ({
//   currentUser
// });

const squareStyling = ({ pieceSquare }: any) => {
  return {
    [pieceSquare]: { background: "rgba(255, 255, 0, 0.4)" },
  };
};

export default ChessboardWrapper;
