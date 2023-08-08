import { NavLink } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
	let activeClassName = "nav-active"
    return(
        <nav>
            <NavLink to="/" className="logo-link">
                <img className="navimg" src="/image/logo.png" alt="logo"/>
            </NavLink>
            <div className="auth-links">
                <NavLink to="/signup" className={({ isActive }) => isActive ? activeClassName : undefined }>Sign Up</NavLink>
                <NavLink to="/signin" className={({ isActive }) => isActive ? activeClassName : undefined} >Sign In</NavLink>
            </div>
        </nav>
    )
}

export default NavBar;