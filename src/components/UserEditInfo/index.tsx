import React, { SyntheticEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../services/api.service";
import { ENDPOINTS } from "../../services/endpoints";
import TextField from "../TextField";
import Select from "../Select";
import { useDispatch, useSelector } from "react-redux";
import { Actions } from "../../store/user/user.action";
import Button from "../Button";
import store from "../../store";
import { IUser } from "../../store/user/user.interfaces";
import { IAppState } from "../../store/reducers";
import WALLET from "../../services/wallet.service";

export enum UserTypes {
  "player" = 1,
  "arbiter",
  "Event Organizer",
  "Manager/Sponsor",
  "Instructor",
  "Others",
}

declare var window: any

interface Country {
  Id: number;
  Name: string;
  Code: string;
}

interface CountryListType extends Country {
  value: number;
  label: string;
  Code: string;
}

export interface countryList extends Array<CountryListType> {}

interface IProps {
  setEditing: Function;
  userInfo: IUser
}

const UserEditInfo = (props: IProps) => {
  const user = useSelector((state: IAppState) => state.user.currentUser);
  const [userType, setUserType] =
    useState<{ label: string; value: UserTypes }>(null);
  const [country, setCountry] = useState<CountryListType>(null);
  const [countries, setCountries] = useState<countryList>([]);
  const [name, setName] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [avatarName, setAvatarName] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const dispatch = useDispatch();
  const userTypes = [
    "player",
    "arbiter",
    "Event Organizer",
    "Manager/Sponsor",
    "Instructor",
    "Others",
  ].map((e: string) => ({ label: e, value: UserTypes[e] }));
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    props.setEditing(false);
    var isValidAddress = await WALLET.validateAddress(walletAddress, 'Binance')
    if (!isValidAddress) {
      window.alert('Invalid address')
      return
    }
    const bodyData = {
      Fullname: name,
      Type: userType.value,
      CountryId: country.value,
      Avatar: avatar,
    }
    if (!props.userInfo.WalletAddress) {
      Object.assign(bodyData, {WalletAddress: walletAddress})
    }
    dispatch(
      Actions.updateUser(bodyData)
    );
  };
  const handleSelectInputChange = (name: string, selectedOption: any) => {
    // console.log(selectedOption);
    if (name !== "userType") {
      setCountry(selectedOption);
    } else {
      setUserType(selectedOption);
    }
  };

  const handleConnectWallet = async () => {
    // store.dispatch(Actions.walletConnect());
    window.alert("Once wallet is registered, we can't change it")
    const data = await WALLET.openMetamask()
    if (data.status === 'success') setWalletAddress((data.data as any).address)
    else {
      toast.error(String(data.data), {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 10000,
        closeOnClick: true,
      });
    }
  }

  const evmEventListener = () => {
    try {
      window.ethereum.on('accountsChanged', async (accounts: any) => {
        console.log("changed_accounts=", accounts)
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
        }else {
          setWalletAddress(null)
        }
      })
    } catch (error) {
      console.log(error)
    }
    
  }

  const imageInputChange = (e1: any) => {
    const reader = new FileReader();
    const name = e1.target.files[0].name;
    reader.onload = function (e2) {
      var image = new Image();
      image.src = e2.target.result as string;
      image.onload = function (e3) {
        var height = this.height;
        var width = this.width;
        if (height > 100 || width > 100) {
          toast.error("Please Upload an image less than 100x100 size");
          return false;
        }
        setAvatar(e2.target.result as string);
        setAvatarName(name);
        return true;
      };
    };
    reader.readAsDataURL(e1.target.files[0]);
  };

  useEffect(() => {
    setName(props.userInfo.Username)
    setWalletAddress(props.userInfo.WalletAddress)

    evmEventListener()
    
    const func = async () => {
      const res = await API.execute("GET", ENDPOINTS.GET_COUNTRIES);
      const countriesList = res.map((country: Country) => {
        return {
          ...country,
          label: country.Name,
          value: country.Id,
        };
      });
      setCountries(countriesList);
    };
    func();
  }, []);
  return (
    <div className="Form-container">
      <div className="Form-wrapper">
        <form
          className="signup-page__form"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <label className="Lables" style={{ color: "#fff" }}>
            Name
          </label>
          <TextField
            type="text"
            label="John.snow"
            autoComplete="off"
            value={props.userInfo.Username}
            name="name"
            onChange={(e: SyntheticEvent) => {
              setName((e.target as HTMLInputElement).value);
            }}
            required={true}
          />
          <label className="Lables" style={{ color: "#fff" }}>
            User Type
          </label>
          <Select
            placeholder="select usertype"
            label="user type"
            options={userTypes}
            value={userType}
            name="userType"
            onChange={(selectedOption: any) => {
              handleSelectInputChange("userType", selectedOption);
            }}
          />
          <label className="Lables" style={{ color: "#fff" }}>
            Country
          </label>
          <Select
            placeholder="select country"
            label="country"
            options={countries}
            value={country}
            name="country"
            onChange={(selectedOption: any) => {
              handleSelectInputChange("country", selectedOption);
            }}
          />
          <label className="Lables" style={{ color: "#fff" }}>
            Wallet Address
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <TextField
              type="text"
              // label="5J3mBbAH58CpQ3Y5RNJpUKPE62SQ5tfcvU2JpbnkeyhfsYB1Jcn"
              autoComplete="off"
              value={walletAddress}
              name="Wallet"
              onChange={(e: SyntheticEvent) => {
                setWalletAddress((e.target as HTMLInputElement).value);
              }}
              required={true}
              disabled={walletAddress !== null}
            />
            {props.userInfo.WalletAddress === null && walletAddress === null && <Button type="button" small={false} dark={true} style={{ fontSize: '15px' }}
              onClick={handleConnectWallet}>Connect Wallet</Button>}
          </div>
          
          <label className="Lables" style={{ color: "#fff" }}>
            Avatar
          </label>
          <label
            htmlFor="avatarInput"
            className="avatarLabel"
            style={{ color: "#fff" }}
          >
            {(avatarName && avatarName + " Selected! Click to change") ||
              "No Image Selected! Click to select"}
          </label>
          <input
            type="file"
            onChange={imageInputChange}
            accept="image/*"
            id="avatarInput"
            style={{ display: "none" }}
          />
          <button className="claimButton">Update</button>
        </form>
      </div>
    </div>
  );
};

export default UserEditInfo;
