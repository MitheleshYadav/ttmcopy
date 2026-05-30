import { use, useState } from "react";
import { Camera, User, PenLine, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Details() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [preview, setPreview] = useState(null);

  function submit(){
    const data = {
        profile_name : name,
        about : about,
    }

    console.log(data);

    fetch("http://192.168.1.23:3000/details",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data)
    }).then((response)=>{
        if(response.status === 201){
            navigate("/location", {state : {username : name}})
        }
    }).catch((err)=>{
        console.log(err);
    })
  }

  // IMAGE PREVIEW
  function handleImage(e) {
    const file = e.target.files[0];

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-3 md:p-6 flex items-center justify-center">
      {/* MAIN CONTAINER */}
      <div className="w-full max-w-[1400px] bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-200 grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex relative bg-gradient-to-br from-[#F8F5FF] to-[#F3F0FF] p-10 flex-col justify-between">
          {/* TOP */}
          <div>
            {/* LOGO */}
            <div className="w-20 h-20 rounded-full border border-violet-200 flex items-center justify-center">
              <div className="w-8 h-8 bg-violet-500 rounded-full"></div>
            </div>

            {/* TEXT */}
            <div className="mt-16">
              <h1 className="text-5xl font-bold text-[#111827] leading-tight">
                Welcome to
                <br />
                <span className="text-violet-600">TalkToMe 👋</span>
              </h1>

              <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-[400px]">
                Let's complete your profile so others can know you better.
              </p>
            </div>
          </div>

          {/* BOTTOM DESIGN */}
          <div className="relative h-[250px]">
            <div className="absolute left-0 bottom-0 w-full h-[180px] bg-violet-100 rounded-t-[100px] opacity-40"></div>

            <div className="absolute bottom-10 left-10 w-6 h-6 rounded-full bg-violet-500"></div>

            <div className="absolute bottom-20 right-24 w-5 h-5 rounded-full bg-violet-400"></div>

            <div className="absolute bottom-32 left-40 w-4 h-4 rounded-full bg-violet-300"></div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-6 sm:p-10 md:p-14 flex items-center justify-center">
          <div className="w-full max-w-[550px]">
            {/* HEADING */}
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-[#111827]">
                Tell us about yourself
              </h1>

              <p className="text-gray-500 mt-3 text-sm md:text-base">
                Add a few details to get started
              </p>
            </div>

            {/* PROFILE PHOTO */}
            <div className="mt-10 flex flex-col items-center">
              <div className="relative">
                {/* IMAGE */}
                <div className="w-32 h-32 rounded-full bg-[#F5F5F7] border border-gray-200 overflow-hidden flex items-center justify-center">
                  {preview ? (
                    <img
                      src={preview}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={55} className="text-gray-300" />
                  )}
                </div>

                {/* CAMERA BUTTON */}
                <label className="absolute bottom-1 right-1 w-10 h-10 bg-violet-500 hover:bg-violet-600 transition rounded-full flex items-center justify-center cursor-pointer shadow-lg">
                  <Camera size={18} className="text-white" />

                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImage}
                  />
                </label>
              </div>

              <h1 className="mt-4 font-semibold text-gray-800 text-lg">
                Add profile photo
              </h1>

              <p className="text-sm text-gray-400 mt-1">
                JPG, PNG or WEBP. Max size 5MB
              </p>
            </div>

            {/* FORM */}
            <div className="mt-10 flex flex-col gap-6">
              {/* NAME */}
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Your name
                </label>

                <div className="mt-2 flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-4 focus-within:border-violet-500 transition">
                  <User size={20} className="text-gray-400" />

                  <input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full outline-none bg-transparent text-gray-700"
                  />
                </div>
              </div>

              {/* BIO */}
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  What's in your mind?
                </label>

                <div className="mt-2 border border-gray-200 rounded-2xl px-4 py-4 focus-within:border-violet-500 transition">
                  <div className="flex gap-3">
                    <PenLine size={20} className="text-gray-400 mt-1" />

                    <textarea
                      placeholder="Share something about yourself..."
                      rows="5"
                      maxLength={150}
                      className="w-full resize-none outline-none bg-transparent text-gray-700"
                      onChange={(e) => setAbout(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="flex justify-end mt-3">
                    <span className="text-sm text-gray-400">0/150</span>
                  </div>
                </div>
              </div>

              {/* BUTTON */}
              <button onClick={submit} className="mt-2 w-full bg-violet-500 hover:bg-violet-600 transition text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 shadow-lg shadow-violet-200">
                Continue
                <ArrowRight size={22} />
              </button>

              {/* FOOTER */}
              <p className="text-center text-sm text-gray-400">
                You can update this later in settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
