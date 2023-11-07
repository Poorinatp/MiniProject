import "./Home.css"
import {useNavigate} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Axios from 'axios';
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" ></meta>
 
const Home = ({apihost}) => {
	const navigate = useNavigate();
	const [exDesignList, setexDesignList] = useState([]);

    const [imgname, setImgname] = useState([]);

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
			})
			.catch((error) => {
				console.error('Error fetching user data:', error);
			});
		Axios
		.get(`${apihost}/picture`)
		.then((response) => {
			setImgname(response.data)
		})
		.catch((error) => {});
	},[apihost])
	return (
		<>
		<main className="home">
			<NavBar/>
			<div className="container1">
				{/* <SlideShow/> */}
				<section>
					<h1>PHIMNIYOM</h1>
					<p className="sm">🌟 Unleash Your Creativity 🎨 Embrace Your Style 💫<br/>
					Step into a world of limitless possibilities with CanDesign Cloth - a revolutionary clothing line that combines the beauty of art with the essence of fashion. <br></br>
					We believe that clothing is an extension of one's personality, and that's why we offer you the power to design your own bespoke garments.</p>
				</section>

				<button className="btn-home" onClick={navigateToDesign}>start Do it!</button>
			</div>
			<div className="example-container" >
				<p className="title">Have an example design</p>
              {exDesignList.map((example, index) => {
                return (
                  <div className="example-card" key={`example-card-${index}`}>
					<div className="card-body-img"
						style={{
							gridColumn: index%2===0?"1/2":"2/3",
							gridRow: "1/1",
							transform: `perspective(1000px) rotateY(${index%2===0?30:-30}deg)`
						}}
						key={`card-body-img-${index}`}>
                    	<img src={example.product_image} alt='img-example'/>
					</div>
					<div className="card-body-detail"
						style={{
							gridColumn: index%2===0?"2/3":"1/2",
							gridRow: "1/1"
						}}
						key={`card-detail-${index}`}>
						<h2 key={`card-detail-title-${index}`}>
							This is an example of designs that we suggest you.<br/>Come and create your own creatively designed <br/> T-shirts and show the world who you are.
						</h2>
						<button key={`card-detail-btn-${index}`} onClick={() => handleEditProduct(example.product_id)}>
							Get Started
						</button>
					</div>
                  </div>
                );
              })}
            </div>
			<div className="example-img-container">
				<p className="title">Many example images</p>
				<div className="example-img-container-grid">
					{imgname.slice(0, 20).map((src, index) => {
						return(
							<div key={`card-body-${index}`} className="card-body-item">
								<img className="img" key={index} src={`picture/${src}`} alt={`example-${index + 1}`} />
							</div>
						)
					})}
				</div>
			</div>
		</main>
		<Footer/>
		</>
	  );
	};
export default Home;