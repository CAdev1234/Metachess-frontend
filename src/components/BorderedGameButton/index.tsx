import React from "react";

interface IProps {
  GameIcon: JSX.Element;
  title: string;
  subtitle?: string;
  available?: boolean;
  onPlayClick?: () => void;
}
const BorderedGameButton = ({
  GameIcon,
  title,
  subtitle,
  available,
  onPlayClick,
}: IProps) => {
  return (
    <div className="borderedGameButton">
      {GameIcon}
      <p className="title">{title}</p>
      {subtitle && <span className="subtitle">{subtitle}</span>}
      {available ? (
        <button type="button" className="play-button" onClick={onPlayClick}>
          Play now
        </button>
      ) : (
        <span className="coming-soon">Coming soon</span>
      )}
    </div>
  );
};
export default BorderedGameButton;
