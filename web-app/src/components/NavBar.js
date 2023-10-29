import { NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { useEffect, useState } from "react";

const NavBar = () => {
  let activeClassName = "nav-active";
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate(); // Add this line to get the navigate function.

  useEffect(() => {
    // Check if the user is logged in, for example, by examining sessionStorage or a token.
    // You can set a flag in sessionStorage when the user logs in and clear it when they log out.
    const userIsLoggedIn = sessionStorage.getItem('userData'); // Check your storage for the user login status.
    //console.log(userIsLoggedIn)
    if (userIsLoggedIn) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('userData');
    navigate("/signin")
    setIsLogin(false); // Set the login state to false.
  };
  const handleProfile = () => {
    setIsLogin(true);
    navigate("/profile")
  };


  return (
    <nav>
      <NavLink to="/" className="logo-link">
        <img className="navimg" src="/image/logo.png"/>
      </NavLink>
      <div className="auth-links">
        {isLogin ? (
          <>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={handleProfile}>Profile</button>
        </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
