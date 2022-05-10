import React, { Children, Component, createRef } from "react";
import Draggable from "react-draggable";
// import CloseIcon from "../../assets/images/CloseIcon.svg";
import CloseIconSvg from "./CloseIconSvg";

interface IProps {
  children: JSX.Element;
  onClose: () => void;
  isTopLeft?: boolean;
  withShadow?: boolean;
  draggable?: boolean;
  withBorder?: boolean;
  withCloseIcon?: boolean;
  notShowClose?: boolean;
  isBlack?: boolean;
  isDrawModal?: boolean;
}

class Modal extends Component<IProps> {
  constructor(props: any) {
    super(props);
  }
  modalRef = createRef<HTMLDivElement>();

  // componentDidMount() {
  //   document.addEventListener("click", this.handleDivClick as any);
  // }

  // componentWillUnmount() {
  //   document.removeEventListener("click", this.handleDivClick as any);
  // }

  // handleDivClick = (e: any) => {
  //   if (this.modalRef.current.contains(e.target)) {
  //     return;
  //   }
  //   console.log(e);
  //   this.props.onClose();
  // };
  modal() {
    return (
      <div ref={this.modalRef} className="modal-wrapper">
        {console.log('showing modal',this.props.children)}
        {this.props.children}
        {!this.props.notShowClose && (
          <div
            className={`close-icon btn-clickable ${
              this.props.isDrawModal ? "draw-modal-close" : ""
            }`}
            onClick={this.props.onClose}
          >
            <CloseIconSvg color={this.props.isBlack ? "#000" : "#fff"} />
            {/* {!this.props.isBlack ? (
              // <img src={CloseIcon} />
            ) : (
              <p style={{ color: "#000", fontSize: "10px", fontWeight: "900" }}>
                X
              </p>
            )} */}
          </div>
        )}
      </div>
    );
  }
  render() {
    return (
      <div
        className={`modal ${this.props.isTopLeft && "top-left"} ${
          this.props.withShadow && "with-shadow"
        } ${this.props.withBorder && `border3`}`}
      >
        {this.props.draggable ? (
          <Draggable cancel=".btn-clickable">{this.modal()}</Draggable>
        ) : (
          this.modal()
        )}
      </div>
    );
  }
}

export default Modal;
