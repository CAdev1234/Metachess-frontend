import React from "react";
import SettingsTab from "../../components/ProfileSidebar/SettingsTab";

export default () => {
  return (
    <div
      className="profileSidebarContainer"
      style={{ width: "50%",minWidth:"fit-content", margin: "0 auto 4vmin" }}
    >
      <SettingsTab />
    </div>
  );
};
