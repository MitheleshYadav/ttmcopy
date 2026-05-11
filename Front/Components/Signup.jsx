import { Link } from 'react-router-dom';
import bg from '../src/assets/bg.png';
import googleLogo from '../src/assets/google.png';
import { useState } from 'react';

function Signup() {
  const [name, setName] = useState("Your name");
  const [email, setEmail] = useState("Your Email");
  const [pass, setPass]= useState("Your password");

  function submit(){
    const data = {
        user_name : name,
        user_email : email,
        user_password : pass
    }
    const result = fetch('http://localhost:3000/',{
        method : 'GET',
        headers : {
            'content-type' : 'application/JSON'
        },
        body : JSON.stringify(data)
    })
    result.then(window.alert("Its working")).catch(window.alert("NOT WORKING!!!"))
  }
  return (         
    <div className='bg-cover bg-no-repeat min-h-screen w-full flex flex-col items-center justify-center' style={{backgroundImage: `url(${bg})`}}>
         <div className="text-black pb-15">
            <h1 className="text-6xl font-bold text-blue-500">TalkToMe</h1>
        </div>
        <div className='text-4xl text-black pb-15'>
            Sign Up
        </div>
        <div className='flex flex-col w-full max-w-md'>
            <input type='text' placeholder= {name} onChange={(e) => setName(e.target.value)} className='border border-gray-500 p-4 rounded-lg m-2 w-full'/>
            <input type='text' placeholder= {email} onChange={(e) => setEmail(e.target.value)} className='border border-gray-500 p-4 rounded-lg m-2 w-full'/>
            <input type='text' placeholder= {pass} onChange={(e) => setPass(e.target.value)} className='border border-gray-500 p-4 rounded-lg m-2 w-full'/>
            <button className='bg-green-500 text-white p-4 rounded-lg m-2 w-full' onClick={submit}> Sign Up</button>
        </div>
        <div className="mt-10 text-black flex items-center gap-2 cursor-pointer">
            <img src={googleLogo} alt="Google Logo" className='h-5 w-5' />
            <h3>Login With Google</h3>
        </div>
        <div className='mt-5'>
            <p>Already have an account? <Link to="/login" className='text-blue-500'>Log In</Link></p>
        </div>
    </div>
  );
}

export default Signup;