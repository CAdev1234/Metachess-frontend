import React, { useState, useEffect } from "react";
import { Link, navigate } from "gatsby";
import HeaderAccount from "../HeaderAccount";
import store from "../../store";
import { Actions } from "../../store/user/user.action";
import { MODES } from "../../constants/playModes";
import { MAIN_WEBSITE } from "../../config";
import BrainiacChessLogo from "../../assets/images/metachess_logo_horizontal.png";
interface Props {
  transparent?: boolean;
  uri: string;
}


export const HeaderNavigatorItem = ({
  title,
  to,
  url,
  active,
  className,
}: {
  title: string;
  to?: string;
  url?: string;
  active?: boolean;
  className?: string;
}) => {
  return (
    <a
      onClick={() => {
        if(url) {
          window.location.href = url;
        } else {
          store.dispatch(Actions.setChoseMode(MODES.CHOSE_MODE));
          navigate(to);
        }
      }}
      className={`headerNavigatorItem ${className || ""}`}
    >
      <p className={`headerNavigatorItemTitle ${active ? "active" : ""}`}>
        {title}
      </p>
      {/* <div
        className={`headerActiveIndicator ${
          active ? "headerActiveIndicatorActive" : ""
        }`}
      /> */}
    </a>
  );
};
export const HeaderLogo = ({ setMenu, menu }) => {
  return (
    <div className="headerNavigatorContainer headerNavigatorMobile">
      <div>
        <Link className="mainLogo" to={MAIN_WEBSITE}>
          <img src={BrainiacChessLogo} className="headerNavigatorLogo" />
        </Link>
      </div>
      <div className="toggleBtn" onClick={() => menu === 'flex' ? setMenu('none') : setMenu('flex')}>
        <img src="https://img.icons8.com/ios-filled/50/ffffff/menu--v1.png" />
      </div>
    </div>
  );
};

export const HeaderNavigator = ({ currentUri, menu }: { currentUri: string, menu: string }) => {
  return (
    <div className="headerNavigatorContainer headerNavigatorContainerMobile" style={{ display: `${menu}` }}>
      <HeaderNavigatorItem to="/" title="PLAY" active={currentUri === "/"} />
      <HeaderNavigatorItem
        to="/tutorial"
        title="TUTORIAL"
        active={currentUri === "/tutorial"}
      />
      <HeaderNavigatorItem
        to="/watch"
        title="WATCH"
        active={currentUri === "/watch"}
      />
      <HeaderNavigatorItem
        to="/"
        title="COMMUNITY"
        active={currentUri === "/community"}
      />
    </div>
  );
};

export const withItemNumberIndicator = (
  component: JSX.Element,
  { number }: { number: number }
) => (
  <div className="withItemNumberIndicatorContainer">
    <div className="itemNumberIndicatorContainer">
      <p className="itemNumberIndicatorTitle"> {number}</p>
    </div>
    {component}
  </div>
);

// export const HeaderAccount = () => {
//   // const dispatch = useDispatch()
//   return (
//     <div className="headerNavigatorContainer">
//       {/* <div className="headerNavigatorItem">
//         {withItemNumberIndicator(<img src={MainLogo} style={{height: 38}} onClick={() => dispatch(chatActions.toggleSideChat())}/>, { number: 2 })}
//       </div>
//       <div className="headerNavigatorItem">
//         {withItemNumberIndicator(<img src={BellIcon} style={{height: 38}}/>, { number: 2 })}
//       </div> */}
//       <Link to="/account" className="headerNavigatorItem headerAccountContainer">
//         <img src={SmallPieceIcon} style={{height: '40px', width: '40px'}}/>
//         <p className="headerNavigatorAccountTitle">Akumasy</p>
//       </Link>
//     </div>
//   );
// };


const Header = ({ ...restProps }: Props) => {
  const [menu, setMenu] = useState("flex")
  const screenWidth=()=>{
    if(window.innerWidth<=768){
      setMenu("none")
    }
  }
 useEffect(() => {
   screenWidth()
 }, []) 
  window.onresize = resize;
  function resize() {
    if(window.innerWidth<=768){
      setMenu("none")
    }
    if(window.innerWidth>768){
      setMenu("flex")
    }
  }

  return (
    <div className={`headerContainer`}>
      <HeaderLogo setMenu={setMenu} menu={menu} />
      <HeaderNavigator currentUri={restProps.uri} menu={menu} />
      <HeaderAccount menu={menu} />
      {/* <a className="test" onClick={()=>setMenu(true)}><i className="fas fa-bars"  aria-hidden="true"></i></a>
      {menu?
      <HeaderNavigator currentUri={restProps.uri} />
      
      :""} */}
    </div>
  );
};

export default Header;
