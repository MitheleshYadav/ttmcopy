import { Link, useNavigate } from "react-router-dom";
import bg from "../src/assets/bg.png";
import googleLogo from "../src/assets/google.png";
import { useState } from "react";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  function submit() {
    let latitude;
    let longitude;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        console.log(latitude, longitude);
      })
    const data = {
      user_name: name,
      user_email: email,
      user_password: pass,
    };

    fetch("http://192.168.1.23:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 201) {
          navigate("/location", {
            state: {
              username: name,
            },
          });
        }

        console.log(response.status);
        return response.json();
      })

      .catch((err) => {
          window.alert(err.message);
          console.error(err);
      });
  }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 py-8"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="w-full max-w-md bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8">
        
        {/* Logo + Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-blue-500">
            TalkToMe
          </h1>

          <h2 className="text-2xl sm:text-3xl text-black mt-4">
            Sign Up
          </h2>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-400 p-3 sm:p-4 rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="email"
            placeholder="Your Email"
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-400 p-3 sm:p-4 rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Your Password"
            onChange={(e) => setPass(e.target.value)}
            className="border border-gray-400 p-3 sm:p-4 rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            className="bg-green-500 hover:bg-green-600 transition-all duration-300 text-white p-3 sm:p-4 rounded-lg w-full font-semibold"
            onClick={submit}
          >
            Sign Up
          </button>
        </div>

        {/* Google Login */}
        <div className="mt-6 flex items-center justify-center gap-3 cursor-pointer text-black hover:scale-105 transition-all duration-300">
          <img
            src={googleLogo}
            alt="Google Logo"
            className="h-5 w-5 sm:h-6 sm:w-6"
          />
          <h3 className="text-sm sm:text-base">Login With Google</h3>
        </div>

        {/* Login Redirect */}
        <div className="mt-6 text-center text-sm sm:text-base">
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 font-semibold hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Signup;