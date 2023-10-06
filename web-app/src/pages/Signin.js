import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    navigate('/design');
  }

  return (
    <div>
      <header>
        <h1>SIGN IN</h1>
      </header>

      <form onSubmit={handleSubmit}>
        <label>Email address</label><br />
        <input
          type="email"
          id="email"
          placeholder="name@example.com"
          pattern="/^[0-9]+@(hotmail\.com|gmail\.com)$/"
          value={email}
          onChange={e => { setEmail(e.target.value) }} 
          required
        />
        <br />

        <label>Password</label><br />
        <input
          type="password"
          id="password"
          placeholder="password"
          pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{10}"
          value={password}
          onChange={e => { setPassword(e.target.value) }}
          maxLength={10}
          required 
        />
        <br />

        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default Signin;
