import React from "react";

interface Props {
  title: string;
  children?: JSX.Element | JSX.Element[] | string;
  className?: string;
}

const SquaredButton = ({
  title,
  children,
  className,
  ...restProps
}: Props &
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >) => {
  return (
    <div className={`squareButtonContainer ${className || ''}`} {...restProps}>
      <div className="squareButtonChildrenWrapper">
      {children}
      </div>
      <p className={`squaredButtonTitle ${title === "TOURNAMENT"  ? "tournament" : ""} ${title === "PLAY WITH HUMAN"  ? "tournament" : ""} `}>{title}</p>
    </div>
  );
};

export default SquaredButton;
