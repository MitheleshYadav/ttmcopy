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

import "leaflet/dist/leaflet.css";
import socket from "../src/socket";
import Post from "./Post";

function Location() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [post, setPost] = useState("");
  const [postList, setPostList] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getUsernameFromToken = () => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    return decoded.username;
  };

  function sendPost() {
    const data = {
      post: post,
    };
    fetch("http://192.168.1.23:3000/location/posts", {
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
  }
  // FETCH LOCATIONS of all the users
  const fetchLocations = () => {
    fetch("http://192.168.1.23:3000/location", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())

      .then((data) => {
        setLocations(data.locations);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  
  useEffect(() => {
  console.log("Current postList:", postList);
}, [postList]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to backend");
      console.log("Socket ID:", socket.id);
    });
    return () => {
      socket.off("connect");
    };
  }, []);
  useEffect(()=>{
    fetch("http://192.168.1.23:3000/location/allexistingpost", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
      console.log("here is the response data: ", data)
      setPostList(data.allPost)
      console.log("here is the list of all post: ", postList);
    }).catch((err)=>{
      console.log(err);
    })
  },[])
  useEffect(() => {
    socket.on("newpost", (data) => {
      setPostList((prev) => [...prev, data]);
    });
    socket.on("updatedpost", (updated_data) => {
      console.log("updated EVENT RECEIVED", updated_data);
      setPostList((prev) =>
        prev.map((post) =>
          post.userId === updated_data.id? updated_data : post,
        ),
      );
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
    <div className="min-h-screen bg-[#F7F7F7] p-3 md:p-4">
      <div className="max-w-[1700px] mx-auto flex gap-4 h-[calc(100vh-24px)] relative">
        {/* MOBILE OVERLAY */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* SIDEBAR */}
        <div
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
            {/* TOP */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-violet-500"></div>

                <h1 className="text-xl font-bold text-[#111827]">TalkToMe</h1>
              </div>

              {/* CLOSE BTN */}
              <button
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            {/* MENU */}
            <div className="flex flex-col gap-3">
              {/* MAP */}
              <button
                onClick={() => navigate("/location")}
                className="flex items-center gap-3 bg-violet-100 text-violet-600 px-4 py-3 rounded-xl font-medium"
              >
                <Map size={20} />
                Map
              </button>

              {/* REQUESTS */}
              <button
                onClick={() => navigate("/requests")}
                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-3 text-gray-700">
                  <Bell size={20} />
                  Requests
                </div>
              </button>

              {/* CHAT */}
              <button
                onClick={() => navigate("/chat")}
                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-3 text-gray-700">
                  <MessageCircle size={20} />
                  Chat
                </div>
              </button>

              {/* SETTINGS */}
              <button
                onClick={() => navigate("/settings")}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition text-gray-700"
              >
                <Settings size={20} />
                Settings
              </button>
            </div>
          </div>

          {/* USER */}
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/100"
              alt="profile"
              className="w-12 h-12 rounded-full"
            />

            <div>
              <h1 className="font-semibold text-gray-800">
                {getUsernameFromToken()}
              </h1>

              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>

                <p className="text-sm text-gray-500">Online</p>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="flex-1 flex flex-col gap-4 w-full lg:ml-0">
          {/* TOP BAR */}
          <div className="bg-white rounded-[24px] border border-gray-200 px-4 md:px-6 py-4 flex items-center shadow-sm">
            <div className="flex items-center gap-3">
              {/* MOBILE MENU */}
              <button
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={26} />
              </button>

              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                  Hi, {getUsernameFromToken()} 👋
                </h1>

                <p className="text-gray-500 mt-1 text-sm md:text-base">
                  Welcome back! You are online.
                </p>
              </div>
            </div>
          </div>

          {/* MAP CARD */}
          <div className="bg-white rounded-[24px] border border-gray-200 p-3 md:p-4 shadow-sm flex-1 flex flex-col">
            {/* MAP */}
            <div className="h-[350px] sm:h-[450px] md:h-[550px] rounded-[20px] overflow-hidden">
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
                    position={[location.latitude, location.longitude]}
                  >
                    <Popup>{location.user_id.name || "User"}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* CREATE POST */}
            <div className="mt-4 bg-[#F9F9F9] border border-gray-200 rounded-2xl p-3 md:p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
              {/* LEFT */}
              <div className="flex items-center gap-3 flex-1">
                <img
                  src="https://i.pravatar.cc/100"
                  alt="profile"
                  className="w-11 h-11 rounded-full"
                />

                <input
                  type="text"
                  placeholder="What's on your mind?"
                  value={post}
                  onChange={(e) => setPost(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-700 text-sm md:text-base"
                />
              </div>

              {/* BUTTON */}
              <button
                onClick={sendPost}
                className="bg-violet-500 hover:bg-violet-600 transition text-white px-5 md:px-6 py-3 rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Send size={18} />
                Post
              </button>
            </div>

            {postList.map((postItem, index) => (
              <Post
                key={index}
                name={postItem.profile_name}
                about={postItem.post}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Location;
