import React from "react";
import { TREASURE_QUEST_MODES } from "../../constants/playModes";

interface IProps {
  setTreasureMode: (mode: TREASURE_QUEST_MODES) => void;
  goBack: () => void;
}

const index = (props: IProps) => {
  return (
    <div className={"chooseTreasureQuestModeSection"}>
      <div className={"backToSelection"}>
        <p
          className={"normal"}
          onClick={props.goBack}
        >{`< Choose a game mode`}</p>
      </div>
      <div className={"headerWrapper"} style={{ marginBottom: "4vmin" }}>
        <p className="header-heading">Treasure Quest</p>
      </div>
      <div className="sub-headingRules">Game Rules</div>
      <p className="rulesText">
        In this game mode, your simple quest is to get as much treasures as you
        can. There are hidden treasures in 8 out of the 64 squares on a chess
        board. All you just need to do is to click on any of the squares you
        feel would hold treasures. If you click on a square that has no
        treasure, we can only hope you have better luck in your next attempt.
        You have 6 attempts per game. After 6 attempts the game ends and then
        you can claim your treasures (in form of $SHAH token). Also note that
        each of the 64 squares belong to someone. Whatever treasure you find in
        your quest will be split evenly between yourself and the square owners
        (after 10% Foundation commission). A player can only play this game mode
        5 times within 24 hours. However, if you're not satisfied with playing
        just 5 times in 24 hours, you can opt for the "Solo Quest Mode" below.
        If you select this option, you have unlimited attempts to play. You also
        would not share revenue with square owners, 100% of your acquired
        treasures (minus 10% Foundation commission) will be yours. You need to
        pay an entry fee for each game in order to have access to the Solo Quest
        Mode.
        <br />
        <br />
        <span style={{ fontWeight: 400, fontSize: "1.5rem" }} id="summary">
          {" "}
          SUMMARY{" "}
        </span>{" "}
        <br />
        <br />
        <ol>
          <li>
            <div className="bullet">1</div>
            <p>
              For Rev-share mode, whatever you win will be shared with land
              owners. It is completely free to play. You can play this game mode
              only 5 times per day.
            </p>
          </li>
          <li>
            <div className="bullet">2</div>
            <p>
              For Solo Quest Mode; whatever you win (minus commission) will be
              100% yours. You have to pay a certain amount of $SHAH tokens to
              gain entry each time you want to play. You have unlimited number
              of games per day (as long as you keep paying the entry fee).
            </p>
          </li>
        </ol>{" "}
        Goodluck on your Quest!
      </p>
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
          style={{ width: "initial", padding: "2vmin 2vmax" }}
          onClick={() => props.setTreasureMode(TREASURE_QUEST_MODES.REV_SHARE)}
        >
          REV-SHARE MODE
        </button>
        <button
          className="claimButton"
          style={{ width: "initial", padding: "2vmin 2vmax" }}
          onClick={() => props.setTreasureMode(TREASURE_QUEST_MODES.SOLO_QUEST)}
        >
          SOLO QUEST MODE
        </button>
      </section>
    </div>
  );
};

export default index;
