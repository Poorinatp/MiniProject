import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
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
        <div>
            <header>
                <h1>SIGN UP</h1>
            </header>

			<form   onSubmit={handleSubmit}>
				<label>First name</label><br/>
				<input 
					type="text" 
					id="firstname"
					pattern="[a-zA-Z^ก-๏]+"
					onChange={e =>{setFirstname(e.target.value)}}
                    required/> 
					<br/>

                    <label>Last name</label><br/>
				<input 
					type="text" 
					id="lastname"
					pattern="[a-zA-Z^ก-๏]+"
					onChange={e =>{setLastname(e.target.value)}}
                    required/> 
					<br/>
                   
                    <label>Telephone</label><br/>
				<input 
					type="tel" 
					id="tel"
					placeholder="+66XX-XXX-XXXX"
					pattern="[0]{1}[0-9]{2}-[0-9]{3}-[0-9]{4}"
					onChange={e =>{setTel(e.target.value)}}
                    required/> 
					<br/>

                    <label>Email</label><br/>
				<input 
					type="email" 
					id="email"
					placeholder="name@example.com"
					onChange={e =>{setEmail(e.target.value)}}
                    required/> 
					<br/>

                    <label>Address</label><br/>
				
                <textarea
					type="text" 
					id="address"
					placeholder="Address"
					maxLength={200}
					onChange={e =>{setAddress(e.target.value)}}
                    required/>
					<br/>

                    <label>City</label><br/>
				<input 
					type="text" 
					id="city"
					placeholder="City"
					pattern="[a-zA-Zก-๏.]+"
					onChange={e =>{setCity(e.target.value)}}
                    required/> 
					<br/>

				
                    <label>Country</label><br/>
				<input 
					type="text" 
					id="country"
					placeholder="Country"
					pattern="[a-zA-Zก-๏]+"
					onChange={e =>{setCountry(e.target.value)}}
                    required/> 
					<br/>

                    <label>Zip-Code</label><br/>
				<input 
					type="text" 
					id="zipcode"
					placeholder="Zipcode"
					pattern="[0-9]{5}"
					onChange={e =>{setZipcode(e.target.value)}}
                    required/> 
					<br/>

				<button type="submit">Signup</button>
			</form>
        </div>
    )
};
export default Signup;