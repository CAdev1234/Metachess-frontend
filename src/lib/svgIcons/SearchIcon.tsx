import React from "react";

export default ({
  className,
  onClick,
}: {
  className: string;
  onClick?: () => void;
}) => (
  <div className={className || ""} onClick={onClick}>
    <svg
      width="26"
      height="25"
      viewBox="0 0 26 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.2969 17.0644L24.8908 22.6578C24.8909 22.6578 24.8909 22.6578 24.8909 22.6578C25.3697 23.1363 25.3697 23.9125 24.8909 24.391C24.6516 24.6302 24.3374 24.75 24.0243 24.75C23.7109 24.75 23.397 24.6302 23.1577 24.3909L17.5638 18.7976C17.5638 18.7975 17.5637 18.7975 17.5637 18.7975C17.0849 18.319 17.0849 17.5428 17.5637 17.0644L19.2969 17.0644ZM19.2969 17.0644C18.8181 16.5857 18.0426 16.5856 17.5638 17.0643L19.2969 17.0644Z"
        fill="url(#paint0_linear_390:216)"
        stroke="url(#paint1_linear_390:216)"
        strokeWidth="0.5"
      />
      <path
        d="M11.57 0.25C5.60382 0.25 0.75 5.10332 0.75 11.069C0.75 17.035 5.60383 21.888 11.57 21.888C17.5366 21.888 22.39 17.035 22.39 11.069C22.39 5.10333 17.5366 0.25 11.57 0.25ZM11.57 19.4369C6.95579 19.4369 3.20139 15.6828 3.20139 11.0691C3.20139 6.45533 6.9558 2.7012 11.57 2.7012C16.1843 2.7012 19.9387 6.45528 19.9387 11.069C19.9387 15.6827 16.1842 19.4369 11.57 19.4369Z"
        fill="url(#paint2_linear_390:216)"
        stroke="url(#paint3_linear_390:216)"
        strokeWidth="0.5"
      />
      <defs>
        <linearGradient
          id="paint0_linear_390:216"
          x1="21.2273"
          y1="16.9553"
          x2="21.2273"
          y2="24.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ADA29F" />
          <stop offset="1" stopColor="#6D6461" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_390:216"
          x1="21.2273"
          y1="16.9553"
          x2="21.2273"
          y2="24.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ADA29F" />
          <stop offset="1" stopColor="#6D6461" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_390:216"
          x1="11.57"
          y1="0.5"
          x2="11.57"
          y2="21.638"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ADA29F" />
          <stop offset="1" stopColor="#6D6461" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_390:216"
          x1="11.57"
          y1="0.5"
          x2="11.57"
          y2="21.638"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ADA29F" />
          <stop offset="1" stopColor="#6D6461" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);
