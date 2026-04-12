import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Landing from '../Components/Landing.jsx'
import Signup from '../Components/Signup.jsx'
import Login from '../Components/Login.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Signup/> */}
    {/* <Login/> */}
    <Landing></Landing>
  </StrictMode>,
)
