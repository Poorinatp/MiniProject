import './App.css';
import Home from './pages/Home';
import Signin from './pages/Signin';
import {BrowserRouter,Routes,Route}  from 'react-router-dom';
import Signup from './pages/Signup';
import Design from './pages/Design';


function App() {
  return (
    <BrowserRouter>
    
		
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/SignIn" element={<Signin/>}/>
        <Route path="/SignUp" element={<Signup/>}/>
        <Route path="/Design" element={<Design/>}/>
      </Routes>
    </BrowserRouter>
  
  );
}

export default App;
