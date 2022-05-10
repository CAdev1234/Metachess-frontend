import React, { useEffect } from "react";
import Confetti from 'react-confetti'

const CelebrationOverlay = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "initial");
  }, []);
  return (
    <div className="overlay-div-celebration">
      <Confetti />
      <div className="headerWrapper">
        <div className="header-heading">Level 3 Treasure Found!</div>
      </div>
    </div>
  );
};

export default CelebrationOverlay;
