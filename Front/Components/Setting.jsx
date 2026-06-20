import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {
  Map,
  Users,
  MessageCircle,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Lock,
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Setting() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newUsername, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userId, setUserId] = useState();
  const [name, setName] = useState("");

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token || token === "undefined") {
    return;
  }

  try {
    const decoded = jwtDecode(token);

    setUserId(decoded.userId);
    setName(decoded.username);
  } catch (err) {
    console.log("JWT ERROR:", err);

    localStorage.removeItem("token");
    navigate("/");
  }
}, []);

  const handleUsernameUpdate = () => {
    fetch(`${BACKEND_URL}/update-username`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        userId: userId,
        username: newUsername,
      }),
    })
      .then((response) => {
        console.log("Response from backend:", response);
        return response.json();
      })
      .then((data) => {
        console.log("Username updated:", data);

        if (!data.token) {
          console.log("TOKEN MISSING");
          return;
        }
        localStorage.setItem("token", data.token);
        window.location.reload(); // Reload the page to reflect the updated username
      })
      .catch((error) => {
        console.error("Error updating username:", error);
      });
  };

  const handlePasswordUpdate = () => {
    console.log(currentPassword, newPassword);
  };

  const handleLogout = async () => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/logout`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "token"
          )}`,
        },
      }
    );

    const data = await response.json();

    console.log(data);

    localStorage.removeItem("token");

    navigate("/");
  } catch (err) {
    console.log(err);
  }
};

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
              className="flex items-center gap-3 text-gray-300 hover:bg-[#1F2937] px-3 py-3 rounded-xl transition"
            >
              <MessageCircle size={18} />
              <span className="text-sm">Chat</span>
            </button>

            <button
              onClick={() => navigate("/settings")}
              className="flex items-center gap-3 bg-violet-600/20 border border-violet-500/30 text-violet-400 px-3 py-3 rounded-xl"
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
            alt=""
            className="w-10 h-10 rounded-full border-2 border-violet-500"
          />

          <div>
            <h2 className="text-white text-sm font-semibold">
              {name}
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
                Settings
              </h1>

              <p className="text-xs md:text-sm text-gray-400 mt-1">
                Manage your profile and account settings.
              </p>
            </div>

          </div>

        </div>

        {/* CONTENT */}
        <div className="flex-1 grid lg:grid-cols-3 gap-4">

          {/* PROFILE CARD */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-3xl p-6">

            <div className="flex flex-col items-center">

              <div className="relative">
                <img
                  src="https://i.pravatar.cc/150"
                  alt=""
                  className="w-28 h-28 rounded-full border-4 border-violet-500"
                />

                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-[#111827] rounded-full"></div>
              </div>

              <h2 className="text-white text-xl font-bold mt-4">
                {name}
              </h2>

              <p className="text-green-400 text-sm mt-1">
                Online
              </p>

            </div>

          </div>

          {/* FORMS */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* USERNAME */}
            <div className="bg-[#111827] border border-[#1F2937] rounded-3xl p-6">

              <div className="flex items-center gap-2 mb-4">
                <User size={18} className="text-violet-400" />

                <h3 className="text-white font-semibold">
                  Change Username
                </h3>
              </div>

              <input
                type="text"
                value={newUsername}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter new username"
                className="
                  w-full
                  bg-[#1F2937]
                  border border-[#374151]
                  rounded-xl
                  p-3
                  text-white
                  placeholder:text-gray-500
                  outline-none
                  focus:border-violet-500
                "
              />

              <button
                onClick={handleUsernameUpdate}
                className="
                  mt-4
                  px-5
                  py-3
                  rounded-xl
                  bg-gradient-to-r
                  from-violet-600
                  to-purple-600
                  text-white
                  hover:scale-105
                  transition-all
                "
              >
                Update Username
              </button>

            </div>

            {/* PASSWORD */}
            <div className="bg-[#111827] border border-[#1F2937] rounded-3xl p-6">

              <div className="flex items-center gap-2 mb-4">
                <Lock size={18} className="text-violet-400" />

                <h3 className="text-white font-semibold">
                  Change Password
                </h3>
              </div>

              <div className="space-y-3">

                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(e.target.value)
                  }
                  className="
                    w-full
                    bg-[#1F2937]
                    border border-[#374151]
                    rounded-xl
                    p-3
                    text-white
                    placeholder:text-gray-500
                    outline-none
                    focus:border-violet-500
                  "
                />

                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  className="
                    w-full
                    bg-[#1F2937]
                    border border-[#374151]
                    rounded-xl
                    p-3
                    text-white
                    placeholder:text-gray-500
                    outline-none
                    focus:border-violet-500
                  "
                />

              </div>

              <button
                onClick={handlePasswordUpdate}
                className="
                  mt-4
                  px-5
                  py-3
                  rounded-xl
                  bg-gradient-to-r
                  from-violet-600
                  to-purple-600
                  text-white
                  hover:scale-105
                  transition-all
                "
              >
                Update Password
              </button>

            </div>

            {/* LOGOUT */}
            <div className="bg-[#111827] border border-red-500/20 rounded-3xl p-6">

              <button
                onClick={handleLogout}
                className="
                  flex
                  items-center
                  gap-3
                  text-red-400
                  hover:text-red-300
                  transition
                  font-medium
                "
              >
                <LogOut size={18} />
                Logout
              </button>

            </div>

          </div>

        </div>

        <p className="text-center text-gray-500 text-sm">
          Account settings and preferences.
        </p>

      </main>

    </div>
  </div>
);
}

export default Setting;
