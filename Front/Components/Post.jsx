import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function Post({ name, about, userId }) {
  const [username, setUsername] = useState("");
  const [senderid, setSenderId] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUsername(decoded.username);
      setSenderId(decoded.userId);
    }
  }, []);

  function sendRequest() {
    const data = {
      sender_id: senderid,
      receiver_id: userId,
    };
    const token = localStorage.getItem("token");
    fetch(`${BACKEND_URL}/post/send-request`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 201) {
          console.log("Data stored successfully");
          setRequestSent(true);
        }
      })
      .catch((err) => {
        console.log("there is some issue :- ", err);
      });
  }

 return (
  <div className="mt-4">
    <div className="bg-[#1F2937] border border-[#374151] rounded-2xl p-4 md:p-5 hover:border-violet-500/40 transition-all duration-300">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        {/* LEFT SIDE */}
        <div className="flex items-start gap-4">

          {/* AVATAR */}
          <div className="relative flex-shrink-0">
            <img
              src="https://i.pravatar.cc/101"
              alt="profile"
              className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-violet-500"
            />

            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border border-[#1F2937] rounded-full"></div>
          </div>

          {/* USER INFO */}
          <div className="flex-1">

            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-semibold text-violet-400 text-sm md:text-base">
                {name}
              </h2>

              <span className="text-xs bg-violet-600/20 text-violet-300 px-2 py-1 rounded-full">
                Online
              </span>
            </div>

            <p className="text-gray-200 mt-2 text-sm md:text-base break-words">
              {about}
            </p>

          </div>
        </div>

        {/* BUTTON */}
        {userId !== senderid && (
          <button
            onClick={sendRequest}
            disabled={requestSent}
            className={`
              px-5 py-3 rounded-xl font-medium
              w-full md:w-auto
              transition-all duration-300
              ${
                requestSent
                  ? "bg-green-600 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:scale-105"
              }
            `}
          >
            {requestSent ? "✓ Request Sent" : "Send Request"}
          </button>
        )}

      </div>
    </div>
  </div>
);
}

export default Post;
