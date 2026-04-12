import bg from '../src/assets/bg.png';


function Login() {
  return (         
    <div className='bg-cover bg-no-repeat min-h-screen w-full flex flex-col items-center justify-center' style={{backgroundImage: `url(${bg})`}}>
         <div className="text-black pb-10">
            <h1 className="text-6xl font-bold text-blue-500">TalkToMe</h1>
        </div>
        <div className='text-4xl text-black pb-5'>
            Log In
        </div>
        <div className='flex flex-col w-full max-w-md'>
            <input type='text' placeholder='Email Address' className='border border-gray-500 p-4 rounded-lg m-2 w-full'/>
            <input type='text' placeholder='Password' className='border border-gray-500 p-4 rounded-lg m-2 w-full'/>
            <button className='bg-green-500 text-white p-4 rounded-lg m-2 w-full'> Log In</button>
        </div>
    </div>
  );
}

export default Login;