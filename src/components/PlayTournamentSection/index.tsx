import React, { useState, useEffect } from "react";
import NewGameModal from "../NewGameModal";
import TournamentTable from "../TournamentTable";
import TournamentPagination from "../TournamentPagination";
import SocketService from "../../services/socket.service";
import QuickPairingModal from "../QuickPairingModal";
import { navigate } from "gatsby";
import {
  TYPE, DATA,
} from "../../constants/tournamentData";

interface IProps {
  onJoinRoom: (p: string) => void;
}

const PlayTournamentSection = (props: IProps) => {
  const [type, setType] = useState(0);
  const [curpage, setPage] = useState(0);
  const filteredData = DATA.filter(each => each['type'] == TYPE[type]);
  const countPerPage = 10;
  const maxpage = filteredData.length === 0 ? 0 : Math.floor((filteredData.length - 1) / countPerPage) + 1;
  const showingData = filteredData.filter((each, index) => (index >= curpage * countPerPage && index < (curpage +1) * countPerPage));

  const createTournament = () => {
    console.log('create tournament');
  }

  const onChangeType = (mode) => {
    setType(mode);
    setPage(0);
  }

  const onTransition = (page) => {
    let newpage = page <0 ? 0 : page
    setPage(newpage < maxpage ? newpage : maxpage - 1);
  }

  return (
    <>
      <div className="playTournamentContainer">
        <div className="titleWrapper">
          <p className="title-heading">TOURNAMENT</p>
        </div>

        <div className="createbutton">
          <button onClick={createTournament}>
            &nbsp; + CREATE TOURNAMENT
          </button>
        </div>
        <div className="typebuttons">
          <button 
            className={type === 0 ? "colored" : "outlined"} 
            onClick={() => onChangeType(0)}
          >
            UPCOMING
          </button>
          <button 
            className={type === 1 ? "colored" : "outlined"} 
            onClick={() => onChangeType(1)}
          >
            ONGOING
          </button>
          <button 
            className={type === 2 ? "colored" : "outlined"} 
            onClick={() => onChangeType(2)}
          >
            CONCLUDED
          </button>
        </div>
        <TournamentTable data={showingData} type={type}/>
        <TournamentPagination curpage={curpage} onTransition={onTransition}/>
      </div>
    </>
  );
};

export default PlayTournamentSection;