import React, { useEffect, useState } from "react";
import Modal from "../Modal/index";
import MaintenancePage from "../../pages/maintenance";
import { useSelector } from "react-redux";
import { IAppState } from "../../store/reducers";
import VectorImg from "../../assets/images/background-white.png";
import Rollpaper from "../../assets/images/Rollpaper.png";
import Edge from "../../assets/images/Edge.png";
import Paper from "../../assets/images/paper-background.png";
import { MAINTENANCE_MODE } from "../../store/user/user.interfaces";
import moment from "moment";

const MaintenanceModal = ({ showClose }: { showClose: boolean }) => {
  const { serverStatus } = useSelector((state: IAppState) => state.user);
  console.log("this is serverStatus =====> ", serverStatus);
  const [userSeenMaintenance, setUserSeenMaintenance] = useState(false);
  const mDate = moment(serverStatus.MaintenanceTime);
  const tempDate: string = mDate.format("DD");
  const suffix = tempDate[0] === "1" ? "th" : tempDate[tempDate.length - 1] === "1" ? "st" : tempDate[tempDate.length - 1] === "2" ? "nd" : tempDate[tempDate.length - 1] === "3" ? "rd" : "th";
  useEffect(() => {
    setUserSeenMaintenance(false);
  }, [serverStatus.MaintenanceMode]);
  if (serverStatus.MaintenanceMode === MAINTENANCE_MODE.UNDER_MAINTENANCE || (serverStatus.MaintenanceMode === MAINTENANCE_MODE.ONLINE &&
    !serverStatus.MaintenanceDuration &&
    !serverStatus.MaintenanceTime)) return null; return (
      <>
        {!userSeenMaintenance && (
          // <Modal onClose={() => setUserSeenMaintenance(true)} withBorder>
          //   <div className={"maintenance-modal"}>
          //     <MaintenancePage />
          //     <div className={"btn-container"}></div>
          //   </div>
          // </Modal>
          <Modal onClose={() => setUserSeenMaintenance(true)} notShowClose={!showClose}>
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
                    {serverStatus.MaintenanceMode === MAINTENANCE_MODE.NEW_GAMES_DISABLED && (

                      `The scheduled maintenance would start in approximately 30 minutes, we
          have temporarily disabled gameplay until the maintenance is complete.`

                    )}
                    {serverStatus.MaintenanceMode === MAINTENANCE_MODE.ONLINE &&
                      serverStatus.MaintenanceDuration &&
                      serverStatus.MaintenanceTime && (
                        `A maintenance is scheduled for ${mDate.format("MMMM")}
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

export default MaintenanceModal;
