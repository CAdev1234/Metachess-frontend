import React, { useState, useContext, useEffect } from "react";
import ChessCanvas3D from '../../components/ChessCanvas3D'
import ReactDOM from 'react-dom';

const WarfrontGamePage = () => {
  return (
    <div>
      <ChessCanvas3D></ChessCanvas3D>
    </div>
  );
};

// ReactDOM.render(
//   <React.StrictMode>
//     <ChessCanvas3D />
//   </React.StrictMode>,
//   document.getElementById('___gatsby')
// );

export default WarfrontGamePage;
