import { Component, CSSProperties, LegacyRef, Ref, RefObject } from "react";
import React from "react";
import Chess, { ChessInstance, Square } from "chess.js";
import { Piece } from "chessboardjsx";
import Sounds from "../../lib/sound";
import Stockfish from "../../lib/stockfish";
import { IPieceMove } from "../ChessboardWrapper/interface";
import { isSSR } from "../../lib/utils";
import CustomPiece from "../CustomPiece";
import { getPiecePositions } from "../../helpers/getPiecePositions";
import PlayerStatus from "../ChessboardWrapper/PlayerStatus";
import { AI_PLAY_MODE } from "../../constants/playModes";
import { INITIAL_FEN } from "../../pages/game";
import { connect } from "react-redux";
import { IAppState } from "../../store/reducers";
import { IServerStatus, IUser } from "../../store/user/user.interfaces";
import {
  IMoveWithTimestamp,
  ISetPlayModePayload,
  ITimer,
} from "../../store/gameplay/gameplay.interfaces";
import { getGameType } from "../../helpers/gameTypeHelper";
import {
  GameRules,
  SpectatingGameRules,
} from "../../interfaces/game.interfaces";
import Timer from "../Timer";
const Chessboard = React.lazy(() => import("chessboardjsx"));
const WINDOW_WIDTH_LIMIT = 768;

interface IState {
  squareStyles: { [square in Square]?: CSSProperties };
  dropSquareStyle: CSSProperties;
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
  timerLimit: number;
  timerBonus: number;
  opponent: IUser;
  //   onGameEnd: (winner: "b" | "w" | "draw") => void;
  chessSize?: number;
  host: IUser;
  timer: ITimer;
  isReplay: boolean;
  playMode: ISetPlayModePayload;
  gameRules: GameRules;
  moveHistoryData: IMoveWithTimestamp[];
  serverStatus: IServerStatus;
  onReplayPrevious: () => void;
  onSetLive: () => void;
  onGameEnd: (
    winner: "b" | "w" | "draw",
    isReplay: boolean,
    calledByChessboard: boolean
  ) => void;
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
  onReplayNext: () => void;
  winner: "b" | "w" | "draw";
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
  moveSound: boolean = false;
  captureSound: boolean = false;
  checkSound: boolean = false;
  checkmateSound: boolean = false;
  stalemateSound: boolean = false;

  componentDidMount() {
    this.game = new (Chess as any)(this.props.fen);
    this.chessboard = Chessboard;
    this.forceUpdate();
    // if (this.props.isAI) {
    //   Stockfish.init(
    //     skillLevel,
    //     maximumError,
    //     probability,
    //     playerColor,
    //     this.game,
    //     this.handleMove,
    //     this.props.aiDifficulty
    //   );
    // }
  }

  componentWillReceiveProps(nextProps: IProps) {
    console.log("nextProps", nextProps);
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
    // if (!this.props.isAI && nextProps.isReplay) {
    //   this.forceUpdate();
    // } else if (!this.props.isAI) return;
    // if (!nextProps.fen && this.props.playerColor !== "w") {
    //   Stockfish.handleAIPlay();
    // }
  }

  handleMove = (nextMove: IPieceMove | string, isAI?: boolean) => {
    if (
      nextMove &&
      this.props.playerColor &&
      this.props.playerColor !== this.game.turn() &&
      !isAI
    ) {
      return;
    }
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
    if (move === null) {
      return;
    }
    console.log(this.game.fen());
    const { from: sourceSquare, to: targetSquare } = move;

    this.setSquareStylesExceptions({ sourceSquare, targetSquare });
    // alert(this.game.in_checkmate());
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

    // this.forceUpdate(() => {
    const moveHistory =
      this.game.history().length > 1
        ? this.game.history()[1]
        : this.game.history()[0];
    const newFen = this.game.fen();
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
    // });
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
        console.log("hello move");
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
      this.setSquareStylesExceptions({
        color: this.game.turn() === "b" ? "w" : "b",
      });
      this.checkSound = false;
    }
    if (this.checkmateSound) {
      setTimeout(async () => {
        this.props.onGameEnd(
          this.game.turn() === "b" ? "w" : "b",
          this.props.isReplay,
          true
        );
        await Sounds.checkmate();
      }, 300);
      this.setSquareStylesExceptions({
        color: this.props.winner === "b" ? "w" : "b",
      });
      this.checkmateSound = false;
    }

    if (this.stalemateSound) {
      setTimeout(async () => {
        this.props.onGameEnd("draw", this.props.isReplay, true);
        await Sounds.stalemate();
      }, 300);
      this.stalemateSound = false;
    }
  }

  render() {
    console.log(this.game?.fen());
    const { squareStyles, squareStylesExceptions } = this.state;
    const {
      playerColor,
      opponent,
      timerLimit,
      timerBonus,
      playMode,
      timer,
      gameRules,
      host,
      ...restProps
    } = this.props;

    let windowWidth = 1280;
    if (!isSSR) windowWidth = window.innerWidth;
    const gameType = getGameType(gameRules.time.base);
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
        {!this.props.isReplay && (
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
                    draggable={false}
                    orientation={playerColor === "b" ? "black" : "white"}
                    squareStyles={combinedSquareStyles}
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
            {windowWidth < 768 && (
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

                {!this.props.isReplay && (
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: "bolder",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                    onClick={this.props.onSetLive}
                  >
                    Live
                  </p>
                )}
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
          player={host}
          reverse={true}
        />
        {!this.props.isReplay && (
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

export default ChessboardWrapper;
