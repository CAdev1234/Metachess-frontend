import React from "react";
import { useSelector } from "react-redux";
import { IAppState } from "../../store/reducers";
import {
  ITreasureHuntReducer,
  move,
} from "../../store/treasureHunt/treasureHunt.interface";
import { IServerStatus } from "../../store/user/user.interfaces";

const MoveHistory = () => {
  const { moveList: moveHistory } = useSelector(
    (state: IAppState): ITreasureHuntReducer => state.treasureHunt
  );
  const { serverStatus }: { serverStatus: IServerStatus } = useSelector(
    (state: IAppState) => state.user
  );
  return (
    <div>
      <p className="title">Plundered Tiles</p>
      <div className="moveHistoryWrapper">
        <div className="cellWrapper">
          {(moveHistory || [])
            .map((move: move, i: number) => (
              <div
                key={i}
                className={
                  i % 2
                    ? "moveHistoryCell moveHistoryCellEven"
                    : "moveHistoryCell moveHistoryCellOdd"
                }
              >
                <p>
                  {move.place} -{" "}
                  {(move.level &&
                    serverStatus[`Level${move.level}TreasureValue`]) ||
                    0}{" "}
                  SHAH
                </p>
              </div>
            ))
            .reverse()}
        </div>
      </div>
    </div>
  );
};

export default MoveHistory;
