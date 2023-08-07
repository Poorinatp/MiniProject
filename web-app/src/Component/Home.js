
import "./Home.css"
import {useNavigate,NavLink} from 'react-router-dom';


function Home()  {
	let activeClassName = "nav-active"

	const navigate = useNavigate();

	const navigateToDesign =()=>{
		navigate('/design')
	}

	return (
		<div>
			<nav>
			<img src="./logo.svg" alt="logo" />
			<NavLink to="/signup" className={({ isActive }) => isActive ? activeClassName : undefined }>Sign Up</NavLink>
			<NavLink to="/signin"className={({ isActive }) => isActive ? activeClassName : undefined} >Sign in</NavLink>
			</nav>
			
			<section>
				<h1>PHIMNIYOM</h1>
				<p>🌟 Unleash Your Creativity 🎨 Embrace Your Style 💫<br/>
				Step into a world of limitless possibilities with CanDesign Cloth - a revolutionary clothing line that combines the beauty of art with the essence of fashion.
				We believe that clothing is an extension of one's personality, and that's why we offer you the power to design your own bespoke garments.</p>
			</section>

		<button onClick={navigateToDesign}>start Do it!</button>

		</div>
	  );
	};
export default Home;