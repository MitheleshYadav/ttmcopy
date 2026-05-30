import { Browser } from 'leaflet';
import Location from '../Components/Location.jsx'
import Signup from '../Components/Signup.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from '../Components/Login.jsx';
import Landing from '../Components/Landing.jsx';
import Details from '../Components/Details.jsx';
import Request from '../Components/Request.jsx';
import Chat from '../Components/Chat.jsx';
import Setting from '../Components/Setting.jsx';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/location" element={<Location />} />
        <Route path="/details" element={<Details />} />
        <Route path="/requests" element={<Request />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/settings" element={<Setting />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
