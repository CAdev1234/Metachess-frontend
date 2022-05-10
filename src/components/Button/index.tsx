import React from "react";

const Button = ({
  dark,
  small,
  white,
  ...restPros
}: {
  small?: boolean;
  dark?: boolean;
  white?: boolean;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  return (
    <button
      className={`buttonWrapper ${dark ? "dark" : ""}  ${
        small ? "small" : ""
      } ${white ? "white" : ""} `}
      {...restPros}
    />
  );
};

export default Button;
