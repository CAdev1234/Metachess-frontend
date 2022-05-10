import React from "react";

const CloseIconSvg = ({ color }: { color: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="18"
      viewBox="0 0 16 18"
      fill="none"
    >
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M14.5 1L1 17"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M1 1L14.5 17"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default CloseIconSvg;
