import React, { useState, useEffect } from "react";
import NewGameModal from "../NewGameModal";
import UsersListTable from "../UsersListTable";
import SocketService from "../../services/socket.service";
import QuickPairingModal from "../QuickPairingModal";
import { navigate } from "gatsby";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { IGameItem } from "../../store/games/games.interfaces";
import { IAppState } from "../../store/reducers";
import { filter } from "lodash";


interface IProps {
  goBack: () => void;
  onJoinRoom: (p: string) => void;
  gameMode: String
}

const PlayWithHumanSection = (props: IProps) => {
  //const [joinRoom, setJoinRoom] = useState("");
  const [modalCustomGame, setModalCustomGame] = useState(false);
  const [modalQuickPairing, setModalQuickPairing] = useState(false);
  const gameItems = useSelector(({ games }: IAppState) => games.gameItems);
  const { currentUser } = useSelector((state: IAppState) => state.user);

  const createMatch = () => {
    const filterResult = gameItems.filter( (room: IGameItem) => room.host.Id === currentUser.Id)
    filterResult.length 
    ?
    toast.warn("You have already created a match , Please cancel it if you want to create another one")
    :
    setModalCustomGame(true)
  }

  return (
    <>
      <div className="playWithHumanContainer">
        <div className={"backToSelection"}>
          <p
            className={"normal"}
            onClick={props.goBack}
          >{`< Choose a game mode`}</p>
        </div>
        <div className="titleWrapper">
          <p className="title-heading">PLAY WITH HUMAN</p>
        </div>

        <div className="gamebuttons">
          <button onClick={() => createMatch()}>
            Create a match
          </button>
          <button className="p-lg" onClick={() => setModalQuickPairing(true)}>
            Quick pairing
          </button>
        </div>
        <div className="menubuttons">
          <button className="colored">lobby</button>
          <button className="outlined" onClick={() => navigate("/leaderboard")}>
            leaderboard
          </button>
        </div>
        <UsersListTable />
      </div>
      {modalCustomGame && (
        <NewGameModal closeModal={() => setModalCustomGame(false)} gameMode={props.gameMode} />
      )}
      {modalQuickPairing && (
        <QuickPairingModal closeModal={() => setModalQuickPairing(false)} gameMode={props.gameMode} />
      )}
    </>
  );
};

export default PlayWithHumanSection;
