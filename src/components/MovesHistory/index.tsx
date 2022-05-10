import React from "react";
import { IAppState } from "../../store/reducers";
import { connect, useSelector } from "react-redux";

interface ISelectProps {
  moveHistory: string[];
}

const MovesHistory = () => {
  const { moveHistory } = useSelector((state: IAppState): ISelectProps => ({
    moveHistory: state.gameplay.moveHistory
  }))
console.log(moveHistory);
  return (
    <div className="moveHistoryContainer">
      <p className="title">Moves history</p>
      <div className="moveHistoryWrapper">
        <div className="cellWrapper">
          {(moveHistory || []).map((move: string, i: number) => (
            <div
              key={i}
              className={
                i % 2
                  ? "moveHistoryCell moveHistoryCellEven"
                  : "moveHistoryCell moveHistoryCellOdd"
              }
            >
              <p>
                {i % 2 ? "Black played " : "White played "} {move}
              </p>
            </div>
          )).reverse()}
        </div>
      </div>
    </div>
  );
}

// const mapStateToProps = );

// const connected = connect<ISelectProps, {}>(mapStateToProps as any, {})(MovesHistory);

export default MovesHistory;
