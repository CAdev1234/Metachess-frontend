import React from "react";
import Button from "../Button";
import CloseIcon from "../../assets/images/close-icon-white2.png";

interface IProps {
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
  children: React.ReactNode
}

const AlertWarning = (props: IProps) => {
  return (
    <div className="alertWarning">
        <div className="alertWarning__container">
            <div className="alertWarning__close">
                <img src={CloseIcon} alt="Close icon" />
            </div>
            <div className="alertWarning__children">
                {props.children}
            </div>
            <div className="alertWarning__buttons">
                <Button>Confirm</Button>
                <Button>Close</Button>
            </div>
        </div>
    </div>
  );
};

export default AlertWarning;
