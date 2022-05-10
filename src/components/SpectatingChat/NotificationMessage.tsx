import React from "react";

const NotificationMessage = ({ message }: { message: string }) => {
  return <div className="notification-message">{message}</div>;
};

export default NotificationMessage;
