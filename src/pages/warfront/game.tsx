import React, { Component, ForwardRefRenderFunction } from "react";
import Chess, { ChessInstance, Square } from "chess.js";
import Stockfish from "../../lib/stockfish";
import SocketService from "../../services/socket.service";
import { ISetPlayModePayload } from "../../store/gameplay/gameplay.interfaces";
import { IAppState } from "../../store/reducers";
import { IServerStatus, IUser } from "../../store/user/user.interfaces";
import { connect } from "react-redux";
import { Actions as GameplayActions } from "../../store/gameplay/gameplay.action";
import { navigate } from "gatsby";
//import { squares } from "../../helpers/selectors";
import { INITIAL_FEN } from "./../../constants/playModes";

import {
  GameRules,
  IMoveSocket,
  MovePieceEnum,
} from "../../interfaces/game.interfaces";

import {
  IGameplayElos,
  ITimer,
  IMoveWithTimestamp,
} from "../../store/gameplay/gameplay.interfaces";

import "./index.scss";
import WarFrontToast from "../../components/WarfrontToast";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

interface IPieceMove {
    sourceSquare: Square,
    targetSquare: Square
}

interface ISelectProps {
  playMode: ISetPlayModePayload;
  opponent: IUser;
  playerColor: "b" | "w";
  isReplay: boolean;
  gameRules: GameRules;
  missedSocketActions: any[];
  isResume: boolean;
  gameFen: string;
  currentUser: IUser;
  timer: ITimer;
  firstTimer: ITimer;
  winner: "b" | "w";
  gameElos: IGameplayElos;
  moveHistoryData: string[];
  moveHistoryTimestamp: IMoveWithTimestamp[];
  serverStatus: IServerStatus;
}


interface IActionProps {
  setOnMove: typeof GameplayActions.onMove;
  addInMoveHistory: typeof GameplayActions.addInMoveHistory;
  setOpponent: typeof GameplayActions.setOpponent;
  setPlayerColor: typeof GameplayActions.setPlayerColor;
  setLastTimestamp: typeof GameplayActions.setLastTimestamp;
  setFirstMoveTimer: typeof GameplayActions.setFirstMoveTimer;
  setFirstTimer: typeof GameplayActions.setFirstTimer;
  clear: typeof GameplayActions.clear;
  setLoseMatchForLeaving: typeof GameplayActions.setLoseMatchForLeaving;
  stopTimers: typeof GameplayActions.stopTimers;
  addToHistoryWithTimestamp: typeof GameplayActions.addToHistoryWithTimestamp;
  setReplay: typeof GameplayActions.setReplay;
  setMoveHistory: typeof GameplayActions.setMoveHistory;
  setGameEndDate: typeof GameplayActions.setGameEndDate;
  setGameWinner: typeof GameplayActions.setGameWinner;
  startGame: typeof GameplayActions.startGame;
  setGameElos: typeof GameplayActions.setGameElos;
  setMissedSocketActions: typeof GameplayActions.setMissedSocketActions;
  setGameMounted: typeof GameplayActions.setGameMounted;
}

interface IState {
  drawTimes: number;
  skillLevel: number;
  maximumError: number;
  probability: number;
  timerLimit: number;
  timerBonus: number;
  screen: "INTRO" | "AI_SETTINGS" | "AI_GAME" | "ROOMS";
  showEndModal: boolean;
  winner: "b" | "w" | "draw";
  showDrawModal: boolean;
  showAwaitingDrawModal: boolean;
  showOpponentLeftModal: boolean;
  showAbortModal: boolean;
  playerName: string;
  showFirstMoveTime: boolean;
  gameStart: boolean;
  hasGameLoaded: boolean;
}

const GameObj = "StateManager";
const AI_PLAY_DELAY = 1500;

