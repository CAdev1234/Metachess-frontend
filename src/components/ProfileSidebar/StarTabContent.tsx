import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StarIcon from "../../assets/images/star-icon.png";
import ChestIcon from "../../assets/images/TreasureChest.png";
import { NETWORK_LIST } from "../../constants/walletData";
import WALLET from "../../services/wallet.service";
import { Actions } from "../../store/user/user.action";
import { IUser } from "../../store/user/user.interfaces";
import Button from "../Button";
import Modal from "../Modal";
import DepositInput from "./DepositInput";

interface Props {
  currentUser: IUser;
}

const StarTabContent = ({ currentUser }: Props) => {
  if (!currentUser) return <div>Loading...</div>;
  const dispatch = useDispatch();
  const [isDepositOrWithDrawModal, setIsDepositOrWithDrawModal] = useState({isDeposit: false, isWithDraw: false})
  const [deposit, setDeposit] = useState({amount: null})
  const [withdraw, setWithdraw] = useState({amount: null})
  const [balance, setBalance] = useState(0)
  
  const handleDepositOrWithDrawModal = async(mode: string) => {
    const networkData = process.env.NODE_ENV === 'development' ? NETWORK_LIST.dev.networkList.bsc : NETWORK_LIST.prod.networkList.bsc
    const walletData = await WALLET.openMetamask(networkData)
    if (walletData.status === 'success') {
      if (mode === 'deposit') {
        setIsDepositOrWithDrawModal({...isDepositOrWithDrawModal, isDeposit: true, isWithDraw: false})
      }else {
        // if (currentUser.Balance <= withdraw.amount) {
        //   toast.error("You can't withdraw", {
        //     position: toast.POSITION.TOP_RIGHT,
        //     autoClose: 10000,
        //     closeOnClick: true,
        //   });
        //   return
        // }
        setIsDepositOrWithDrawModal({...isDepositOrWithDrawModal, isDeposit: false, isWithDraw: true})
      }
    }else {
      toast.error(walletData.data, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 10000,
        closeOnClick: true,
      });
    }  
    
    
  }

  const handleCloseDepositOrWithDrawModal = () => {
    setDeposit({...deposit, amount: 0})
    setWithdraw({...withdraw, amount: 0})
    setIsDepositOrWithDrawModal({...isDepositOrWithDrawModal, isDeposit: false, isWithDraw: false})
  }

  const handleDepositOrWithDraw = async() => {
    handleCloseDepositOrWithDrawModal()
    console.log(withdraw)
  }

  const handleMax = async() => {
    setWithdraw({...withdraw, amount: balance})
  }

  useEffect(() => {
    dispatch(Actions.fetchUserStatsOnce());
    const balanceInterval = setInterval(async() => {
      let balanceVal = await WALLET.getTokenBalance()
      setBalance(balanceVal)
    }, 5000)
    return () => {clearInterval(balanceInterval)}
  }, []);
  return (
    <>
      <div className="tabContent">
        <div className="overallItem">
          <p className="tabTitle">RATINGS</p>
          <div className="ratings-area">
            <div className="info">
              <p className="title">{currentUser.BulletElo}</p>
              <p className="subtitle">Bullet</p>
            </div>
            <div className="info">
              <p className="title">{currentUser.RapidElo}</p>
              <p className="subtitle">Rapid</p>
            </div>
            <div className="info">
              <p className="title">{currentUser.BlitzElo}</p>
              <p className="subtitle">Blitz</p>
            </div>
            <div className="info">
              <p className="title">{currentUser.ClassicalElo}</p>
              <p className="subtitle">Classical</p>
            </div>
          </div>
          {!currentUser.GuestId && (
            <div>
              <p className="tabTitle">{"OVERALL"}</p>
              <div style={{ display: "grid", gap: "2vmax", gridTemplateColumns: 'auto auto' }}>
                <div className="info-image">
                  <img src={StarIcon} />
                  <div>
                    <p className="title">{currentUser.WonGames}</p>
                    <p className="subtitle">Games won</p>
                  </div>
                </div>
                <div className="info-image">
                  <img src={ChestIcon} />
                  <div>
                    <p className="title">{currentUser.TreasuresFound}</p>
                    <p className="subtitle">Treasures Found</p>
                  </div>
                </div>
                <div className="info-image">
                  <img src={ChestIcon} />
                  <div>
                    <p className="title">{currentUser.Balance}</p>
                    <p className="subtitle">Balance</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="row">
            <div className="col-6">
              <button className="claimButton" onClick={() => handleDepositOrWithDrawModal('deposit')}>Deposit</button>
            </div>
            <div className="col-6">
              <button className="claimButton" onClick={() => handleDepositOrWithDrawModal('withdraw')}>Withdraw</button>
            </div>
          </div>
          
        </div>
      </div>

      {(isDepositOrWithDrawModal.isDeposit || isDepositOrWithDrawModal.isWithDraw) &&
        <Modal onClose={() => {handleCloseDepositOrWithDrawModal()}} isBlack>
          <div className="request-deposit-modal">
            <p className="title">
              {isDepositOrWithDrawModal.isWithDraw ? "Withdraw" : "Deposit"}
            </p>
            <br />
            <div className="balance">
              <span style={{marginLeft: 'auto'}}>Balance:</span>
              <span>{balance} wCSPR</span>
            </div>
            <DepositInput
              value={withdraw.amount === null ? '' : withdraw.amount} 
              enableMaxBtn={isDepositOrWithDrawModal.isWithDraw}
              onMaxClick={() => {handleMax()}} 
              onChange={(e) => {setWithdraw({...withdraw, amount: e.target.value})}} />
            <br />
            <Button 
              dark={true} 
              white={false} 
              small onClick={() => {handleDepositOrWithDraw()}}>Submit</Button>
          </div>
        </Modal>
      }
    </>
  );
};
export default StarTabContent;
