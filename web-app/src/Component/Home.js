import "./Home.css"
import {useNavigate,NavLink} from 'react-router-dom';
import React from "react";

function Home()  {
	let activeClassName = "nav-active"

	const navigate = useNavigate();

	const navigateToDesign =()=>{
		navigate('/design')
	}

	return (
		<main>
			<nav>
			<img src="./image/logo.png" alt="logo" />
			<NavLink to="/signup" className={({ isActive }) => isActive ? activeClassName : undefined }>Sign Up</NavLink>
			<NavLink to="/signin"className={({ isActive }) => isActive ? activeClassName : undefined} >Sign in</NavLink>
			</nav>
			
			<section>
				<h1>PHIMNIYOM</h1>
				<p>🌟 Unleash Your Creativity 🎨 Embrace Your Style 💫<br/>
				Step into a world of limitless possibilities with CanDesign Cloth - a revolutionary clothing line that combines the beauty of art with the essence of fashion. <br></br>
				We believe that clothing is an extension of one's personality, and that's why we offer you the power to design your own bespoke garments.</p>
			</section>

			<button onClick={navigateToDesign}>start Do it!</button>

			

		</main>
	  );
	};
export default Home;