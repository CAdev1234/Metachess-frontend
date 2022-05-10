import React from "react";
import Button from "../Button";
import { navigate } from "gatsby";

const Home = () => {
  return (
    <>
      <div className="homePlayWrapper">
        <h1 style={{ marginBottom: "8px" }}>BRAINIACHESS</h1>
        <h3 style={{ marginBottom: "60px" }}>ONLINE CHESS GAME</h3>
        <Button onClick={() => navigate("/")}>PLAY</Button>
        <p style={{ position: "absolute", bottom: 0 }}>CHESSPIECES-ICON</p>
      </div>
      <div className="homeContainer">
        <h2>NOT JUST A GAME. A COMMUNITY</h2>
        <p className="homeParagraph">
        MetaChess is building an online chess gaming platform that is incentivized using digital currency. In a simpler statement, you earn rewards in the form of cryptocurrency for doing what you love doing, playing chess! 
        </p>
        <br />
        <p className="homeParagraph">Organization of online tournaments will be an active part of the MetaChess platform where participants can earn rewards, socialize and bet against their leading rivals!</p>
      </div>
    </>
  );
};

export default Home;
