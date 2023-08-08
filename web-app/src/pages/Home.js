import "./Home.css"
import {useNavigate,NavLink} from 'react-router-dom';
import React from "react";
import NavBar from "../components/NavBar";

function Home()  {
	const navigate = useNavigate();

	const navigateToDesign =()=>{
		navigate('/design')
	}

	return (
		<main>
			<NavBar/>
			<div className="container1">
				<section>
					<h1>PHIMNIYOM</h1>
					<p>🌟 Unleash Your Creativity 🎨 Embrace Your Style 💫<br/>
					Step into a world of limitless possibilities with CanDesign Cloth - a revolutionary clothing line that combines the beauty of art with the essence of fashion. <br></br>
					We believe that clothing is an extension of one's personality, and that's why we offer you the power to design your own bespoke garments.</p>
				</section>

				<button onClick={navigateToDesign}>start Do it!</button>
			</div>
		</main>
	  );
	};
export default Home;