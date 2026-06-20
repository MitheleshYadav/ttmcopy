import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Map, Users, MessageCircle, Settings, Menu, X } from "lucide-react";

import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Request() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [username, setUsername] = useState(""); //the current logged in user name
  const [pendingRequests, setPendingRequests] = useState([]);
  const [userid, setUserid] = useState(); //the current logged in user id
  const token = localStorage.getItem("token");

  function requestAccept(user_id, username) {
    const data = {
      senderID: user_id,
      senderName: username,
      receiverId: userid,
    };
    fetch(`${BACKEND_URL}/request/accept`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 201) {
          setPendingRequests((prev) =>
            prev.filter(
              (request) => String(request.user_id) !== String(user_id),
            ),
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const fetchPendingRequests = () => {
    fetch(`${BACKEND_URL}/pending-requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setPendingRequests(data));
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    setUsername(decoded.username);

    setUserid(decoded.userId);
  }, []);

 return (
  <div className="min-h-screen bg-[#0F172A] p-2 md:p-4">
    <div className="max-w-[1700px] mx-auto flex gap-4 h-[calc(100vh-16px)] relative">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:static top-0 left-0 h-screen lg:h-auto
          w-[250px]
          bg-[#111827]
          border-r lg:border border-[#1F2937]
          rounded-none lg:rounded-3xl
          p-5 flex flex-col justify-between
          z-50 transition-all duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div>
          {/* LOGO */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-violet-500"></div>

              <h1 className="text-xl font-bold text-white">
                TalkToMe
              </h1>
            </div>

            <button
              className="lg:hidden text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={22} />
            </button>
          </div>

          {/* MENU */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate("/location")}
              className="flex items-center gap-3 text-gray-300 hover:bg-[#1F2937] px-3 py-3 rounded-xl transition"
            >
              <Map size={18} />
              <span className="text-sm">Map</span>
            </button>

            <button
              onClick={() => navigate("/requests")}
              className="flex items-center gap-3 bg-violet-600/20 border border-violet-500/30 text-violet-400 px-3 py-3 rounded-xl"
            >
              <Users size={18} />
              <span className="text-sm">
                Requests ({pendingRequests.length})
              </span>
            </button>

            <button
              onClick={() => navigate("/chat")}
              className="flex items-center gap-3 text-gray-300 hover:bg-[#1F2937] px-3 py-3 rounded-xl transition"
            >
              <MessageCircle size={18} />
              <span className="text-sm">Chat</span>
            </button>

            <button
              onClick={() => navigate("/settings")}
              className="flex items-center gap-3 text-gray-300 hover:bg-[#1F2937] px-3 py-3 rounded-xl transition"
            >
              <Settings size={18} />
              <span className="text-sm">Settings</span>
            </button>
          </div>
        </div>

        {/* USER */}
        <div className="flex items-center gap-3 border-t border-[#1F2937] pt-4">
          <img
            src="https://i.pravatar.cc/100"
            alt="profile"
            className="w-10 h-10 rounded-full border-2 border-violet-500"
          />

          <div>
            <h2 className="text-white text-sm font-semibold">
              {username}
            </h2>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>

              <p className="text-xs text-gray-400">
                Online
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col gap-4">

        {/* HEADER */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-3xl px-4 md:px-6 py-5">
          <div className="flex items-center gap-3">

            <button
              className="lg:hidden text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>

            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                Pending Requests
              </h1>

              <p className="text-xs md:text-sm text-gray-400 mt-1">
                Manage incoming friend requests.
              </p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-4">
            <p className="text-gray-400 text-xs">
              Total Requests
            </p>

            <h2 className="text-white text-2xl font-bold">
              {pendingRequests.length}
            </h2>
          </div>

          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-4">
            <p className="text-gray-400 text-xs">
              Status
            </p>

            <h2 className="text-green-400 text-2xl font-bold">
              Active
            </h2>
          </div>
        </div>

        {/* REQUESTS CARD */}
        <div className="flex-1 bg-[#111827] border border-[#1F2937] rounded-3xl p-4 md:p-6 overflow-y-auto">

          <div className="space-y-4">

            {pendingRequests.length === 0 && (
              <div className="text-center py-20">
                <h2 className="text-xl text-white font-semibold">
                  No Pending Requests
                </h2>

                <p className="text-gray-400 mt-2">
                  New friend requests will appear here.
                </p>
              </div>
            )}

            {pendingRequests.map((request) => (
              <div
                key={request.user_id}
                className="bg-[#1F2937] border border-[#374151] rounded-2xl p-4 md:p-5 hover:border-violet-500/40 transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src="https://i.pravatar.cc/130"
                        alt="profile"
                        className="w-14 h-14 rounded-full object-cover border-2 border-violet-500"
                      />

                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border border-[#1F2937] rounded-full"></div>
                    </div>

                    <div>
                      <h2 className="text-white font-semibold text-base">
                        {request.profile_name}
                      </h2>

                      <p className="text-gray-400 text-sm mt-1">
                        Wants to connect with you
                      </p>
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div className="flex gap-3 w-full md:w-auto">

                    <button
                      className="flex-1 md:flex-none px-5 py-2.5 border border-gray-600 text-gray-300 rounded-xl hover:bg-[#374151] transition"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() =>
                        requestAccept(
                          request.user_id,
                          request.profile_name
                        )
                      }
                      className="flex-1 md:flex-none px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:scale-105 transition-all"
                    >
                      Accept
                    </button>

                  </div>
                </div>
              </div>
            ))}

          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            You can only accept one request at a time.
          </p>

        </div>
      </main>
    </div>
  </div>
);
}

export default Request;
