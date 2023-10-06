import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import  "./Signup.css";
import NavBar from '../components/NavBar';
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" ></meta>

function Signup () {


	const [firstname,setFirstname] = useState("");
	const [lastname,setLastname] = useState("");
    const [tel,setTel] = useState("");
    const [email,setEmail] = useState("")
    const [address,setAddress] = useState("")
    const [city,setCity] = useState("")
    const [country,setCountry] = useState("")
    const [zipcode,setZipcode] = useState("")
	const navigate = useNavigate();
	


	function handleSubmit(e) {
        e.preventDefault();
        const form = e.currentTarget;
    
        if (form.checkValidity() === false) {
          form.reportValidity(); 
        } else {
          
          navigate('/design'); 
          console.log('You clicked submit.');
          console.log(firstname,lastname,tel,email,address,city,country,zipcode );
        }
      }

	
	return(
        <>
		<NavBar/>
		<form onSubmit={handleSubmit}>
			
				<header>
					<h1>SIGN UP</h1>
				</header>

				<input 
					type="text"  
					id="firstname" autoFocus
					placeholder="First Name"
					onChange={e =>{setFirstname(e.target.value)}}
                    required/> 
					<br/>

                 
				<input 
					type="text" 
					id="lastname"
					placeholder="Last Name"
					onChange={e =>{setLastname(e.target.value)}}
                    required/> 
					<br/>
                   
				<input 
					type="tel" 
					id="tel"
					placeholder="Your Phone"
					onChange={e =>{setTel(e.target.value)}}
                    required/> 
					<br/>

				<input 
					type="email" 
					id="email"
					placeholder="Your Email"
					onChange={e =>{setEmail(e.target.value)}}
                    required/> 
					<br/>
				
                <textarea
					type="text" 
					id="address"
					placeholder="Your Adderss"
					onChange={e =>{setAddress(e.target.value)}}
                    required/>
					<br/>

				<input 
					type="text" 
					id="city"
					placeholder="City"
					onChange={e =>{setCity(e.target.value)}}
                    required/> 
					<br/>

				<input 
					type="text" 
					id="country"
					placeholder="Country"
					onChange={e =>{setCountry(e.target.value)}}
                    required/> 
					<br/>

				<input 
					type="text" 
					id="zipcode"
					placeholder="Zip-code"
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