import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/index";
import { useSelector } from "react-redux";
import { IAppState } from "../../store/reducers";
import VectorImg from "../../assets/images/background-white.png";
import Rollpaper from "../../assets/images/Rollpaper.png";
import Edge from "../../assets/images/Edge.png";
import Paper from "../../assets/images/paper-background.png";
import { MAINTENANCE_MODE } from "../../store/user/user.interfaces";
import moment from "moment";
import { navigate } from "gatsby";

const index = () => {
  const { serverStatus } = useSelector((state: IAppState) => state.user);
  console.log("this is serverStatus =====> ", serverStatus);
  useEffect(() => { if (serverStatus.MaintenanceMode !== MAINTENANCE_MODE.UNDER_MAINTENANCE) { navigate("/"); } }, [serverStatus])
  const mDate = moment(serverStatus.MaintenanceTime);
  const tempDate: string = mDate.format("DD");
  const suffix = tempDate[0] === "1" ? "th" : tempDate[tempDate.length - 1] === "1" ? "st" : tempDate[tempDate.length - 1] === "2" ? "nd" : tempDate[tempDate.length - 1] === "3" ? "rd" : "th";
  return (
    <>

      <Modal onClose={() => { }} notShowClose={true}>
        <div
          // ref={paperWrapperRef}
          id="animation__paper"
          className="paper-full-wrapper"
        >
          <img src={Edge} alt="" className="edge" />
          <div className="paper-wrapper" data-aos="example-anim1" data-aos-mirror={true}>
            <img src={Paper} alt="" className="paper" />
            <img src={VectorImg} alt="" className="paper-light" />
            {/* <img src={VectorImg} alt="" className="paper-light" /> */}
            <div className="content">
              <div className="title">Maintenance Notice</div>
              <div className="description">
                {/* <MaintenancePage /> */}
                {serverStatus.MaintenanceMode === MAINTENANCE_MODE.UNDER_MAINTENANCE && (

                  `our services are currently under maintenance, please be patient while
          we restore services to serve you better`

                )}
                {serverStatus.MaintenanceMode === MAINTENANCE_MODE.NEW_GAMES_DISABLED && (

                  `The scheduled maintenance would start in approximately 30 minutes, we
          have temporarily disabled gameplay until the maintenance is complete.`

                )}
                {serverStatus.MaintenanceMode === MAINTENANCE_MODE.ONLINE &&
                  serverStatus.MaintenanceDuration &&
                  serverStatus.MaintenanceTime && (

                    `A maintenance is scheduled for ${mDate.format("MMMM")}{" "}
            ${mDate.format("DD")}${suffix} at ${mDate.format("LT")} with an estimated
            duration of ${serverStatus.MaintenanceDuration} minutes. During the
            update, our services won't be available.`

                  )}
              </div>
            </div>
            <img src={Rollpaper} alt="" className="rollpaper" />
          </div>
        </div>
      </Modal>
      )}
    </>
  );
};

// const connected = connect<null, IActionProps>(null, {
//   setPlayMode: GameplayActions.setPlayMode,
// })(ChoseMode);

export default index;
