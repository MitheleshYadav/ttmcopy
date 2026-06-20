import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { jwtDecode } from "jwt-decode";
import {
  Map,
  Bell,
  MessageCircle,
  Settings,
  Send,
  Menu,
  X,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { useContext } from "react";
import { SocketContext } from "../src/context/SocketContext";

import "leaflet/dist/leaflet.css";
import Post from "./Post";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Location() {
  const socket = useContext(SocketContext);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [post, setPost] = useState("");
  const [postList, setPostList] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);
      setUsername(decoded.username);
      setUserId(decoded.userId);
    }
  }, []);

  function sendPost() {
    const data = {
      post: post,
    };
    fetch(`${BACKEND_URL}/location/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status == 201) {
          console.log("data stored");
        }
      })
      .catch((err) => {
        console.log("error : ", err);
      });
    setPost("");
  }
  // FETCH LOCATIONS of all the users
  const fetchLocations = () => {
    fetch(`${BACKEND_URL}/location`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())

      .then((data) => {
        console.log("locations data from backend", data);
        setLocations(data.locations);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  

  useEffect(() => {
    fetch(`${BACKEND_URL}/location/allexistingpost`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setPostList(data.allPost);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("newpost", (data) => {
      setPostList((prev) => [...prev, data]);
    });
    socket.on("updatedpost", (updated_data) => {
      setPostList((prev) => {
        const updated = prev.map((post) =>
          post.user_id === updated_data.user_id ? updated_data : post,
        );
        return updated;
      });
    });
  }, []);

  // pooling effect so that the map section will keep on refreshing to update any online users
  useEffect(() => {
    fetchLocations();
    const interval = setInterval(() => {
      fetchLocations();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // GET USER LOCATION who just logged in so that when we logs in the map will zoom on his location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      },
      (error) => {
        console.log(error.message);
      },
    );
  }, []);

  if (!currentLocation) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F7F7F7]">
        Loading...
      </div>
    );
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
      <div
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
              className="flex items-center gap-3 bg-violet-600/20 border border-violet-500/30 text-violet-400 px-3 py-3 rounded-xl"
            >
              <Map size={18} />
              <span className="text-sm">Map</span>
            </button>

            <button
              onClick={() => navigate("/requests")}
              className="flex items-center gap-3 text-gray-300 hover:bg-[#1F2937] px-3 py-3 rounded-xl transition"
            >
              <Bell size={18} />
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
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col gap-4">

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
                Hi, {username} 👋
              </h1>

              <p className="text-xs md:text-sm text-gray-400 mt-1">
                Welcome back. You're currently online.
              </p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-4">
            <p className="text-gray-400 text-xs">
              Online Users
            </p>

            <h2 className="text-white text-2xl font-bold">
              {locations.length}
            </h2>
          </div>

          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-4">
            <p className="text-gray-400 text-xs">
              Posts
            </p>

            <h2 className="text-white text-2xl font-bold">
              {postList.length}
            </h2>
          </div>

          <div className="hidden md:block bg-[#111827] border border-[#1F2937] rounded-2xl p-4">
            <p className="text-gray-400 text-xs">
              Status
            </p>

            <h2 className="text-green-400 text-2xl font-bold">
              Online
            </h2>
          </div>
        </div>

        {/* MAP CARD */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-3xl p-3 md:p-4">

          <div className="h-[260px] sm:h-[350px] md:h-[500px] rounded-2xl overflow-hidden">
            <MapContainer
              className="h-full w-full"
              center={[currentLocation.lat, currentLocation.long]}
              zoom={15}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />

              {locations.map((location, index) => (
                <Marker
                  key={index}
                  position={[
                    location.latitude,
                    location.longitude,
                  ]}
                >
                  <Popup>
                    {location.user_id.name || "User"}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* CREATE POST */}
          <div className="mt-4 bg-[#1F2937] border border-[#374151] rounded-2xl p-3 flex flex-col sm:flex-row gap-3 sm:items-center">

            <div className="flex items-center gap-3 flex-1">
              <img
                src="https://i.pravatar.cc/100"
                alt="profile"
                className="w-10 h-10 rounded-full"
              />

              <input
                type="text"
                placeholder="What's on your mind?"
                value={post}
                onChange={(e) => setPost(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-200 placeholder:text-gray-500 text-sm"
              />
            </div>

            <button
              onClick={sendPost}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:scale-105 transition-all text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Send size={18} />
              Post
            </button>
          </div>

          {/* POSTS */}
          <div className="mt-4 flex flex-col gap-4">
            {postList.map((postItem, index) => (
              <Post
                key={index}
                name={postItem.profile_name}
                about={postItem.post}
                userId={postItem.user_id}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  </div>
);
}

export default Location;
