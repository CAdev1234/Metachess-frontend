import React from "react";

const OnlineStatus = ({ status }: { status: "online" | string }) => (
  <div style={{ display: "flex", alignItems: "center", marginRight: "16px" }}>
    {status === "online" ? (
      <div
        style={{
          height: "10px",
          width: "10px",
          background: "#00AC2E 0% 0% no-repeat padding-box",
          borderRadius: "5px",
        }}
      />
    ) : null}
    <p
      style={{
        font: "normal normal 600 11px/15px Segoe UI",
        letterSpacing: "0.66px",
        color: "#0F1F38",
        marginLeft: "4px",
      }}
    >
      {status.toUpperCase()}
    </p>
  </div>
);

export default OnlineStatus;
