import googleLogo from "../src/assets/google.png";
import bg from "../src/assets/bg.png";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div
      style={{ backgroundImage: `url(${bg})` }}
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 py-8"
    >
      {/* Glass Container */}
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-10 flex flex-col items-center text-center">

        {/* Logo */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold text-blue-500">
            TalkToMe
          </h1>
        </div>

        {/* Subtitle */}
        <div className="mb-8 sm:mb-10 max-w-2xl">
          <p className="text-sm sm:text-lg md:text-xl text-gray-900 leading-relaxed">
            Turning simple messages into intelligent conversations
            that actually understand you.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">

          <Link
            className="w-full sm:w-auto px-8 sm:px-10 py-3 bg-green-500 hover:bg-green-600 transition-all duration-300 text-white rounded-xl text-base sm:text-lg font-semibold"
            to="/signup"
          >
            Sign Up
          </Link>

          <Link
            className="w-full sm:w-auto px-8 sm:px-10 py-3 bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white rounded-xl text-base sm:text-lg font-semibold"
            to="/login"
          >
            Login
          </Link>

        </div>

        {/* Google Login */}
        <div className="mt-8 sm:mt-10 text-white flex items-center gap-3 cursor-pointer hover:scale-105 transition-all duration-300">

          <img
            src={googleLogo}
            alt="Google Logo"
            className="h-5 w-5 sm:h-6 sm:w-6"
          />

          <h3 className="text-sm sm:text-base text-gray-900 md:text-lg">
            Login With Google
          </h3>

        </div>

      </div>
    </div>
  );
}

export default Landing;