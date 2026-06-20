import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  Map,
  Users,
  MessageCircle,
  Settings,
  Menu,
  X,
  Send,
  ArrowLeft,
} from "lucide-react";
import { useEffect } from "react";
import { SocketContext } from "../src/context/SocketContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function ChatInner() {
  const socket = useContext(SocketContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState();
  const [conversationId, setConversationId] = useState();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const decoded = jwtDecode(token);
    setUsername(decoded.username);
    setUserId(decoded.userId);
  }, []);

  //--------- geting the conversation id ------------------
  useEffect(() => {
    if (!userId || !location.state?.sender_id) return;
    const data = {
      otherUser: location.state.sender_id,
      loggedinuser: userId,
    };
    fetch(`${BACKEND_URL}/getconversation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        setConversationId(res._id);
      });
    console.log("here is the connversation Id", conversationId);
  }, [userId]);

  ///---------gettting all the old messages from the backend--------
  useEffect(() => {
    if (!conversationId) return;
    const param = new URLSearchParams({
      conversationId: conversationId,
    });
    fetch(`${BACKEND_URL}/get-messages?${param.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token} `,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((details) => {
        console.log(details);
        setMessages(details);
      })
      .catch((err) => {
        console.log("There was some issue : -", err);
      });
    console.log("All fetched");
  }, [conversationId]);

  useEffect(() => {
  if (!conversationId) return;

  socket.emit("joinRoom", conversationId);

  socket.on("newMessage", (message) => {
    console.log("NEW MESSAGE RECEIVED", message);

    setMessages((prev) => [...prev, message]);
  });

  return () => {
    socket.off("newMessage");
  };
}, [conversationId]);

  //--------user typed the message and clicked on send button
  function sendMessage() {
    socket.emit("sendMessage", {
      conv_id: conversationId,
      text: text,
      id: userId,
    });

    setText("");
  }
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
            src="https://i.pravatar.cc/150?img=12"
            alt=""
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

      {/* CHAT AREA */}
      <main className="flex-1 flex flex-col bg-[#111827] border border-[#1F2937] rounded-3xl overflow-hidden">

        {/* MOBILE HEADER */}
        <div className="lg:hidden p-4 border-b border-[#1F2937]">
          <button
            className="text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>

        {/* CHAT HEADER */}
        <div className="border-b border-[#1F2937] px-4 md:px-6 py-4 flex items-center justify-between bg-[#111827]">

          <div className="flex items-center gap-4">

            <ArrowLeft
              onClick={() => navigate("/chat")}
              size={20}
              className="cursor-pointer text-gray-300 hover:text-white"
            />

            <div className="relative">
              <img
                src="https://i.pravatar.cc/150?img=5"
                alt=""
                className="w-11 h-11 rounded-full border border-violet-500"
              />

              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border border-[#111827] rounded-full"></div>
            </div>

            <div>
              <h2 className="font-semibold text-white text-sm md:text-base">
                {location.state.sender_name}
              </h2>

              <p className="text-xs text-green-400">
                Online
              </p>
            </div>
          </div>

        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 space-y-4 bg-[#0F172A]">

          {messages.map((msg) => {
            const isMe = msg.senderId === userId;

            return (
              <div
                key={msg._id}
                className={`flex ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`
                    px-4 py-3
                    rounded-2xl
                    max-w-[85%] md:max-w-[65%]
                    break-words
                    shadow-md
                    text-sm md:text-base
                    ${
                      isMe
                        ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-br-md"
                        : "bg-[#1F2937] border border-[#374151] text-gray-200 rounded-bl-md"
                    }
                  `}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}

        </div>

        {/* INPUT */}
        <div className="border-t border-[#1F2937] bg-[#111827] p-3 md:p-5">

          <div className="flex gap-3">

            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              type="text"
              placeholder="Type your message..."
              className="
                flex-1
                bg-[#1F2937]
                border border-[#374151]
                rounded-xl
                px-4 py-3
                text-gray-200
                placeholder:text-gray-500
                outline-none
                focus:border-violet-500
              "
            />

            <button
              onClick={sendMessage}
              className="
                bg-gradient-to-r
                from-violet-600
                to-purple-600
                hover:scale-105
                transition-all
                text-white
                px-5
                rounded-xl
                flex items-center justify-center
              "
            >
              <Send size={18} />
            </button>

          </div>

          <p className="text-center text-xs text-gray-500 mt-3">
            Messages disappear when both users go offline.
          </p>

        </div>

      </main>
    </div>
  </div>
);
}

export default ChatInner;
