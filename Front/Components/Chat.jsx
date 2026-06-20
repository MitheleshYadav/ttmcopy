    import { useState, useEffect } from "react";
    import { jwtDecode } from "jwt-decode";
    import { Map, Users, MessageCircle, Settings, Menu, X } from "lucide-react";

    import { useNavigate } from "react-router-dom";

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    function Chat() {
      const navigate = useNavigate();
      const [sidebarOpen, setSidebarOpen] = useState(false);
      const [username, setUsername] = useState(""); //the current logged in user name
      const [chats, setChats] = useState([]);
      const [userid, setUserid] = useState(); //the current logged in user id
      const token = localStorage.getItem("token");

      useEffect(() => {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        setUsername(decoded.username);

        setUserid(decoded.userId);
      }, []);

      useEffect(() => {
        fetch(`${BACKEND_URL}/friendlist`, {
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
              className="flex items-center gap-3 text-gray-300 hover:bg-[#1F2937] px-3 py-3 rounded-xl transition"
            >
              <Users size={18} />
              <span className="text-sm">Requests</span>
            </button>

            <button
              onClick={() => navigate("/chat")}
              className="flex items-center gap-3 bg-violet-600/20 border border-violet-500/30 text-violet-400 px-3 py-3 rounded-xl"
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

      {/* MAIN */}
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
                Chats
              </h1>

              <p className="text-xs md:text-sm text-gray-400 mt-1">
                Connect with your friends instantly.
              </p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-4">
            <p className="text-gray-400 text-xs">
              Friends
            </p>

            <h2 className="text-white text-2xl font-bold">
              {chats.length}
            </h2>
          </div>

          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-4">
            <p className="text-gray-400 text-xs">
              Status
            </p>

            <h2 className="text-green-400 text-2xl font-bold">
              Online
            </h2>
          </div>
        </div>

        {/* CHAT LIST */}
        <div className="flex-1 bg-[#111827] border border-[#1F2937] rounded-3xl overflow-y-auto">

          {chats.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center">
              <h2 className="text-white text-xl font-semibold">
                No Chats Yet
              </h2>

              <p className="text-gray-400 mt-2">
                Accept requests to start chatting.
              </p>
            </div>
          ) : (
            <div className="p-3">

              {chats.map((request) => (
                <div
                  key={request.user_id}
                  onClick={() =>
                    navigate("/chat-inner", {
                      state: {
                        sender_id: request.user_id,
                        sender_name: request.username,
                      },
                    })
                  }
                  className="
                    flex
                    items-center
                    justify-between
                    p-4
                    rounded-2xl
                    hover:bg-[#1F2937]
                    cursor-pointer
                    transition-all
                    duration-300
                    border-b
                    border-[#1F2937]
                  "
                >
                  <div className="flex items-center gap-4">

                    <div className="relative">
                      <img
                        src="https://i.pravatar.cc/130"
                        alt="profile"
                        className="w-12 h-12 rounded-full border border-violet-500"
                      />

                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border border-[#111827] rounded-full"></div>
                    </div>

                    <div>
                      <h2 className="text-white font-medium text-sm md:text-base">
                        {request.username}
                      </h2>

                      <p className="text-gray-400 text-xs md:text-sm">
                        Tap to start chatting
                      </p>
                    </div>
                  </div>

                  <div className="w-3 h-3 rounded-full bg-violet-500"></div>

                </div>
              ))}

            </div>
          )}

        </div>

      </main>
    </div>
  </div>
);
    }

    export default Chat;
