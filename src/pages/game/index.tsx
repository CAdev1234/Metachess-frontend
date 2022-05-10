/**
 * Note This route is no longer need and show be deleted next time.
 * I am just keeping it so i won't break anything.
 * This page is now hosted in /2d/game/
 */


import React, { Component } from "react";
import ChessboardWrapper from "../../components/ChessboardWrapper";
import SocketService from "../../services/socket.service";
import WinModal from "../../components/WinModal";
import { connect } from "react-redux";
import { Actions as GameplayActions } from "../../store/gameplay/gameplay.action";
import { Actions as UserActions } from "../../store/user/user.action";
import GameInfo from "../../components/ChessboardWrapper/GameInfo";
import { PageProps } from "gatsby";
import {
  ISetPlayModePayload,
  IGameplayElos,
  ITimer,
  IMoveWithTimestamp,
} from "../../store/gameplay/gameplay.interfaces";
import { IAppState } from "../../store/reducers";
import {
  GameRules,
  IMoveSocket,
  MovePieceEnum,
  ISpectSocket,
} from "../../interfaces/game.interfaces";
import MovesHistory from "../../components/MovesHistory";
import { IServerStatus, IUser } from "../../store/user/user.interfaces";
import { getOpponentName } from "../../helpers/getOpponentNameByPlayMode";
import { navigate } from "gatsby";
import { isSSR } from "../../lib/utils";
import store from "../../store";
import RequestDrawModal from "../../components/RequestDrawModal";
import AbortGameModal from "../../components/AbortGameModal";
import OpponentLeftModal from "../../components/OpponentLeftModal";
import { getGameTypeElo } from "../../helpers/gameTypeHelper";
import ActionButtons from "../../components/ActionButtons";
import API from "../../services/api.service";
import { ENDPOINTS } from "../../services/endpoints";
import SpectatorsDisplay from "../../components/SpectatorsDisplay";
import TOKEN from "../../services/token.service";

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
}

interface IActionProps {
  setOnMove: typeof GameplayActions.onMove;
  addInMoveHistory: typeof GameplayActions.addInMoveHistory;
  setOpponent: typeof GameplayActions.setOpponent;
  setPlayerColor: typeof GameplayActions.setPlayerColor;
  setLastTimestamp: typeof GameplayActions.setLastTimestamp;
  setFirstMoveTimer: typeof GameplayActions.setFirstMoveTimer;
  setCurrentUser: typeof UserActions.setCurrentUser;
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
  setTimer: typeof GameplayActions.setManualTimer;
  setMissedSocketActions: typeof GameplayActions.setMissedSocketActions;
  setGameMounted: typeof GameplayActions.setGameMounted;
  setSpectators: typeof GameplayActions.setSpectators;
  setGameChatShow: typeof GameplayActions.setGameChatShow;
  setGameChatOpen: typeof GameplayActions.setGameChatOpen;
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
  gameStarted: boolean;
  spectList: Partial<IUser>[];
}

export const INITIAL_FEN = `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`;

class Game extends Component<IActionProps & ISelectProps & PageProps, IState> {
  fen: string = INITIAL_FEN;
  oldFen: string = INITIAL_FEN;
  previousFen: string = INITIAL_FEN;
  replayTimeout: NodeJS.Timer = null;
  token: string = "";
  chessboardWrapperRef = React.createRef<ChessboardWrapper>();
  // currentReplayIndex: number = React.createRef<number>().current;
  currentReplayIndex: number = 0;
  initialized: boolean = false;
  spectList: string[] = [];

