import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import  "./Signin.css";
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
      
      <form onSubmit={handleSubmit}>
      <header>
        <h1>SIGN IN</h1>
      </header>
        <input
          type="email"
          id="email"
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
        />
        <br />

        <button type="submit">Submit</button>
      </form>
    </>
  )
}

export default Signin;
