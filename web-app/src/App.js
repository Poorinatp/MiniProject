import './App.css';
import Home from './pages/Home';
import Signin from './pages/Signin';
import {BrowserRouter,Routes,Route}  from 'react-router-dom';
import Signup from './pages/Signup';
import Design from './pages/Design';
import Profile from './pages/Profile';


function App() {
  return (
    <BrowserRouter>
    
		
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/SignIn" element={<Signin/>}/>
        <Route path="/SignUp" element={<Signup/>}/>
        <Route path="/Design" element={<Design/>}/>
        <Route path="/Profile" element={<Profile/>}/>
      </Routes>
    </BrowserRouter>
  
  );
}

export default App;
