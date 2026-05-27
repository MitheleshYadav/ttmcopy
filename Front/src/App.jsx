import { Browser } from 'leaflet';
import Location from '../Components/Location.jsx'
import Signup from '../Components/Signup.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from '../Components/Login.jsx';
import Landing from '../Components/Landing.jsx';
import Details from '../Components/Details.jsx';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/location" element={<Location />} />
        <Route path="/details" element={<Details />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