  unmounted = false;

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
  };

  idTimeoutShowModal: NodeJS.Timeout = null;
  constructor(props: any) {
    super(props);
    this.onResign = this.onResign.bind(this);
    // this.currentReplayIndex = 0;
  }

  componentDidMount() {
    if (!this.props.playMode) {
      return;
    }
    // if (this.props.playMode.isHumanVsHuman || !this.props.playMode.isAI)
    if (this.props.playMode.isAI) {
      SocketService.sendData(
        "start-ai-game",
        this.props.playMode.aiMode,
        (token: string) => {
          this.token = token;
        }
      );
    }
    if (this.props.moveHistoryData.length > 1) {
      this.setState({ showFirstMoveTime: false });
    }
    if (this.props.isReplay) this.doReplay();
    else if (this.props.playMode.isHumanVsHuman) {
      SocketService.sendData("game-ready", null, null);
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
      // this.props.setFirstTimer(25000);
    }

    this.props.setGameMounted(true);
  }

  componentWillUnmount() {
    this.unmounted = true;
    // this.props.clear();
    clearTimeout(this.idTimeoutShowModal);
    clearTimeout(this.replayTimeout);
    this.props.setGameChatOpen(false);
    this.props.setGameChatShow(false);
    if (
      !this.state.winner &&
      this.props.playMode &&
      !this.props.isReplay &&
      !this.props.playMode.isAI
    ) {
      console.log(
        "leaving game",
        [
          !this.state.winner ,
          this.props.playMode ,
          !this.props.isReplay ,
          !this.props.playMode.isAI
        ]
      )
      SocketService.sendData("leave-game", null, null);
      this.props.setLoseMatchForLeaving({
        opponentName: getOpponentName(false, null, this.props.opponent),
        eloLost: this.props.gameElos.eloLose,
        eloDraw: this.props.gameElos.eloDraw,
      });
    }
    if (this.props.playMode && this.props.playMode.isAI) {
      SocketService.sendData("leave-ai-game", null, null);
      API.execute(
        "POST",
        ENDPOINTS.POST_AI_GAME_DATA,
        {
          Key: this.token,
          Result:
            this.state.winner === this.props.playerColor
              ? 1
              : this.state.winner === null || this.state.winner === "draw"
              ? 3
              : 2,
          PieceSide: this.props.playerColor === "w" ? 1 : 2,
          BoardMoves: this.props.moveHistoryTimestamp,
        },
        null,
        null,
        { headers: { Authorization: TOKEN.user || TOKEN.guest } }
      );
      if (this.state.winner === this.props.playerColor) {
        this.props.setCurrentUser({
          ...this.props.currentUser,
          HighestAIGameLevelWon:
            this.props.currentUser.HighestAIGameLevelWon + 1,
        });
      }
    }
    this.props.setGameElos(null);
  }

  onDrawRequested = () => {
    this.setState({
      showDrawModal: true,
    });
  };

  onCancelledGame = (playerName: string) => {
    this.setState({ showAbortModal: true, playerName });
  };

  initialize = () => {
    const { playMode } = this.props;

    if (playMode.isHumanVsHuman) {
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
          this.idTimeoutShowModal = setTimeout(
            () => this.setState({ showEndModal: true, winner }),
            2000
          );
          console.log("game-timeout:", params);
        },
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
        eventName: "game-cancelled-player-not-ready",
        callback: this["game-cancelled"],
      });
      SocketService.subscribeTo({
        eventName: "spectators-update",
        callback: this["spectators-update"],
      });
      SocketService.subscribeTo({
        eventName: "leave-game-prompt",
        callback: this["leave-game-prompt"],
      });
    }
  };

  ["move-piece"] = (move: IMoveSocket) => {
    console.log("MOVE:", move);
    if (!this.chessboardWrapperRef?.current) {
      return;
    }

    const { opponent, moveHistoryData } = this.props;

    console.log(opponent, moveHistoryData, this.props);
    let playerIsHost: boolean = move.playerIsHost;
    if (
      opponent &&
      this.chessboardWrapperRef?.current &&
      ((opponent.Id && opponent.Id === move.player?.Id) ||
        (opponent.GuestId && opponent.GuestId === move.player?.GuestId))
    ) {
      this.chessboardWrapperRef?.current?.handleMove(move.move as string, true);
      playerIsHost = !playerIsHost;
    }
    this.props.addToHistoryWithTimestamp({
      move: move.move,
      timestamp: move.timestamp,
      fen: move.fen,
      isCheck: move.isCheck,
      isCheckmate: move.isCheckmate,
      isDraw: move.isDraw,
      isRepetition: move.isRepetition,
      isStalemate: move.isStalemate,
    });

    if (moveHistoryData.length === 1) {
      this.props.setFirstMoveTimer();
    }

    if (moveHistoryData.length > 1) {
      this.setState({ showFirstMoveTime: false });
      this.props.setLastTimestamp(move.timestamp);
      let timer: ITimer;
      if (this.props.playerColor === "b") {
        if (playerIsHost)
          timer = {
            white: move.secondPlayerTimeLeft,
            black: move.hostTimeLeft,
          };
        else {
          timer = {
            white: move.hostTimeLeft,
            black: move.secondPlayerTimeLeft,
          };
        }
      } else {
        if (playerIsHost)
          timer = {
            white: move.hostTimeLeft,
            black: move.secondPlayerTimeLeft,
          };
        else {
          timer = {
            white: move.secondPlayerTimeLeft,
            black: move.hostTimeLeft,
          };
        }
      }
      this.props.setTimer(timer);
    }

    console.log("on move-piece::", move);
  };

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

  ["spectators-update"] = (spectList: Array<Partial<IUser>>) => {
    console.log("SPECTLIST->>>>", spectList);
    this.props.setSpectators(spectList);
  };

  ["answer-draw-request"] = (drawAccepted: boolean) => {
    this.setState({
      showAwaitingDrawModal: false,
      showDrawModal: false,
    });
    if (drawAccepted) this.onGameEnd("draw");
  };

  ["request-draw"] = () => {
    this.onDrawRequested();
  };

  ["game-cancelled"] = () => {
    const { moveHistoryData, playerColor, opponent, currentUser } = this.props;
    if (moveHistoryData.length === 0) {
      let xPlayer = "";
      if (playerColor === "w") {
        xPlayer = currentUser.Username || "You";
      } else {
        xPlayer = opponent.Username || "Guest";
      }
      this.onCancelledGame(xPlayer);
    }
    if (moveHistoryData.length === 1) {
      let xPlayer = "";
      if (playerColor === "b") {
        xPlayer = currentUser.Username || "You";
      } else {
        xPlayer = opponent.Username || "Guest";
      }
      this.onCancelledGame(xPlayer);
    }
  };

  ["leave-game-prompt"] = () => {
    this.setState({
      showOpponentLeftModal: true,
    });
  };

  handleMove = (
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
    if (this.unmounted) {
      return;
    }
    const {
      playMode: { isHumanVsHuman },
      playerColor,
      isReplay,
    } = this.props;
    this.fen = fen;
    if (move) {
      this.props.addInMoveHistory(move);
    }
    if (!isReplay && isHumanVsHuman && move && playerOnMove !== playerColor) {
      SocketService.sendData("move-piece", move, (movePiece: MovePieceEnum) => {
        console.log("move-piece:", movePiece, MovePieceEnum);
        switch (movePiece) {
          case MovePieceEnum.OK:
            this.oldFen = fen;
            return;
          case MovePieceEnum.GameNotFound:
          case MovePieceEnum.GameNotStarted:
            navigate("/");
            return;
          case MovePieceEnum.NotAValidMove:
          case MovePieceEnum.NotYourTurn:
            this.fen = this.oldFen;
            this.forceUpdate();
            return;
        }
      });
    } else if (!isReplay && move) {
      this.props.addToHistoryWithTimestamp({
        move: move,
        timestamp: new Date().getTime(),
        fen,
        isCheck,
        isCheckmate,
        isDraw,
        isRepetition,
        isStalemate,
      });
    }
    this.props.setOnMove(playerOnMove);
    if (shouldRerender) {
      this.forceUpdate();
    }
  };

  onGameEnd = (
    winner: "b" | "w" | "draw",
    isReplay = false,
    calledByChessboard?: boolean
  ) => {
    this.props.stopTimers();

    if (calledByChessboard) {
      this.idTimeoutShowModal = setTimeout(
        () => this.setState({ showEndModal: true, winner }),
        2000
      );
    } else {
      this.setState({ showEndModal: true, winner });
    }

    if (!isReplay && this.props.playMode.isHumanVsHuman) {
      this.props.setGameEndDate(Date.now());
      this.props.setGameWinner(winner);
    }
  };

  doReplay = async (
    fen?: string,
    last?: number,
    moveHistory?: string[],
    onMove?: string
  ) => {
    this.fen = fen || INITIAL_FEN;
    this.oldFen = fen || INITIAL_FEN;

    this.props.setReplay(true);
    this.props.setOnMove(onMove || "w");
    this.props.setLastTimestamp(last || 0);
    this.props.setMoveHistory(moveHistory || []);

    this.forceUpdate(this.realReplay);
  };

  recursiveReplayFunction = (index: number) => {
    const {
      gameplay: { historyWithTimestamp },
    } = store.getState() as IAppState;
    if (index === historyWithTimestamp.length) {
      const {
        gameplay: { winner },
      } = store.getState() as IAppState;
      this.onGameEnd(winner, true);
      return;
    }
    const m = historyWithTimestamp[index];
    console.log(this.currentReplayIndex, index);
    this.chessboardWrapperRef?.current?.handleMove(m.move as string, true);
    this.props.setLastTimestamp(m.timestamp);
    this.currentReplayIndex = index + 1;
    this.replayTimeout = setTimeout(
      () => this.recursiveReplayFunction(index + 1),
      2000
    );
  };

  realReplay = async () => {
    this.props.startGame();
    this.recursiveReplayFunction(0);
  };

  onResign() {
    if (this.props.isReplay || this.state.winner) return;
    SocketService.sendData("resign", null, () => {
      this.onGameEnd(this.props.playerColor === "b" ? "w" : "b");
    });
  }

  onDrawRequest = () => {
    if (this.props.isReplay || this.state.winner) return;
    const { drawTimes } = this.state;
    if (drawTimes < 5) {
      SocketService.sendData("request-draw", null, () => {
        this.setState({
          drawTimes: drawTimes + 1,
          showAwaitingDrawModal: true,
        });
      });
    }
  };

  userRequestedDrawTimeout = () => {
    this.setState({
      showDrawModal: false,
      showAwaitingDrawModal: false,
    });
  };

  cancelDraw = () => {
    SocketService.sendData("answer-draw-request", false, () => {
      this.setState({
        showDrawModal: false,
        showAwaitingDrawModal: false,
      });
    });
  };

  confirmDraw = () => {
    SocketService.sendData("answer-draw-request", true, () => {
      this.setState({
        showDrawModal: false,
        showAwaitingDrawModal: false,
      });
      this.onGameEnd("draw");
    });
  };

  onReplayNext = () => {
    if (this.currentReplayIndex === this.props.moveHistoryTimestamp.length)
      return;
    clearTimeout(this.replayTimeout);
    this.props.setOnMove(this.currentReplayIndex % 2 === 0 ? "w" : "b");
    this.props.setMoveHistory(
      this.props.moveHistoryData.slice(0, this.currentReplayIndex)
    );
    this.fen = this.props.moveHistoryTimestamp[this.currentReplayIndex].fen;
    this.props.setLastTimestamp(
      this.props.moveHistoryTimestamp[this.currentReplayIndex].timestamp
    );
    this.recursiveReplayFunction(this.currentReplayIndex);
  };

  onReplayPrevious = () => {
    if (this.currentReplayIndex <= 1) return;
    clearTimeout(this.replayTimeout);
    const temp = this.currentReplayIndex - 2;
    this.props.setMoveHistory(this.props.moveHistoryData.slice(0, temp + 1));
    console.log(this.fen);
    this.fen = this.props.moveHistoryTimestamp[temp].fen || INITIAL_FEN;
    console.log(this.fen);
    this.props.setLastTimestamp(
      this.props.moveHistoryTimestamp[temp].timestamp
    );
    this.recursiveReplayFunction(temp);
  };
  render() {
    const {
      skillLevel,
      maximumError,
      probability,
      showEndModal,
      winner,
      drawTimes,
      showDrawModal,
      showAwaitingDrawModal,
      showAbortModal,
      playerName,
      showFirstMoveTime,
    } = this.state;
    const {
      playMode,
      opponent,
      currentUser,
      timer,
      playerColor,
      gameRules,
      gameElos,
      moveHistoryData,
    } = this.props;

    if (!this.props.playMode) {
      navigate("/");
      return null;
    }

    if (!this.initialized && !isSSR) {
      this.initialize();
      this.initialized = true;
    }
    // if (
    //   !this.props.isReplay &&
    //   this.props.playMode &&
    //   !this.props.playMode.isHumanVsHuman &&
    //   !this.props.playMode.isAI
    // ) {
    //   navigate("/");
    //   return null;
    // }

    return (
      <div className="gameContainer">
        {!this.props.gameStarted && !this.props.playMode.isAI && (
          <div
            style={{
              position: "fixed",
              width: "100%",
              height: "100%",
              background: "transparent",
              zIndex: 100000000,
            }}
          ></div>
        )}
        {showEndModal && (
          <WinModal
            onReplay={async () => {
              // this.props.setReplay(true);
              this.setState(
                { showEndModal: false, winner: null },
                this.doReplay
              );
            }}
            onClose={() => {
              this.setState({ showEndModal: false });
            }}
            opponent={opponent}
            key={String(showEndModal)}
            isReplay={this.props.isReplay}
            elo={gameRules && getGameTypeElo(gameRules.type, currentUser)}
            gameElos={gameElos}
            gameRules={gameRules}
            winner={winner}
            playerColor={playerColor}
            playMode={playMode}
          />
        )}
        {showAwaitingDrawModal && (
          <RequestDrawModal
            isUserRequested={true}
            cancelDraw={this.userRequestedDrawTimeout}
            confirmDraw={this.confirmDraw}
          />
        )}
        {showDrawModal && (
          <RequestDrawModal
            isUserRequested={false}
            cancelDraw={this.cancelDraw}
            confirmDraw={this.confirmDraw}
          />
        )}
        {showAbortModal && (
          <AbortGameModal
            playerName={playerName}
            onCancel={() => {
              this.setState({ showAbortModal: false, showEndModal: false });
              this.props.clear();
              navigate("/");
            }}
          />
        )}
        {this.props.playMode.isHumanVsHuman && !this.props.isReplay && (
          <SpectatorsDisplay />
        )}
        <div className="gameWrapper">
          {/* <Chat /> */}
          <MovesHistory />
          <ChessboardWrapper
            gameRules={gameRules}
            ref={this.chessboardWrapperRef}
            skillLevel={skillLevel}
            maximumError={maximumError}
            probability={probability}
            fen={this.fen}
            playerColor={playerColor}
            handleMove={this.handleMove}
            timerLimit={this.state.timerLimit * 1000 * 60}
            timerBonus={this.state.timerBonus * 1000}
            onGameEnd={this.onGameEnd}
            isAI={playMode.isAI}
            aiDifficulty={playMode.aiMode}
            opponent={opponent}
            currentUser={currentUser}
            timer={timer}
            isReplay={this.props.isReplay}
            playMode={playMode}
            moveHistoryData={moveHistoryData}
            serverStatus={this.props.serverStatus}
            onReplayPrevious={this.onReplayPrevious}
            onReplayNext={this.onReplayNext}
          />
          {!playMode.isAI && !this.props.isReplay && (
            <ActionButtons
              draw={this.onDrawRequest}
              drawEnabled={drawTimes < 5}
              resign={this.onResign}
            />
          )}
          <GameInfo
            resign={this.onResign}
            onDraw={this.onDrawRequest}
            onReplayPrevious={this.onReplayPrevious}
            onReplayNext={this.onReplayNext}
            drawEnabled={drawTimes < 5}
            isGuest={Boolean(this.props.currentUser.GuestId)}
            showFirstMoveTime={showFirstMoveTime}
          />

          {this.state.showOpponentLeftModal && (
            <OpponentLeftModal
              playerColor={this.props.playerColor}
              onAnswer={(a) => {
                this.setState({ showOpponentLeftModal: false });
                SocketService.sendData(
                  "leave-game-prompt",
                  a !== "draw",
                  () => {}
                );
                this.onGameEnd(a);
              }}
            />
          )}
        </div>
      </div>
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
  spectList: state.gameplay.spectlist,
  gameStarted: state.gameplay.gameStarted,
});

const connected = connect<ISelectProps, IActionProps>(mapStateToProps as any, {
  setOnMove: GameplayActions.onMove,
  addInMoveHistory: GameplayActions.addInMoveHistory,
  setOpponent: GameplayActions.setOpponent,
  setPlayerColor: GameplayActions.setPlayerColor,
  setCurrentUser: UserActions.setCurrentUser,
  setLastTimestamp: GameplayActions.setLastTimestamp,
  setFirstMoveTimer: GameplayActions.setFirstMoveTimer,
  setFirstTimer: GameplayActions.setFirstTimer,
  setTimer: GameplayActions.setManualTimer,
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
  setSpectators: GameplayActions.setSpectators,
  setGameChatShow: GameplayActions.setGameChatShow,
  setGameChatOpen: GameplayActions.setGameChatOpen,
})(Game);

export default connected;
