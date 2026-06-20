import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Map, Users, MessageCircle, Settings, Menu, X } from "lucide-react";

import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Chat() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [chats, setChats] = useState([]);
  const [userid, setUserid] = useState();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    setUsername(decoded.username);
   
    setUserid(decoded.userId);
    
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/acceptedlist`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("here is the data from the backend", data);
        setChats(data);
      })
      .catch((err) => {
        console.log("There is some issue :-", err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-3 md:p-4">
      <div className="max-w-[1700px] mx-auto flex gap-4 h-[calc(100vh-24px)] relative">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static top-0 left-0 h-screen lg:h-auto
            w-[260px] bg-white rounded-none lg:rounded-[28px]
            border-r lg:border border-gray-200
            p-5 flex flex-col justify-between
            shadow-sm z-50 transition-all duration-300
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
        >
          <div>
            {/* Logo */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-violet-500"></div>

                <h1 className="text-xl font-bold text-gray-800">TalkToMe</h1>
              </div>

              <button
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            {/* Navigation */}
            <div className="space-y-3">
              <button
                onClick={() => navigate("/location")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 transition"
              >
                <Map size={20} />
                Map
              </button>

              <button
                onClick={() => navigate("/requests")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 transition"
              >
                <div className="flex items-center gap-3">
                  <Users size={20} />
                  Requests
                </div>
              </button>

              <button
                onClick={() => navigate("/chat")}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-violet-100 text-violet-600 font-medium"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle size={20} />
                  Chat
                </div>
              </button>

              <button
                onClick={() => navigate("/settings")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 transition"
              >
                <Settings size={20} />
                Settings
              </button>
            </div>
          </div>

          {/* User */}
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/100"
              alt="profile"
              className="w-12 h-12 rounded-full"
            />

            <div>
              <h2 className="font-semibold text-gray-800">{username}</h2>

              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>

                <span className="text-sm text-gray-500">Online</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <div className="bg-white rounded-[24px] border border-gray-200 p-4 shadow-sm lg:hidden mb-4">
            <button onClick={() => setSidebarOpen(true)}>
              <Menu size={26} />
            </button>
          </div>

          {/* Requests Container */}
          <div className="flex-1 bg-white rounded-[28px] border border-gray-200 shadow-sm p-4 md:p-8 overflow-y-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">
              Chat ({chats.length})
            </h1>

            <div className="space-y-6">
              {chats.map((request) => (
                <div
                  key={request.sender_id}
                  className="bg-white border border-gray-100 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition"
                >
                  <div
                    onClick={() => {
                      navigate("/chat-inner", {
                        state: {
                          sender_id: request.sender_id,
                          sender_name: request.sender_name,
                        },
                      });
                    }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
                  >
                    {/* Left */}
                    <div className=" boder-2 border-black-900 flex items-center gap-4">
                      <div className="relative">
                        <img
                          src="https://i.pravatar.cc/130"
                          alt="profile"
                          className="w-16 h-16 rounded-full object-cover"
                        />

                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>

                      <div>
                        <h2 className="font-bold text-lg text-gray-800">
                          {request.sender_name}
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-gray-500 mt-10">
              You can only accept one request.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Chat;
