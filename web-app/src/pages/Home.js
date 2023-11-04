import "./Home.css"
import {useNavigate} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import NavBar from "../components/NavBar";
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" ></meta>
 
const Home = ({apihost}) => {
	const navigate = useNavigate();
	const [exDesignList, setexDesignList] = useState([]);
	
	const navigateToDesign =()=>{
		navigate('/design')
	}
	const handleEditProduct = (product_id) => {
		navigate(`/design/${product_id}`)
	  };
	useEffect(()=>{
		Axios.get(`${apihost}/product/admin`)
			.then((result) => {
				setexDesignList(result.data);
				console.log(result)
			})
			.catch((error) => {
				console.error('Error fetching user data:', error);
			});
	}
	)
	return (
		<>
		<main >
			<NavBar/>
			<div className="container1">
				<SlideShow/>
				<section>
					<h1>PHIMNIYOM</h1>
					<p className="sm">🌟 Unleash Your Creativity 🎨 Embrace Your Style 💫<br/>
					Step into a world of limitless possibilities with CanDesign Cloth - a revolutionary clothing line that combines the beauty of art with the essence of fashion. <br></br>
					We believe that clothing is an extension of one's personality, and that's why we offer you the power to design your own bespoke garments.</p>
				</section>

				<button className="btn-home" onClick={navigateToDesign}>start Do it!</button>
			</div>
			<article className="card-example" >
              {exDesignList.map((exDesignList, key) => {
                return (
                  <section className="card-body-example" key={key}>
                    <img src={exDesignList.product_image} alt='img-his'/>
					<article className='btn-group'>
                      <FontAwesomeIcon
                        className='icon-btn'
                        size='2xs'
                        icon={faPen}
                        onClick={() => handleEditProduct(exDesignList.Product_id)}
                      />
                    </article>
                  </section>
                );
              })}
            </article>
		</main>
		<Footer/>

		</>
		
		
	  );
	};
export default Home;