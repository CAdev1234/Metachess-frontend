import React, { useEffect } from "react";
import Modal from "../../components/Modal";
import accessDenied from "../../assets/images/accessDenied.svg";
import { useSelector } from "react-redux";
import { IAppState } from "../../store/reducers";
import { IUserReducer } from "../../store/user/user.interfaces";
import { navigate } from "gatsby";

const Index = () => {
  const { alreadyAuthenticated }: { alreadyAuthenticated: boolean } =
    useSelector((state: IAppState): IUserReducer => state.user);
  useEffect(() => {
    if (!alreadyAuthenticated) navigate("/");
    console.log(alreadyAuthenticated);
  }, []);
  return (
    <Modal onClose={() => console.log("close")} notShowClose={true}>
      <div className="accessDenied">
        <img src={accessDenied} />
        <div className={"headerWrapper"} style={{ marginBottom: "4vmin" }}>
          <p className="header-heading">
            You are already authenticated somewhere else!
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default Index;
