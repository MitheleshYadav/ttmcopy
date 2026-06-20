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
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
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

            {/* Menu */}
            <div className="space-y-3">
              <button
                onClick={() => navigate("/location")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700"
              >
                <Map size={20} />
                Map
              </button>

              <button
                onClick={() => navigate("/requests")}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700"
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
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700"
              >
                <Settings size={20} />
                Settings
              </button>
            </div>
          </div>

          {/* User */}
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt=""
              className="w-12 h-12 rounded-full"
            />

            <div>
              <h2 className="font-semibold">{username}</h2>

              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>

                <span className="text-sm text-gray-500">Online</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col bg-white rounded-[28px] border border-gray-200 shadow-sm overflow-hidden">
          {/* Mobile Header */}
          <div className="lg:hidden p-4 border-b">
            <button onClick={() => setSidebarOpen(true)}>
              <Menu size={26} />
            </button>
          </div>

          {/* Chat Header */}
          <div className="border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ArrowLeft
                onClick={() => navigate("/chat")}
                size={22}
                className="cursor-pointer"
              />

              <div className="relative">
                <img
                  src="https://i.pravatar.cc/150?img=5"
                  alt=""
                  className="w-12 h-12 rounded-full"
                />

                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>

              <div>
                <h2 className="font-bold text-lg">
                  {location.state.sender_name}
                </h2>

                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>

                  <span className="text-sm text-gray-500">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4">
  {messages.map((msg) => {
    const isMe = msg.senderId === userId;

    return (
      <div
        key={msg._id}
        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`
            px-4 py-3
            rounded-2xl
            max-w-[70%]
            shadow-sm
            break-words
            ${
              isMe
                ? "bg-violet-500 text-white rounded-br-md"
                : "bg-gray-100 text-gray-800 rounded-bl-md"
            }
          `}
        >
          <p>{msg.text}</p>
        </div>
      </div>
    );
  })}
</div>

          {/* Input */}
          <div className="border-t border-gray-100 p-4 md:p-6">
            <div className="flex gap-3">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                type="text"
                placeholder="Type a message..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-300"
              />

              <button
                onClick={sendMessage}
                className="bg-violet-500 hover:bg-violet-600 text-white px-5 rounded-xl transition"
              >
                <Send size={18} />
              </button>
            </div>

            <p className="text-center text-sm text-gray-400 mt-4">
              Chats are temporary and will be deleted when you go offline.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ChatInner;