class Game extends Component <IActionProps & ISelectProps & IPieceMove> {
  fen: string = INITIAL_FEN;
  oldFen: string = INITIAL_FEN;
  previousFen: string = INITIAL_FEN;
  replayTimeout: NodeJS.Timer = null;
  game: ChessInstance;
  unityInstance: any;
  token: string = "";
  state: IState = {
    drawTimes: 0,
    skillLevel: 20,
    maximumError: 0,
    probability: 0,
    timerLimit: 5,
    timerBonus: 3,
    screen: "AI_GAME",
    showEndModal: false,
    winner: null,
    showDrawModal: false,
    showAwaitingDrawModal: false,
    showOpponentLeftModal: false,
    showAbortModal: false,
    playerName: "",
    showFirstMoveTime: true,
    gameStart: false,
    hasGameLoaded: false
  };

  constructor(props: any) {
    super(props);
  }

  componentDidMount(): void {
    // When the component is mounted, we'll register some event listener.
    const { playerColor, playMode } = this.props;

    //if(!playMode) navigate("/warfront");

    const { aiMode, isAI, isCreate, isHumanVsHuman } = playMode;
    const Window = window as any;
    this.game = new (Chess as any)();

    this.forceUpdate();
    this.loadUnity();

    if (isAI) {

      Stockfish.init(
        null,
        null,
        null,
        playerColor,
        this.game,
        this.handleMove,
        aiMode // to be edited later on
      );

      //start AI game
      SocketService.sendData(
        "start-ai-game",
        aiMode,
        (token: string) => {
          this.token = token;
        }
      );

      this.setState( { gameStart: true })

    } else {

      this.initialize();

    }

    Window.getPossibleAns = (from: Square) => {

      if(this.state.gameStart) {
  
        if (!this.playerCanPlay()) {
          return "[]";
        }

        const moves = this.game.moves({
          square: from,
          verbose: true,
        });

        // exit if there are no moves available for this square
        if (moves.length === 0) {
          return "[]";
        }
        return JSON.stringify(moves.map((m) => m.to));
      }

      toast(<WarFrontToast title={"GAME NOT READY"} text={"Wait For Opponent"} instruction="" />);

      return "[]"
     
    };

    Window.move = (from: Square, to: Square) => {

      if(this.state.gameStart) {

        console.log("move from", from);
        console.log("move to", to);

        if(playMode.isHumanVsHuman) {
          this.handleMultiplayerMove(this.fen, playerColor, to);
        } else {
          this.handleMove({ sourceSquare: from, targetSquare: to });
        }

      } else {

        toast(<WarFrontToast title={"GAME NOT READY"} text={"Wait For Opponent"} instruction="" />)

      }

    };

    Window.promote = (side: string, which: string, where: string) => {

      if (this.state.gameStart) {
        console.log(side, which, where);
        this.handleMultiplayerMove(which === "white" ? "w" : "b", where);
      } else {
        toast(<WarFrontToast title={"GAME NOT READY"} text={"Wait For Opponent"} instruction="" />);
      }

    };

  }


  initialize = () => {

    //if (playMode.isHumanVsHuman) {
    SocketService.subscribeTo({
      eventName: "game-timeout",
      callback: (params: { winner: IUser }) => {
        const { opponent, playerColor } = this.props;
        let winner = playerColor;
        if (opponent?.Id && opponent.Id === params?.winner?.Id) {
          winner = playerColor === "w" ? "b" : "w";
        } else if (
          opponent?.GuestId &&
          opponent.GuestId === params?.winner?.GuestId
        ) {
          winner = playerColor === "w" ? "b" : "w";
        } else if (!params.winner) {
          winner = null;
        }
        this.props.stopTimers();
        // this.idTimeoutShowModal = setTimeout(
        //   () => this.setState({ showEndModal: true, winner }),
        //   2000
        // );
        console.log("game-timeout:", params);
      },
    });

    SocketService.subscribeTo({
      eventName: "game-ready",
      callback: this["game-ready"],
    });

    SocketService.subscribeTo({
      eventName: "move-piece",
      callback: this["move-piece"],
    });

    SocketService.subscribeTo({
      eventName: "resign",
      callback: this.resign,
    });
    SocketService.subscribeTo({
      eventName: "answer-draw-request",
      callback: this["answer-draw-request"],
    });
    SocketService.subscribeTo({
      eventName: "request-draw",
      callback: this["request-draw"],
    });

    SocketService.subscribeTo({
      eventName: "game-cancelled",
      callback: this["game-cancelled"],
    });

    SocketService.subscribeTo({
      eventName: "leave-game-prompt",
      callback: this["leave-game-prompt"],
    });

  };

