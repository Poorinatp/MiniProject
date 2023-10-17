import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import  "./Signup.css";
import NavBar from '../components/NavBar';
import Axios from "axios";
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" ></meta>

function Signup() {
	const [Firstname, setFirstname] = useState('');
	const [Lastname, setLastname] = useState('');
	const [Telephone, setTel] = useState('');
	const [Email, setEmail] = useState('');
	const [Password, setPassword] = useState('');
	const [Address, setAddress] = useState('');
	const [City, setCity] = useState('');
	const [Country, setCountry] = useState('');
	const [Zipcode, setZipcode] = useState('');
	const navigate = useNavigate();
  
	const handleSubmit = (e) => {
	  e.preventDefault();
	  const userData = {
		Firstname,
		Lastname,
		Telephone,
		Email,
		Password,
	  };
	  const addressData = {
		Address,
		City,
		Country,
		Zipcode,
	  };
  
	  Axios.post('http://localhost:8080/signup', { user: userData, address: addressData })
		.then((response) => {
		  console.log(response);
		  if (response.status === 200) {
			console.log('Signup successful');
			navigate('/signin');
		  } else {
			alert('Signup failed');
		  }
		})
		.catch((error) => {
		  console.error('Error sending request:', error);
		});
	};

	
	return(
        <>
		<NavBar/>
		<form className='Signup' onSubmit={handleSubmit}>
			
				<header>
					<h1>SIGN UP</h1>
				</header>

				<input 
					type="text"  
					id="Firstname" autoFocus
					placeholder="First Name"
					pattern="[a-zA-Z^ก-๏]+"
					onChange={e =>{setFirstname(e.target.value)}}
                    required/> 
					<br/>

                 
				<input 
					type="text" 
					id="Lastname"
					placeholder="Last Name"
					pattern="[a-zA-Z^ก-๏]+"
					onChange={e =>{setLastname(e.target.value)}}
                    required/> 
					<br/>
                   
				<input 
					type="tel" 
					id="Telephone"
					placeholder="+66XX-XXX-XXXX"
					pattern="[0]{1}[0-9]{2}-[0-9]{3}-[0-9]{4}"
					onChange={e =>{setTel(e.target.value)}}
                    required/> 
					<br/>

				<input 
					type="Email" 
					id="Email"
					placeholder="Your Email"
					pattern="^[a-zA-Z0-9]+@(hotmail\.com|gmail\.com)$"
					onChange={e =>{setEmail(e.target.value)}}
                    required/> 
					<br/>

				<input
					type="Password"
					id="Password"
					placeholder="Your Password"
					pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{10}"
					value={Password}
					onChange={e => { setPassword(e.target.value) }}
					required 
					maxlength="10"
					/>
					<br />
							
                <textarea
					type="text" 
					id="Address"
					placeholder="Your Adderss"
					pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{10}"
					onChange={e =>{setAddress(e.target.value)}}
                    required/>
					<br/>

				<input 
					type="text" 
					id="City"
					placeholder="City"
					pattern="[a-zA-Zก-๏.]+"
					onChange={e =>{setCity(e.target.value)}}
                    required/> 
					<br/>

				<input 
					type="text" 
					id="Country"
					placeholder="Country"
					pattern="[a-zA-Zก-๏]+"
					onChange={e =>{setCountry(e.target.value)}}
                    required/> 
					<br/>

				<input 
					type="text" 
					id="Zipcode"
					placeholder="Zip-code"
					pattern="[0-9]{5}"
					onChange={e =>{setZipcode(e.target.value)}}
                    required/> 
					<br/>

				<button className="btn-signup" type="submit">Sign up</button>
				<Link className='backto-signin' to="/signin">Sign in</Link>
			</form>
			
        </>
    )	
};
export default Signup;