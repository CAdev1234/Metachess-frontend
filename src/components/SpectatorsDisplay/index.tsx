import React, { useState } from "react";
import { useSelector } from "react-redux";
import eyeIcon from "../../assets/images/eye.png";
import { IAppState } from "../../store/reducers";
import { getOpponentName } from "../../helpers/getOpponentNameByPlayMode";
import { IUser } from "../../store/user/user.interfaces";

const SpectatorsDisplay = () => {
  const spectators = useSelector(
    (state: IAppState) => state.gameplay.spectlist
  );
  const [showUsers, setShowUsers] = useState<boolean>(false);
  return (
    <section
      className={`spectators-display-section ${showUsers ? "showUsers" : ""}`}
    >
      <div
        className="eye-container-spectators"
        // onMouseOver={() => setShowUsers(true)}
        // onMouseLeave={() => setShowUsers(false)}
        // onClick={() => setShowUsers(!showUsers)}
        onClick={() => setShowUsers(!showUsers)}
      >
        <img
          src={eyeIcon}
          alt="eye"
          //   onMouseOver={() => {
          //     setShowUsers(true);
          //   }}
          //   onMouseLeave={() => setShowUsers(false)}
        />
        <p className="spectators-number">{spectators.length}</p>
      </div>
      {showUsers ? (
        <div className="spectator-user-list-display">
          {spectators.map((spectator: Partial<IUser>) => {
            return (
              <>
                <div className="spectator-user-display">
                  {
                    //@ts-ignore
                    getOpponentName(false, null, spectator)
                  }
                </div>
                <hr />
              </>
            );
          })}
        </div>
      ) : null}
    </section>
  );
};

export default SpectatorsDisplay;
