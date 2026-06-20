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
          p-5 flex flex-col justify-between shadow-sm
          z-50 transition-all duration-300
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
                <h1 className="text-xl font-bold">TalkToMe</h1>
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
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100"
              >
                <Map size={20} />
                Map
              </button>

              <button
                onClick={() => navigate("/requests")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100"
              >
                <Users size={20} />
                Requests
              </button>

              <button
                onClick={() => navigate("/chat")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100"
              >
                <MessageCircle size={20} />
                Chat
              </button>

              <button
                onClick={() => navigate("/settings")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-100 text-violet-600 font-medium"
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
              alt=""
              className="w-12 h-12 rounded-full"
            />

            <div>
              <h2 className="font-semibold">{name}</h2>

              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-500">Online</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 bg-white rounded-[28px] border border-gray-200 shadow-sm overflow-y-auto">
          {/* Mobile Header */}
          <div className="lg:hidden p-4 border-b">
            <button onClick={() => setSidebarOpen(true)}>
              <Menu size={26} />
            </button>
          </div>

          <div className="p-6 md:p-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Profile Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img
                      src="https://i.pravatar.cc/150"
                      alt=""
                      className="w-28 h-28 rounded-full"
                    />

                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>

                  <h2 className="text-2xl font-bold mt-4">{name}</h2>

                  <p className="text-green-500 mt-1">Online</p>
                </div>
              </div>

              {/* Settings Form */}
              <div className="space-y-6">
                {/* Username */}
                <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <User size={20} />
                    <h3 className="font-semibold">Change Username</h3>
                  </div>

                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-violet-400"
                  />

                  <button
                    onClick={handleUsernameUpdate}
                    className="mt-4 bg-violet-500 hover:bg-violet-600 text-white px-5 py-3 rounded-xl"
                  >
                    Update Username
                  </button>
                </div>

                {/* Password */}
                <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Lock size={20} />
                    <h3 className="font-semibold">Change Password</h3>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder="Current Password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-violet-400"
                    />

                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-violet-400"
                    />
                  </div>

                  <button
                    onClick={handlePasswordUpdate}
                    className="mt-4 bg-violet-500 hover:bg-violet-600 text-white px-5 py-3 rounded-xl"
                  >
                    Update Password
                  </button>
                </div>

                {/* Logout */}
                <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 font-semibold hover:text-red-600"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </div>
              </div>
            </div>

            <p className="text-center text-gray-400 mt-10">
              All data is temporary and will be removed when you go offline.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Setting;
