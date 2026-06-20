import { use, useState } from "react";
import { Camera, User, PenLine, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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

    fetch(`${BACKEND_URL}/details`,{
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
  <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">

    <div className="w-full max-w-7xl bg-[#111827] border border-[#1F2937] rounded-3xl overflow-hidden shadow-2xl">

      <div className="grid lg:grid-cols-2 min-h-[850px]">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-violet-900/30 via-[#111827] to-[#0F172A] p-12 flex-col justify-between">

          {/* LOGO */}
          <div>
            <div className="flex items-center gap-3">

              <div className="w-4 h-4 rounded-full bg-violet-500"></div>

              <h1 className="text-white text-2xl font-bold">
                TalkToMe
              </h1>

            </div>

            <div className="mt-24">

              <h1 className="text-5xl font-bold text-white leading-tight">
                Create Your
                <br />
                Social Identity
              </h1>

              <p className="mt-6 text-lg text-gray-400 max-w-md leading-relaxed">
                Complete your profile and start connecting
                with people around you in real time.
              </p>

            </div>
          </div>

          {/* DECORATION */}
          <div className="relative h-[250px]">

            <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-600/20 blur-3xl rounded-full"></div>

            <div className="absolute top-10 right-20 w-32 h-32 bg-purple-500/20 blur-2xl rounded-full"></div>

            <div className="absolute bottom-20 right-10 w-24 h-24 bg-violet-400/20 blur-xl rounded-full"></div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-6 sm:p-10 md:p-14">

          <div className="w-full max-w-xl">

            {/* HEADER */}
            <div className="text-center">

              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Complete Your Profile
              </h1>

              <p className="mt-3 text-gray-400 text-sm md:text-base">
                Let others know who you are
              </p>

            </div>

            {/* PROFILE IMAGE */}
            <div className="mt-10 flex flex-col items-center">

              <div className="relative">

                <div className="
                  w-32 h-32
                  rounded-full
                  bg-[#1F2937]
                  border-2 border-[#374151]
                  overflow-hidden
                  flex items-center justify-center
                ">
                  {preview ? (
                    <img
                      src={preview}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User
                      size={55}
                      className="text-gray-500"
                    />
                  )}
                </div>

                <label
                  className="
                    absolute bottom-1 right-1
                    w-10 h-10
                    rounded-full
                    bg-gradient-to-r
                    from-violet-600
                    to-purple-600
                    flex items-center justify-center
                    cursor-pointer
                    shadow-lg
                  "
                >
                  <Camera
                    size={18}
                    className="text-white"
                  />

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImage}
                  />
                </label>

              </div>

              <h2 className="mt-4 text-white font-medium">
                Upload Profile Photo
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                JPG, PNG, WEBP
              </p>

            </div>

            {/* FORM */}
            <div className="mt-10 space-y-6">

              {/* NAME */}
              <div>

                <label className="text-sm font-medium text-gray-300">
                  Your Name
                </label>

                <div className="
                  mt-2
                  bg-[#1F2937]
                  border border-[#374151]
                  rounded-2xl
                  px-4 py-4
                  flex items-center gap-3
                  focus-within:border-violet-500
                ">

                  <User
                    size={20}
                    className="text-gray-500"
                  />

                  <input
                    type="text"
                    placeholder="Enter your name"
                    onChange={(e) => setName(e.target.value)}
                    className="
                      w-full
                      bg-transparent
                      outline-none
                      text-white
                      placeholder:text-gray-500
                    "
                  />

                </div>

              </div>

              {/* ABOUT */}
              <div>

                <label className="text-sm font-medium text-gray-300">
                  About You
                </label>

                <div className="
                  mt-2
                  bg-[#1F2937]
                  border border-[#374151]
                  rounded-2xl
                  p-4
                  focus-within:border-violet-500
                ">

                  <div className="flex gap-3">

                    <PenLine
                      size={20}
                      className="text-gray-500 mt-1"
                    />

                    <textarea
                      rows="5"
                      maxLength={150}
                      placeholder="Tell people something interesting about yourself..."
                      onChange={(e) => setAbout(e.target.value)}
                      className="
                        w-full
                        bg-transparent
                        outline-none
                        resize-none
                        text-white
                        placeholder:text-gray-500
                      "
                    />

                  </div>

                  <div className="flex justify-end mt-3">

                    <span className="text-xs text-gray-500">
                      {about.length}/150
                    </span>

                  </div>

                </div>

              </div>

              {/* BUTTON */}
              <button
                onClick={submit}
                className="
                  w-full
                  py-4
                  rounded-2xl
                  bg-gradient-to-r
                  from-violet-600
                  to-purple-600
                  text-white
                  font-semibold
                  hover:scale-[1.02]
                  transition-all
                  flex items-center
                  justify-center
                  gap-3
                "
              >
                Continue

                <ArrowRight size={20} />
              </button>

              <p className="text-center text-sm text-gray-500">
                You can change this later from settings.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>
);
}

export default Details;
