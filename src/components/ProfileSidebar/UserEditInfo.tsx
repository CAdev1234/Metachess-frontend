import React, { useState } from "react";
import EditIcon from "../../assets/images/EditIcon.png";
import UserEdit from "../UserEditInfo";
import { IUser } from "../../store/user/user.interfaces";
import WALLET from "../../services/wallet.service";

interface Props {
  currentUser: IUser;
}
const UserEditInfo = ({ currentUser }: Props) => {
  const [editing, setEditing] = useState<boolean>(false);
  if (!currentUser) return <div>Loading...</div>;
  const userInfo: JSX.Element = (
    <>
      <div className="info">
        <p className="subtitle">Username</p>
        <p className="title">{currentUser.Username}</p>
      </div>
      <div className="info">
        <p className="subtitle">Email</p>
        <p className="title" style={{ fontSize: "14px" }}>
          {currentUser.Email}
        </p>
      </div>
      {currentUser.WalletAddress && <div className="info">
        <p className="subtitle">Wallet Address</p>
        <p className="title" style={{ fontSize: "14px" }}>
          {WALLET.truncateString(currentUser.WalletAddress, 6, 6)}
        </p>
      </div>}
    </>
  );
  return (
    <div className="tabContent">
      <div className="overallItem" style={{ position: "relative" }}>
        <p className="tabTitle">Profile</p>
        {!editing ? (
          <img
            src={EditIcon}
            alt="edit Icon"
            style={{
              // borderRadius: "50%",
              width: "4vmin",
              height: "4vmin",
              position: "absolute",
              right: 0,
              background: "#fff",
              borderRadius: "10px",
              cursor: "pointer",
              top: 0,
            }}
            onClick={() => setEditing(true)}
          />
        ) : null}
        <div className="ratings-area" style={{ flexDirection: "column" }}>
          {editing ? <UserEdit setEditing={setEditing} userInfo={currentUser} /> : userInfo}
        </div>
      </div>
    </div>
  );
};

export default UserEditInfo;
