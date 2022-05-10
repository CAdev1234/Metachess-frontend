import React from "react";
import AchivementTab from "../../assets/images/achievments.png";
import ProfileTab from "../../assets/images/profile.png";
import StarTab from "../../assets/images/star.png";
import SettingsTab from "../../assets/images/settings.png";
import { navigate } from "gatsby";
export type ProfileTab = "star" | "achivement" | "profile" | "settings";

const tabs: ProfileTab[] = ["star", "achivement", "profile", "settings"];

interface Props {
  onSelect: (tab: ProfileTab) => void;
  selected: ProfileTab;
}

const TabHeader = ({ onSelect, selected }: Props) => {
  return (
    <div className="tabWrapper">
      {tabs.map((tab, index) => (
        <div
          className="singleTab"
          onClick={
            tab === "settings"
              ? () => navigate("/settings")
              : () => onSelect(tab)
          }
          key={index}
        >
          <img
            src={
              (tab === "star" && StarTab) ||
              (tab === "achivement" && AchivementTab) ||
              (tab === "profile" && ProfileTab) ||
              (tab === "settings" && SettingsTab)
            }
          />
          {selected === tab && <div className="activeTabIndicator" />}
        </div>
      ))}
    </div>
  );
};

export default TabHeader;