  playerCanPlay = (): boolean => {

    if (this.props.isReplay) {
      return false;
    }
    return this.props.playerColor === this.game?.turn();
  };

  getMove = (nextMove: any) => {

    if(this.props.playMode.isHumanVsHuman) {
      
      // see if the move is legal
      return this.game.move(
        typeof nextMove === "string"
          ? nextMove
          : {
              from: nextMove.sourceSquare,
              to: nextMove.targetSquare,
              promotion: "q", // always promote to a queen for example simplicity
            }
      );

    }

      // see if the move is legal
      return this.game.move(
        typeof nextMove === "string"
          ? nextMove
          : {
              from: nextMove.sourceSquare,
              to: nextMove.targetSquare,
              promotion: "q", // always promote to a queen for example simplicity
            }
      );


  }

  handleMultiplayerMove = (
    fen: string,
    playerOnMove: string,
    move?: string,
    shouldRerender?: boolean,
    isCheck?: boolean,
    isCheckmate?: boolean,
    isDraw?: boolean,
    isRepetition?: boolean,
    isStalemate?: boolean
  ): void => {
    
    const {
      playMode: { isHumanVsHuman },
      playerColor,
      isReplay,
    } = this.props;


    //if (!isReplay && isHumanVsHuman && move && playerOnMove !== playerColor) {
    if (isHumanVsHuman && move //&& playerOnMove !== playerColor
    ) {
      SocketService.sendData("move-piece", move, (movePiece: MovePieceEnum) => {
        console.log("move-piece:", movePiece, MovePieceEnum);
        switch (movePiece) {
          case MovePieceEnum.OK:
            return;
          case MovePieceEnum.GameNotFound:
          case MovePieceEnum.GameNotStarted:
            navigate("/warfront");
            return;
          case MovePieceEnum.NotAValidMove:
          case MovePieceEnum.NotYourTurn:
            this.forceUpdate();
            return;
        }
      });
    }
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

    // illegal move
    if (move === null) {
      return;
    }

    const newFen = this.game.fen();

    if (move.promotion) {
      this.unityInstance.SendMessage(
        GameObj,
        "OnPromoted",
        JSON.stringify({
          side: this.game.turn() !== "w" ? "white" : "black",
          which: move.promotion,
          where: nextMove.targetSquare,
        })
      );
    }

    if (this.game.in_checkmate()) {
      this.unityInstance.SendMessage(
        GameObj,
        "OnCheckmate",
        this.game.turn() !== "w" ? "white" : "black"
      );
    } else if (this.game.in_check()) {
      this.unityInstance.SendMessage(
        GameObj,
        "OnCheck",
        this.game.turn() !== "w" ? "white" : "black"
      );
    } else if (
      this.game.in_stalemate() ||
      this.game.in_draw() ||
      this.game.in_threefold_repetition()
    ) {
      this.unityInstance.SendMessage(GameObj, "OnDraw");
    }
    
    this.unityInstance?.SendMessage(
      GameObj,
      "OnMoved",
      JSON.stringify({ from: move.from, to: move.to })
    );

    //debugger

    const moveHistory =
    this.game.history().length > 1
      ? this.game.history()[1]
      : this.game.history()[0];

    this.handleMultiplayerMove(
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

    if (isAI) {
      this.forceUpdate();
  
    } else {
      // get distance moved
      const delay = Math.abs(Number(move.from[1]) - Number(move.to[1])) * AI_PLAY_DELAY;

      this.forceUpdate(() => {
      if (this.props.playMode.isAI) {
          setTimeout(() => {
            Stockfish.handleAIPlay();
          }, delay);
        }
      });
    }

  };

  loadUnity = () => {
    var loaderUrl = "../Chess3D/Chess3D.loader.js";
    var config = {
      dataUrl: "../Chess3D/Chess3D.data",
      frameworkUrl: "../Chess3D/Chess3D.framework.js",
      codeUrl: "../Chess3D/Chess3D.wasm",
      streamingAssetsUrl: "StreamingAssets",
      companyName: "MetaChess",
      productName: "Projecthess 3D",
      productVersion: "1.0.0",
    };
    var script = document.createElement("script");
    script.src = loaderUrl;
    var canvas = document.querySelector("#unity-canvas");

    script.onload = () => {
      (window as any)
      .createUnityInstance(canvas, config)
        .then((unityInstance: any) => {
          this.unityInstance = unityInstance;
          this.unityInstance.SendMessage(
            GameObj,
            "OnInit",
            JSON.stringify({ myTurn: true })
          );

          this.setState( { hasGameLoaded: true })

          if (this.props.moveHistoryData.length > 1) {
            this.setState({ showFirstMoveTime: false });
          }

          if (this.props.isReplay) this.doReplay();
          else if (this.props.playMode.isHumanVsHuman) {

            setTimeout(() => {
              SocketService.sendData("game-ready", null, null);
            }, 10000)

            if (this.props.isResume) {

              this.fen = this.props.gameFen ?? INITIAL_FEN;
              this.forceUpdate();

            } else {
              this.props.missedSocketActions.forEach((t) => {

                if (t && t[0]) {
                  // @ts-ignore
                  // @ts-nocheck
                  this[t[0]](t[1]);
                }

              });

            }

          }

        }).catch((message: any) => {

          console.log(message);

          toast(<WarFrontToast title={"Game Error"} text={" Error Loading Game "} instruction="" />)

          setTimeout(() => {
            navigate("/warfront")
          }, AI_PLAY_DELAY)

        });
    };
    console.log(script);
    document.body.appendChild(script);

  };


  ["game-timeout"] = (params: { winner: IUser }) => {
    //unityContext.send(GameObj, "Timeout", JSON.stringify(params));
    //this.unityInstance.send(GameObj, "Timeout", JSON.stringify(params));
  };

  ["game-cancelled"] = () => {
    toast(<WarFrontToast title={"Game Cancelled"} text={"Time Out"} instruction="" />)

    setTimeout(() => {
      navigate("/warfront")
    }, AI_PLAY_DELAY)

  };


  ["game-ready"] = () => {
    this.setState( { gameStart: true })

    let instruction = "Opponent Turn";

    if (this.playerCanPlay()) {
      instruction = "Your Turn"
    }

    toast(<WarFrontToast title={"GAME START "} text={"MATCH START!!!"} instruction={instruction} />)
  
  }

  ["resign"] = ({ winner }: any) => {
    this.onGameEnd(
      winner.Id === this.props.currentUser.Id &&
        winner.GuestId === this.props.currentUser.GuestId
        ? this.props.playerColor
        : this.props.playerColor === "w"
        ? "b"
        : "w"
    );
  };

  ["move-piece"] = (move: IMoveSocket) => {

    const { opponent, moveHistoryData } = this.props;

    if (
      opponent &&
      ((opponent.Id && opponent.Id === move.player?.Id) ||
        (opponent.GuestId && opponent.GuestId === move.player?.GuestId))
    ) {

      this.handleMove(move.move as string, true);

    }

    this.props.addToHistoryWithTimestamp({
      move: move.move,
      timestamp: move.timestamp,
    });

    if (moveHistoryData.length === 1) {
      this.props.setFirstMoveTimer();
    }

    if (moveHistoryData.length > 1) {
      this.setState({ showFirstMoveTime: false });
      this.props.setLastTimestamp(move.timestamp);
    }

    console.log("on move-piece::", move);
  };


  ["answer-draw-request"] = () => {

  };

  ["request-draw"] = () => {

  }

  ["leave-game-prompt"] = () => {

  }

  handleUnityMovePiece = (source: string, target: string) => {
    console.log("handleUnityMovePiece source", source);
    console.log("handleUnityMovePiece target", target);
    // Logic to validate the move
    // ----------------

    // Update the status on Unity
    
    // unityContext.send(
    //   GameObj,
    //   "UpdateMoveStatus",
    //   JSON.stringify({
    //     source,
    //     target,
    //     valid: true,
    //     status: "check",
    //   })
    // );

    this.unityInstance.send(
      GameObj,
      "OnMoved",
      JSON.stringify({
        source,
        target,
//        valid: true,
//        status: "check",
      })
    );

  };

  componentWillUnmount(): void {
    // this.unityContext.removeAllEventListeners();
    //this.unityInstance.removeAllEventListeners();
  }

  doReplay = async (
    fen?: string,
    last?: number,
    moveHistory?: string[],
    onMove?: string
  ) => {
    /*
    this.fen = fen || INITIAL_FEN;
    this.oldFen = fen || INITIAL_FEN;

    this.props.setReplay(true);
    this.props.setOnMove(onMove || "w");
    this.props.setLastTimestamp(last || 0);
    this.props.setMoveHistory(moveHistory || []);

    this.forceUpdate(this.realReplay);
    */
  };


  onGameEnd = (
    winner: "b" | "w" | "draw",
    isReplay = false,
    calledByChessboard?: boolean
  ) => {
    this.props.stopTimers();

    if (calledByChessboard) {
    //   this.idTimeoutShowModal = setTimeout(
    //     () => this.setState({ showEndModal: true, winner }),
    //     2000
    //   );
    } else {
      this.setState({ showEndModal: true, winner });
    }

    if (!isReplay && this.props.playMode.isHumanVsHuman) {
      this.props.setGameEndDate(Date.now());
      this.props.setGameWinner(winner);
    }
  };


  render() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    return (
      <>
        <div className="warfront-page">
          { !this.state.hasGameLoaded && <Loader /> }
          <canvas id="unity-canvas" width={width * 0.7 } height={height * 0.8 }></canvas>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: IAppState): ISelectProps => ({
  playMode: state.gameplay.playMode,
  opponent: state.gameplay.opponent,
  playerColor: state.gameplay.playerColor,
  isReplay: state.gameplay.isReplay,
  timer: state.gameplay.timer,
  firstTimer: state.gameplay.firstTimer,
  gameRules: state.gameplay.gameRules,
  gameElos: state.gameplay.gameElos,
  missedSocketActions: state.gameplay.missedSocketActions,
  isResume: state.gameplay.isResume,
  gameFen: state.gameplay.gameFen,
  winner: state.gameplay.winner,
  currentUser: state.user.currentUser,
  moveHistoryData: state.gameplay.moveHistory,
  moveHistoryTimestamp: state.gameplay.historyWithTimestamp,
  serverStatus: state.user.serverStatus,
});

const connected = connect<IActionProps>( mapStateToProps as any,{
    setOnMove: GameplayActions.onMove,
    addInMoveHistory: GameplayActions.addInMoveHistory,
    setOpponent: GameplayActions.setOpponent,
    setPlayerColor: GameplayActions.setPlayerColor,
    setLastTimestamp: GameplayActions.setLastTimestamp,
    setFirstMoveTimer: GameplayActions.setFirstMoveTimer,
    setFirstTimer: GameplayActions.setFirstTimer,
    stopTimers: GameplayActions.stopTimers,
    clear: GameplayActions.clear,
    addToHistoryWithTimestamp: GameplayActions.addToHistoryWithTimestamp,
    setReplay: GameplayActions.setReplay,
    setMoveHistory: GameplayActions.setMoveHistory,
    setGameEndDate: GameplayActions.setGameEndDate,
    setGameWinner: GameplayActions.setGameWinner,
    setGameElos: GameplayActions.setGameElos,
    startGame: GameplayActions.startGame,
    setMissedSocketActions: GameplayActions.setMissedSocketActions,
    setLoseMatchForLeaving: GameplayActions.setLoseMatchForLeaving,
    setGameMounted: GameplayActions.setGameMounted,
  }
)(Game);

export default connected;
