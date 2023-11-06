import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import  "./Signin.css";
import NavBar from '../components/NavBar';
import Axios from "axios";
import Swal from 'sweetalert2';
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" ></meta>

const Signin = ({apihost}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault(); // ป้องกันการกระทำค่าเริ่มต้นของการส่งฟอร์ม

    const userData = {
      email,
      password,
    };

    Axios.post(`${apihost}/signin`, userData)
      .then(response => {
        if (response.status === 200) {
          const userData = {
            email: response.data.result[0].email,
            user_id: response.data.result[0].user_id,
            status: "success"
          }
          sessionStorage.setItem('userData', JSON.stringify(userData));
          Swal.fire('Login successful.', '', 'success');
          navigate('/design');
        } else {
          Swal.fire('Your email or password is incorrect.', '', 'error');
        }
      })
      .catch(error => {
        Swal.fire('Your email or password is incorrect.', '', 'error');
      });
  }

  return (
    <>
     <NavBar/> 
      <form className='Signin' onSubmit={handleSubmit}>
      <header>
        <h1>SIGN IN</h1>
      </header>
        <input
          type="email"
          id="email" autoFocus
          placeholder="Your Email"
          pattern="^[a-zA-Z0-9]+@(hotmail\.com|gmail\.com)$"
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
              maxLength="10"
          />
          <br />

        <button className="btn-signin" type="submit">Submit</button>
        <Link className="backto-signup" to="/signup">Sing Up</Link>
      </form>
    </>
  )
}

export default Signin;
