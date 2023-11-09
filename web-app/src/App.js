import './App.css';
import Home from './pages/Home';
import Signin from './pages/Signin';
import {BrowserRouter,Routes,Route}  from 'react-router-dom';
import Signup from './pages/Signup';
import Design from './pages/Design';
import Profile from './pages/Profile';
import TestUpload from './pages/TestUpload';
import Ordermanage from './pages/Ordermanage';


function App() {
  //const apihost = 'https://pimniyom-api.onrender.com';
  const apihost = 'http://localhost:8080';
  //const apihost = 'http://localhost:8090';
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home apihost={apihost}/>}/>
        <Route path="/signIn" element={<Signin apihost={apihost}/>}/>
        <Route path="/signUp" element={<Signup apihost={apihost}/>}/>
        <Route path="/design/:product_id" element={<Design apihost={apihost}/>} />
        <Route path="/design" element={<Design apihost={apihost}/>} />
        <Route path="/profile" element={<Profile apihost={apihost}/>}/>
        <Route path="/test" element={<TestUpload apihost={apihost}/>}/>
        <Route path="/admin" element={<Ordermanage apihost={apihost}/>}/>
      </Routes>
    </BrowserRouter>
  
  );
}

export default App;
