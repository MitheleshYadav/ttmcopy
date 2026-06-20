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
    <div className="mt-4 flex flex-col gap-3">
      {/* POST CARD */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* LEFT */}
        <div className="flex gap-3">
          <img
            src="https://i.pravatar.cc/101"
            alt="profile"
            className="w-12 h-12 rounded-full"
          />

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-semibold text-violet-600">{name}</h1>
            </div>

            <p className="text-gray-800 mt-1 font-medium text-sm md:text-base">
              {about}
            </p>
          </div>
        </div>

        {/* BUTTON */}
        {userId != senderid && (
          <button
            onClick={sendRequest}
            disabled={requestSent}
            className={`px-5 py-3 rounded-xl font-medium w-full md:w-auto
    ${
      requestSent
        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
        : "border border-violet-200 text-violet-600 hover:bg-violet-50"
    }`}
          >
            {requestSent ? "Request Sent" : "Send Request"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Post;
