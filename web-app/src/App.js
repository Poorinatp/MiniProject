import './App.css';
import Home from './pages/Home';
import Signin from './pages/Signin';
import {BrowserRouter,Routes,Route}  from 'react-router-dom';
import Signup from './pages/Signup';
import Design from './pages/Design';
import Profile from './pages/Profile';
import TestUpload from './pages/TestUpload';


function App() {
  return (
    <BrowserRouter>
    
		
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/signIn" element={<Signin/>}/>
        <Route path="/signUp" element={<Signup/>}/>
        <Route path="/design/:product_id" element={<Design />} />
        <Route path="/design" element={<Design />} />
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/test" element={<TestUpload/>}/>
      </Routes>
    </BrowserRouter>
  
  );
}

export default App;
