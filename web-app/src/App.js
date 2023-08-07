import './App.css';
import Home from './Component/Home';
import Signin from './Component/Signin';
import Design from './Component/Design';
import {BrowserRouter,Routes,Route}  from 'react-router-dom';
import Signup from './Component/Signup';


function App() {
  return (
    <BrowserRouter>
    
		
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/SignIn" element={<Signin/>}/>
        <Route path="/SignUp" element={<Signup/>}/>
        <Route path="/design" element={<Design/>}/>
      </Routes>
    </BrowserRouter>
  
  );
}

export default App;
