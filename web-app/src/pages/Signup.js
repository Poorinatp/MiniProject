import { useState, useEffect  } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import  "./Signup.css";
import NavBar from '../components/NavBar';
import Axios from "axios";
import Swal from 'sweetalert2';
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" ></meta>

const Signup = ({apihost}) => {
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
  
	function loadUserDataFromCookie() {
		if(!getCookie('signup')){
		} else {
		const userDataCookie = getCookie('signup');
		if (userDataCookie) {
		  const userData = JSON.parse(userDataCookie);
		  setEmail(userData.Email);
		  setFirstname(userData.Firstname);
		  setLastname(userData.Lastname);
		  setTel(userData.Telephone);
		  setAddress(userData.Address);
		  setCity(userData.City);
		  setCountry(userData.Country);
		  setZipcode(userData.Zipcode);
		}
	  }
	}

	useEffect(() => {
		loadUserDataFromCookie();
	}, []);

	function getCookie(name) {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			if (cookie.startsWith(`${name}=`)) {
			return decodeURIComponent(cookie.substring(name.length + 1));
			}
		}
		return null;
	}

	function createCookie(name, value, days) {
		const expires = new Date();
		expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
		const cookie = `${name}=${value};expires=${expires.toUTCString()}`;
		document.cookie = cookie;
	}

	const handleSubmit = (e) => {
	  e.preventDefault();
	  const userData = {
		Firstname,
		Lastname,
		Telephone:Telephone.split('-').join(''),
		Email,
		Password,
	  };
	  const addressData = {
		Address,
		City,
		Country,
		Zipcode,
	  };
	  
	  const signup = {
		Firstname,
		Lastname,
		Telephone:Telephone.split('-').join(''),
		Email,
		Address,
		City,
		Country,
		Zipcode,
	  
	  };
	  createCookie('signup', JSON.stringify(signup), 30);
  
	  Axios.post(`${apihost}/signup`, { user: userData, address: addressData })
		.then((response) => {
		  if (response.status === 200) {
			Swal.fire({
				position: "bottom-end",
				title: 'Signup success. Please login.',
				icon: 'success',
				showConfirmButton: false,
				timer: 1500
			  });
			navigate('/signin');
		  } else {
			Swal.fire('Signup failed. Please try again.', '', 'error');
		  }
		})
		.catch((error) => {
			Swal.fire('Signup failed. Please try again.', '', 'error');
		});
	};

	const handleTelDisplay = () => {
		const rawText = [...Telephone.split('-').join('')]
        const telephoneNumber = []
        rawText.forEach((t, i) => {
            if (i % 3 === 0 && i !== 0 && i !== 9) telephoneNumber.push('-')
            telephoneNumber.push(t)
        })
        return telephoneNumber.join('')
	}
	
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
					value={Firstname}
					placeholder="First Name"
					pattern="[a-zA-Z^ก-๏]+"
					onChange={e =>{setFirstname(e.target.value)}}
                    required/> 
					<br/>

                 
				<input 
					type="text" 
					id="Lastname"
					value={Lastname}
					placeholder="Last Name"
					pattern="[a-zA-Z^ก-๏]+"
					onChange={e =>{setLastname(e.target.value)}}
                    required/> 
					<br/>
                   
				<div className="input">
					<input 
						type="text" 
						id="Telephone"
						placeholder="+66XX-XXX-XXXX"
						value={handleTelDisplay()}
						pattern="[0]{1}[0-9]{2}-[0-9]{3}-[0-9]{4}"
						onChange={e =>{setTel(e.target.value)}}
						required
						maxLength="12"
					/>
					<p className="input-requirements">
					* Please enter a valid telephone number in the format 011-111-1111.
					</p>
				</div>

				<div className="input">
					<input 
						type="Email" 
						id="Email"
						value={Email}
						placeholder="Your Email"
						pattern="^[a-zA-Z0-9.]+@(hotmail\.com|gmail\.com)$"
						onChange={e =>{setEmail(e.target.value)}}
						required
					/> 
					<p className="input-requirements">
					* Enter a valid email address ending with @hotmail.com or @gmail.com.
					</p>
				</div>

				<div className="input">
					<input
					type="password"
					id="Password"
					placeholder="Your Password"
					pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{10,}$"
					value={Password}
					onChange={(e) => {
						setPassword(e.target.value);
					}}
					required
					maxLength="10"
					/>
					<p className="input-requirements">
					* Password must be 10 characters long and consist of at least 1 letter of A-Z, a-z, and a number.
					</p>
				</div>
							
                <textarea
					type="text" 
					id="Address"
					value={Address}
					placeholder="Your Adderss"
					pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{10}"
					onChange={e =>{setAddress(e.target.value)}}
                    required/>
					<br/>

				<input 
					type="text" 
					id="City"
					value={City}
					placeholder="City"
					pattern="[a-zA-Zก-๏.]+"
					onChange={e =>{setCity(e.target.value)}}
                    required/> 
					<br/>

				<input 
					type="text" 
					id="Country"
					value={Country}
					placeholder="Country"
					pattern="[a-zA-Zก-๏]+"
					onChange={e =>{setCountry(e.target.value)}}
                    required/> 
					<br/>

				<input 
					type="text" 
					id="Zipcode"
					value={Zipcode}
					placeholder="Zip-code"
					pattern="[0-9]{5}"
					onChange={e =>{setZipcode(e.target.value)}}
					maxLength={5}
                    required/>
					<br/>

				<button className="btn-signup" type="submit">Sign up</button>
				<Link className='backto-signin' to="/signin">Sign in</Link>
			</form>
			
        </>
    )	
};
export default Signup;