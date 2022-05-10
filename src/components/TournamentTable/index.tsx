import React, { useState, useEffect } from "react";
import TournamentTableHeader from './TournamentTableHeader';
import TournamentTableItem from './TournamentTableItem';

interface IProps {
  data: array;
  type: number;
}

const TournamentTable = (props: IProps) => {

  return (
      <div className="tournamentTableContainer">
        <table className="tournamentTable">
          <thead>
            <TournamentTableHeader />
          </thead>
          <tbody>
            {props.data.map((each, index) => (
              <TournamentTableItem data={each} key={index} type={props.type} />
            ))}
          </tbody>
        </table>
      </div>
  );
};

export default TournamentTable;