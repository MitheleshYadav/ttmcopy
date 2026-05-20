import bg from '../src/assets/bg.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Login() {
  const [email, setEmail] = useState("Your Email");
  const [pass, setPass] = useState("Your password");
  const navigate = useNavigate();
function submitForm(){

  const data = {
    user_email: email,
    user_password: pass,
  };
  console.log(data);

  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  .then((response) => {

    return response.json();

  })

  .then((data) => {

    localStorage.setItem("token", data.token);

    if(data.message === "Login successful"){

      navigate("/location", {
        state: {
          username: data.username
        },
      });

    }

  })

  .catch((err) => {

    window.alert("NOT WORKING!!!");

    console.error(err);

  });

}
  return (         
    <div className='bg-cover bg-no-repeat min-h-screen w-full flex flex-col items-center justify-center' style={{backgroundImage: `url(${bg})`}}>
         <div className="text-black pb-10">
            <h1 className="text-6xl font-bold text-blue-500">TalkToMe</h1>
        </div>
        <div className='text-4xl text-black pb-5'>
            Log In
        </div>
        <div className='flex flex-col w-full max-w-md'>
            <input onChange={(e) => setEmail(e.target.value)} type='text' placeholder='Email Address' className='border border-gray-500 p-4 rounded-lg m-2 w-full'/>
            <input onChange={(e) => setPass(e.target.value)} type='text' placeholder='Password' className='border border-gray-500 p-4 rounded-lg m-2 w-full'/>
            <button onClick={submitForm} className='bg-green-500 text-white p-4 rounded-lg m-2 w-full'> Log In</button>
        </div>
    </div>
  );
}

export default Login;