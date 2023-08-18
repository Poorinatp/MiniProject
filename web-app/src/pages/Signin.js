import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import  "./Signin.css";
import NavBar from '../components/NavBar';
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" ></meta>

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      form.reportValidity(); 
    } else {
      
      navigate('/design'); 
      console.log('You clicked submit.');
      console.log(email, password);
    }
  }

  return (
    <>
     <NavBar/> 
      <form onSubmit={handleSubmit}>
      <header>
        <h1>SIGN IN</h1>
      </header>
        <input
          type="email"
          id="email" autoFocus
          placeholder="Your Email"
          value={email}
          onChange={e => { setEmail(e.target.value) }}
          required
        />
        <br />
        
        <input
          type="password"
          id="password"
          placeholder="Your password"
          pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{10}"
          value={password}
          onChange={e => { setPassword(e.target.value) }}
          required 
           maxlength="10"
        />
        <br />

        <button className="btn-signin" type="submit">Submit</button>
        <Link className="backto-signup" to="/signup">Sing Up</Link>
      </form>
    </>
  )
}

export default Signin;
