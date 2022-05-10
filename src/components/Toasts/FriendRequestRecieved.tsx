import React, { useContext } from "react";
import Button from "../Button";
import Modal from "../Modal";
import ToastProvider from '../ToastProvider'

interface Props {
  onAccept: () => void;
  onDecline: () => void;
  onCancel: () => void;
  children: React.ReactNode;  
}
const FriendRequestRecieved = ({children, onAccept, onDecline , onCancel }: Props) => {
    return (
    // <ToastProvider>
    //   <div className="request-draw-modal">
    //     {children}
    //     <div>
    //         <Button dark small onClick={onAccept}>
    //             Accept
    //         </Button>
    //         <Button dark small onClick={onDecline}>
    //             Decline
    //         </Button>
    //     </div>
    //   </div>
    // </ToastProvider>
    <></>
  );
};

export default FriendRequestRecieved;
