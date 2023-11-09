import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

const NavBarAdmin = () => {
  let activeClassName = "nav-active";
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  const [openHamMenu, setOpenHamMenu] = useState(false);
  const location = useLocation();
  const [isHome, setIsHome] = useState(false);

  useEffect(() => {
    setIsHome(location.pathname === "/");
  }, [location.pathname]);

  useEffect(() => {
    const userIsLoggedIn = sessionStorage.getItem('userData');
    if (userIsLoggedIn) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('textData');
    sessionStorage.removeItem('imageData');
    navigate("/signin")
    setIsLogin(false); // Set the login state to false.
  };

  return (
    <nav className="no-select">
      <NavLink to="/" className="logo-link">
        <img className="navimg" src="/image/logo.png" alt="logo"/>
      </NavLink>

      <div className="auth-links">
        {isLogin ? (
          <div className="menu">
            <NavLink 
              to="/admin"
              className={({ isActive }) => (isActive ? activeClassName : undefined)}
            >
              Profile
            </NavLink>
            <NavLink
              to="/design"
              className={({ isActive }) => (isActive ? activeClassName : undefined)}
            >
              Design
            </NavLink>
            <NavLink
              to="/signin"
              className={({ isActive }) => (isActive ? activeClassName : undefined)}
              onClick={handleLogout}
            >
              Logout
            </NavLink>
          </div>
        ) : (
          <div className="menu">
            <NavLink
              to="/design"
              className={({ isActive }) => (isActive ? activeClassName : undefined)}
            >
              Design
            </NavLink>
            <NavLink
              to="/signup"
              className={({ isActive }) => (isActive ? activeClassName : undefined)}
            >
              Sign Up
            </NavLink>
            <NavLink
              to="/signin"
              className={({ isActive }) => (isActive ? activeClassName : undefined)}
            >
              Sign In
            </NavLink>
          </div>
        )}
      </div>
      <div className="ham-menu">
        <FontAwesomeIcon
          icon={faBars}
          className="icon-btn"
          id={`ham-icon`}
          onClick={() => setOpenHamMenu(!openHamMenu)}
          style={{
            opacity:openHamMenu?"0%":"100%"
          }}
        />
      </div>
      <div 
      className="menu-list"
      style={{
        display:openHamMenu?"flex":"none"
      }}
      >
        <FontAwesomeIcon
          icon={faXmark}
          className="icon-btn"
          id={`exit-icon`}
          onClick={() => setOpenHamMenu(!openHamMenu)}
          style={{
            
          }}
        />
        {!isLogin ?
        <>
          <NavLink
            to="/design"
            className={({ isActive }) => (isActive ? activeClassName : undefined)}
          >
            Design
          </NavLink>
          <NavLink
            to="/signup"
            className={({ isActive }) => (isActive ? activeClassName : undefined)}
          >
            Sign Up
          </NavLink>
          <NavLink
            to="/signin"
            className={({ isActive }) => (isActive ? activeClassName : undefined)}
          >
            Sign In
          </NavLink>
        </>:
        <>
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? activeClassName : undefined)}
          >
            Profile
          </NavLink>
          <NavLink
            to="/design"
            className={({ isActive }) => (isActive ? activeClassName : undefined)}
          >
            Design
          </NavLink>
          <NavLink
            to="/signin"
            className={({ isActive }) => (isActive ? activeClassName : undefined)}
            onClick={handleLogout}
          >
            Logout
          </NavLink>
        </>
        }
      </div>
    </nav>
  );
};

export default NavBarAdmin;
