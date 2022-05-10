import React, { useEffect, useRef, useState } from "react";
import { useQueryParam, NumberParam, StringParam } from "use-query-params";
import subscribeToGameStart from "../../lib/gameStart";
import SocketService from "../../services/socket.service";

import socketIO from "socket.io-client";
import { SOCKET, API, COOKIE_DOMAIN, MAIN_WEBSITE } from "../../config";
import { navigate } from "gatsby";
import { GameRules } from "../../interfaces/game.interfaces";
import { IUser } from "../../store/user/user.interfaces";
import { useDispatch } from "react-redux";
import { Actions } from "../../store/user/user.action";
import { GAME_MODES, MODES } from "../../constants/playModes";
import { getOpponentName } from "../../helpers/getOpponentNameByPlayMode";
import Modal from "../../components/Modal";

interface gameInfo {
  gameRules?: GameRules;
  gameStartDate?: number;
  historyMoves?: [];
  host?: IUser;
  secondPlayer?: IUser;
}

const JoinGame = () => {

  const [roomId] = useQueryParam("roomId", StringParam);
  const [gameMode] = useQueryParam("game-mode", StringParam);

  const dispatch = useDispatch();

  const [roomInfo, setRoomInfo] = useState<gameInfo>({});
  
  useEffect(() => {

    //subscribeToGameStart(GAME_MODES.TWO_DIMENSION);
    subscribeToGameStart(gameMode);
    SocketService.sendData("join-game", roomId, (args: any) => {
      if (args.type !== 0) setRoomInfo(args.gameInfo);
      // console.log(args);
      // debugger;
      // TODO: Will be typeof GameRules

      // socketIO(SOCKET).io.emit("spectatable", "roomId", null);
      console.log("join-game:", args);
    });
      // SocketService.sendData("start-spectating", roomId, (res)=>{
      //   if(res){
      //     navigate(`/watch/${roomId}`);
      //   }
      // })
  }, []);

  if (!roomInfo || !roomInfo.gameRules) return null;
  return (
    <Modal
      onClose={() => {
        navigate("/");
      }}
      withBorder={true}
      withShadow={true}
    >
      <div
        style={{
          padding: "2vmin 2vmax",
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(2px)",
        }}
      >
        <div className="sub-headingRules playersName">
          {getOpponentName(false, null, roomInfo.host)} VS{" "}
          {getOpponentName(false, null, roomInfo.secondPlayer)}
        </div>
        <div className="alreadyProgressGame">
          The game is already in progress. Would you like to watch it live?
        </div>
        <section
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          <button
            className="claimButton"
            style={{
              width: "initial",
              textTransform: "uppercase",
              padding: "2vmin 2vmax",
              cursor: "pointer",
            }}
            onClick={() => {
              dispatch(Actions.setChoseMode(MODES.PLAY_WITH_HUMAN));
              navigate(`/choose-mode`);
            }}
          >
            Back to lobby
          </button>
          <button
            className="claimButton"
            style={{
              width: "initial",
              textTransform: "uppercase",
              padding: "2vmin 2vmax",
              cursor: "pointer",
            }}
            onClick={() => {
              navigate(`/watch/${roomId}`);
            }}
          >
            Watch Live
          </button>
        </section>
      </div>
    </Modal>
  );
};

export default JoinGame;
