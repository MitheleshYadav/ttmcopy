import { Link } from "react-router-dom";
import bg from "../src/assets/bg.png";
import googleLogo from "../src/assets/google.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("Your name");
  const [email, setEmail] = useState("Your Email");
  const [pass, setPass] = useState("Your password");

  function submit() {

    const data = {
      user_name: name,
      user_email: email,
      user_password: pass,
    };

    fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

      .then((response) => {
        if(response.status == 201){
           navigate("/location", {
          state: {
            username: name,
          },
        });
        }
        console.log(response.status);
        return response.json();
      }).catch((err) => {
        window.alert("NOT WORKING!!!");
        console.error(err);
      });
  }
  return (
    <div
      className="bg-cover bg-no-repeat min-h-screen w-full flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="text-black pb-15">
        <h1 className="text-6xl font-bold text-blue-500">TalkToMe</h1>
      </div>
      <div className="text-4xl text-black pb-15">Sign Up</div>
      <div className="flex flex-col w-full max-w-md">
        <input
          type="text"
          placeholder={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-500 p-4 rounded-lg m-2 w-full"
        />
        <input
          type="text"
          placeholder={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-500 p-4 rounded-lg m-2 w-full"
        />
        <input
          type="text"
          placeholder={pass}
          onChange={(e) => setPass(e.target.value)}
          className="border border-gray-500 p-4 rounded-lg m-2 w-full"
        />
        <button
          className="bg-green-500 text-white p-4 rounded-lg m-2 w-full"
          onClick={submit}
        >
          {" "}
          Sign Up
        </button>
      </div>
      <div className="mt-10 text-black flex items-center gap-2 cursor-pointer">
        <img src={googleLogo} alt="Google Logo" className="h-5 w-5" />
        <h3>Login With Google</h3>
      </div>
      <div className="mt-5">
        <p>
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
