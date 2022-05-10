import React, { useState } from "react";
import { TREASURE_QUEST_MODES } from "../../constants/playModes";
import UsersRankingTable from "../../components/UserRankingTable";
import dropdownImage from "../../assets/images/dropdown.svg";

interface IProps {
  setTreasureMode: (mode: TREASURE_QUEST_MODES) => void;
  goBack: () => void;
}

const index = (props: IProps) => {
  const [playerByRating, setPlayerByRating] = useState<string>("");
  const [mostActiveUser, setMostActiveUsers] = useState<string>("");
  const [option, setOption] = useState<string>("");
  const [activeQuickPlay, setActiveQuickPlay] = useState<number>(0);
  const [openRating, setOpenRating] = useState<boolean>(false);
  const [openActive, setOpenActive] = useState<boolean>(false);
  const handleDropDownClick = (e: any, type: number): void => {
    // console.log(e.target.type);
    if (e.target.src) {
      if (type === 1) return setOpenActive(!openActive);
      return setOpenRating(!openRating);
    }
    if (type === 1) {
      if ([...e.target.classList].includes("dropDownOption"))
        setMostActiveUsers(e.target.innerText[0]);
      else setMostActiveUsers("Q");
      setOpenActive(false);
      return setOption("Most Active Users");
    }
    if ([...e.target.classList].includes("dropDownOption"))
      setPlayerByRating(e.target.innerText[0] + e.target.innerText[1]);
    else setPlayerByRating("Bu");
    setOpenRating(false);
    return setOption("Player Ranking By Rating");
  };
  const handleClickOption = (e: any, type: number): void => {
    if (type === 1) {
      setMostActiveUsers(e.target.innerText[0]);
      return setOption("Most Active Users");
    }
    setPlayerByRating(
      e.target.innerText[0] + e.target.innerText[1].toLowerCase()
    );
    return setOption("Player Ranking By Rating");
  };
  {
    /* {openActive && (
            <div className="dropDownOptions">
              <p
                className="filterText"
                onClick={(e) => handleClickOption(e, 1)}
              >
                <span className="bullet"></span> Quick Pairing
              </p>
              <div className="dropDownOptions">
                <p
                  className="filterText"
                  onClick={(e) => handleClickOption(e, 1)}
                >
                  <span className="bullet"></span> Games With AI
                </p>
              </div>
            </div>
          )} */
  }
  {
    /* <img src={dropdownIcon} alt="dropdown" /> */
  }
  {
    /* {openRating && (
            <div className="dropDownOptions">
              <p
                className="filterText"
                onClick={(e) => handleClickOption(e, 2)}
              >
                <span className="bullet"></span>Bullet
              </p>
              <p
                className="filterText"
                onClick={(e) => handleClickOption(e, 2)}
              >
                <span className="bullet"></span>Blitz
              </p>
              <p
                className="filterText"
                onClick={(e) => handleClickOption(e, 2)}
              >
                <span className="bullet"></span>Rapid
              </p>
              <p
                className="filterText"
                onClick={(e) => handleClickOption(e, 2)}
              >
                <span className="bullet"></span>Classical
              </p>
            </div>
          )} */
  }
  console.log(option, mostActiveUser, playerByRating);
  return (
    <div className={"chooseTreasureQuestModeSection globalRankingsSection"}>
      <div className={"headerWrapper"} style={{ marginBottom: "4vmin" }}>
        <p className="header-heading">LEADERBOARD</p>
      </div>
      {option === "" && (
        <div className="filterWrapper">
          <div
            className="dropdown-menu"
            onClick={(e) => handleDropDownClick(e, 1)}
          >
            <p className="filterText">Most Active Users</p>
            {openActive && (
              <div className="dropDownOptions">
                <p
                  className="dropDownOption filterText"
                  onClick={(e) => handleClickOption(e, 1)}
                >
                  <span className="bullet"></span> Quick Pairing
                </p>
                <div className="dropDownOptions">
                  <p
                    className="dropDownOption filterText"
                    onClick={(e) => handleClickOption(e, 1)}
                  >
                    <span className="bullet"></span> Games With AI
                  </p>
                </div>
              </div>
            )}
            <img src={dropdownImage} />
          </div>
          <div
            className="dropdown-menu"
            onClick={(e) => handleDropDownClick(e, 2)}
          >
            <p className="filterText">Player Ranking By Rating</p>
            {openRating && (
              <div className="dropDownOptions">
                <p
                  className="filterText dropDownOption"
                  onClick={(e) => handleClickOption(e, 2)}
                >
                  <span className="bullet"></span>Bullet
                </p>
                <p
                  className="filterText dropDownOption"
                  onClick={(e) => handleClickOption(e, 2)}
                >
                  <span className="bullet"></span>Blitz
                </p>
                <p
                  className="filterText dropDownOption"
                  onClick={(e) => handleClickOption(e, 2)}
                >
                  <span className="bullet"></span>Rapid
                </p>
                <p
                  className="filterText dropDownOption"
                  onClick={(e) => handleClickOption(e, 2)}
                >
                  <span className="bullet"></span>Classical
                </p>
              </div>
            )}
            <img src={dropdownImage} />
          </div>
        </div>
      )}
      {option && (
        <>
          <div className={"backToSelection"} style={{ margin: 0 }}>
            <p
              className={"normal"}
              onClick={() => {
                setMostActiveUsers("");
                setPlayerByRating("");
                return setOption("");
              }}
            >{`< Go Back To Global Rankings`}</p>
          </div>
          <p className="title">{option}</p>
          <div className="filterWrapper">
            {option === "Most Active Users" ? (
              <>
                <div
                  className={` option dropdown-menu ${
                    mostActiveUser === "Q" ? "option--active" : ""
                  }`}
                  style={{ width: "auto" }}
                >
                  <p
                    className="filterText"
                    onClick={(e) => handleClickOption(e, 1)}
                  >
                    Quick Play
                  </p>
                </div>
                <div
                  className={` option dropdown-menu ${
                    mostActiveUser === "G" ? "option--active" : ""
                  }`}
                  style={{ width: "auto" }}
                >
                  <p
                    className="filterText"
                    onClick={(e) => handleClickOption(e, 1)}
                  >
                    games With ai
                  </p>
                </div>
              </>
            ) : (
              <>
                <div
                  className={` option dropdown-menu ${
                    playerByRating.toUpperCase() === "BU"
                      ? "option--active"
                      : ""
                  }`}
                  style={{ width: "auto" }}
                >
                  <p
                    className="filterText"
                    onClick={(e) => handleClickOption(e, 2)}
                  >
                    Bullet
                  </p>
                </div>
                <div
                  className={` option dropdown-menu ${
                    playerByRating.toUpperCase() === "BL"
                      ? "option--active"
                      : ""
                  }`}
                  style={{ width: "auto" }}
                >
                  <p
                    className="filterText"
                    onClick={(e) => handleClickOption(e, 2)}
                  >
                    Blitz
                  </p>
                </div>
                <div
                  className={` option dropdown-menu ${
                    playerByRating.toUpperCase() === "RA"
                      ? "option--active"
                      : ""
                  }`}
                  style={{ width: "auto" }}
                >
                  <p
                    className="filterText"
                    onClick={(e) => handleClickOption(e, 2)}
                  >
                    Rapid
                  </p>
                </div>
                <div
                  className={` option dropdown-menu ${
                    playerByRating.toUpperCase() === "CL"
                      ? "option--active"
                      : ""
                  }`}
                  style={{ width: "auto" }}
                >
                  <p
                    className="filterText"
                    onClick={(e) => handleClickOption(e, 2)}
                  >
                    Classical
                  </p>
                </div>
              </>
            )}
          </div>
        </>
      )}
      {/* <div> */}
      {mostActiveUser === "Q" && option[0] === "M" && (
        <>
          <div className="menubuttons">
            <button
              onClick={() => setActiveQuickPlay(0)}
              className={`${
                (activeQuickPlay === 0 && "colored") || "outlined"
              }`}
            >
              QUICK PAIRING STATS <br />
              <span className="timingRanking">(weekly ranking)</span>
            </button>
            <button
              onClick={() => setActiveQuickPlay(1)}
              className={`${
                (activeQuickPlay === 1 && "colored") || "outlined"
              }`}
            >
              QUICK PAIRING STATS <br />
              <span className="timingRanking">(monthly ranking)</span>
            </button>
            <button
              onClick={() => setActiveQuickPlay(2)}
              className={`${
                (activeQuickPlay === 2 && "colored") || "outlined"
              }`}
            >
              QUICK PAIRING STATS <br />
              <span className="timingRanking">(all time)</span>
            </button>
          </div>
        </>
      )}

      {option && (
        <UsersRankingTable
          type={option}
          quickPlayTime={activeQuickPlay}
          option={
            option === "Most Active Users" ? mostActiveUser : playerByRating
          }
        />
      )}
    </div>
    // </div>
  );
};

export default index;
