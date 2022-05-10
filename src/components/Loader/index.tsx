import React from "react";
import "./index.scss"

const Loader = () => {


    return (<div className="loader-container"> 
                <div className="lds-grid">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>);
} 


export default Loader;