import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import  "./Signin.css";
import NavBar from '../components/NavBar';
import Axios from "axios";
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" ></meta>

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault(); // ป้องกันการกระทำค่าเริ่มต้นของการส่งฟอร์ม

    const userData = {
      email,
      password,
    };

    console.log (userData)
    Axios.post('http://localhost:8080/signin', userData)
      .then(response => {
        console.log(response)
        if (response.status === 200) {
          console.log(response.data)
          const userData = {
            email: response.data.result.Email,
            user_id: response.data.result.User_id,
            status: "success"
          }
          sessionStorage.setItem('userData', JSON.stringify(userData));
          navigate('/design');
        } else {
          alert('เข้าสู่ระบบล้มเหลว');
        }
      })
      .catch(error => {
        console.error('ข้อผิดพลาดในการส่งคำขอ:', error);
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
