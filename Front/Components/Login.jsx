import bg from '../src/assets/bg.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  function submitForm() {

    navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const data = {
        user_email: email,
        user_password: pass,
        latitude: latitude,
        longitude: longitude,
      };
      console.log(data);

      fetch("http://192.168.1.23:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        localStorage.setItem("token", result.token);

        if (result.message === "Login successful") {
          navigate("/location", {
            state: {
              username: result.username,
            },
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });

    },

    (error) => {
      console.log(error);
      alert("Location permission denied");
    }

  );
  }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="w-full max-w-md bg-white/20 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl">
        
        <div className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-blue-500">
            TalkToMe
          </h1>
          <p className="text-2xl sm:text-3xl text-black mt-4">
            Log In
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email Address"
            className="border border-gray-400 p-3 sm:p-4 rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            onChange={(e) => setPass(e.target.value)}
            type="password"
            placeholder="Password"
            className="border border-gray-400 p-3 sm:p-4 rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={submitForm}
            className="bg-green-500 hover:bg-green-600 transition-all duration-300 text-white p-3 sm:p-4 rounded-lg w-full font-semibold"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;