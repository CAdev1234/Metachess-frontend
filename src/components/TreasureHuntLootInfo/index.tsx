import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IAppState } from "../../store/reducers";
import { Actions } from "../../store/treasureHunt/treasureHunt.action";
import { ITreasureHuntReducer } from "../../store/treasureHunt/treasureHunt.interface";

const TreasureLoot = () => {
  const { lootAcquired } = useSelector(
    (state: IAppState): ITreasureHuntReducer => state.treasureHunt
  );
  const dispatch = useDispatch();
  return (
    <div>
      <p className="title" style={{ textAlign: "center" }}>
        Loot Acquired
        <br />
        <span style={{ fontWeight: 900 }}>{lootAcquired} SHAH</span>
      </p>
      <section style={{ padding: "0 2vmax" }}>
        <button
          className="claimButton"
          onClick={() => {
            if (lootAcquired !== 0) dispatch(Actions.claimShah());
          }}
        >
          Claim Now
        </button>
      </section>
    </div>
  );
};

export default TreasureLoot;
