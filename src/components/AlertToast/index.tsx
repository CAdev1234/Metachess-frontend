import React, { Children } from "react";

interface IFriendReqProps{
    closeToast?: any,
    onConfirm: () => void,
    onDecline?: () => void,
    children?: React.ReactNode,
    buttonTitles?: {
      first: string,
      second: string
    }
    closeEnable?: {
      first: boolean,
      second: boolean
    }
}



export default function AlertToast ({  onConfirm, onDecline, closeToast, buttonTitles={first:"Confirm", second:"Decline"}, closeEnable={first:true,second:true},children }:IFriendReqProps) {
    return (
    <div className="alert__toast">
      <div className="alert__toast__message">
        {children}
      </div>
      <div className="alert__toast__buttons">
        <button onClick={
          () => { 
            onConfirm(); 
            if(closeEnable.first) closeToast()} 
          }
        >
           {buttonTitles.first} 
        </button>
        <button onClick={
          () => {
            if(onDecline) onDecline()
            if(closeEnable.second) closeToast()
          } 
          }
        >
          {buttonTitles.second} 
        </button>
      </div>
    </div>
)}