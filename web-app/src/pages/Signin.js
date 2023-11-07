import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import  "./Signin.css";
import NavBar from '../components/NavBar';
import Axios from "axios";
import Swal from 'sweetalert2';
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" ></meta>

const Signin = ({ apihost }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function createCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    const cookie = `${name}=${value};expires=${expires.toUTCString()}`;
    document.cookie = cookie;
  }

  function loadUserDataFromCookie() {
    if(!getCookie('signin')){
    }else {
    const userDataCookie = getCookie('signin');
    if (userDataCookie) {
      const userData = JSON.parse(userDataCookie);
      setEmail(userData.email);
      // ไม่ต้องกำหนดค่าใน Input ของรหัสผ่านที่นี่
      // ตั้งค่าค่าใน Input อื่น ๆ ตามที่ต้องการ
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
        return decodeURIComponent(cookie.substring(name.length + 1)); // +1 เพื่อข้ามเครื่องหมาย '='
      }
    }
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const userData = {
      email,
      password,
    };
    const signin = {
      email
    
    };
    createCookie('signin', JSON.stringify(signin), 30);
    console.log(userData);
    Axios.post(`${apihost}/signin`, userData)
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          console.log(response.data);
          const userData = {
            email: response.data.result[0].Email,
            user_id: response.data.result[0].User_id,
            status: "success"
          };

          sessionStorage.setItem('userData', JSON.stringify(userData));
          Swal.fire({
            position: "bottom-end",
            title: 'Login successful.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          });
          navigate('/design');
        } else {
          Swal.fire('Your email or password is incorrect.', '', 'error');
        }
      })
      .catch(error => {
        Swal.fire('Your email or password is incorrect.', '', 'error');
      });
  }

        /*  createCookie('userData', JSON.stringify(userData), 30);
          Swal.fire('Login successful.', '', 'success');
          navigate('/design');
        } else {
          Swal.fire('Your email or password is incorrect.', '', 'error');
        }
      })
      .catch(error => {
        Swal.fire('Your email or password is incorrect.', '', 'error');
      });
  } */
 

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
          pattern="^[a-zA-Z0-9.]+@(hotmail\.com|gmail\.com)$"
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
