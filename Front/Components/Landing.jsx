import googleLogo from '../src/assets/google.png';
import bg from '../src/assets/bg.png';

function Landing() {
  return (
    <div style={{backgroundImage: `url(${bg})`}} className=" bg-no-repeat bg-cover w-full min-h-screen flex flex-col items-center justify-center text-white" >
        <div className="text-black pb-15">
            <h1 className="text-8xl font-bold text-blue-500">TalkToMe</h1>
        </div>
        <div className="pb-15">
            <p className="text-xl text-gray-500">Turning Simple messages into intelligent conversations that actually understands you.</p>
        </div>
        <div className="text-black">
            <button className="px-10 py-2 bg-green-500 text-white mr-5 rounded-lg text-xl cursor-pointer">SignUp</button>
            <button className="px-10 py-2 bg-blue-500 text-white ml-5 rounded-lg text-xl cursor-pointer">Login</button>
        </div>
        <div className="mt-15 text-black flex items-center gap-2 cursor-pointer">
             <img src={googleLogo} alt="Google Logo" className='h-5 w-5' />
             <h3>Login With Google</h3>
        </div>
    </div>
  );
}

export default Landing;