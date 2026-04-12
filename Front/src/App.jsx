import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from '../Components/Landing.jsx'
import Signup from '../Components/Signup.jsx'
import Login from '../Components/Login.jsx'

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><Landing /></>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
