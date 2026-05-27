import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import {
  Map,
  Bell,
  MessageCircle,
  Settings,
  Send,
  Menu,
  X,
} from "lucide-react";

import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import "leaflet/dist/leaflet.css";

function Location() {
  const location = useLocation();

  const username = location.state.username;

  const [currentLocation, setCurrentLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [post, setPost] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // FETCH LOCATIONS
  const fetchLocations = () => {
    const token = localStorage.getItem("token");

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
    fetchLocations();

    const interval = setInterval(() => {
      fetchLocations();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // GET USER LOCATION
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
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
        >
          <div>
            {/* TOP */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-violet-500"></div>

                <h1 className="text-xl font-bold text-[#111827]">
                  TalkToMe
                </h1>
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
              <button className="flex items-center gap-3 bg-violet-100 text-violet-600 px-4 py-3 rounded-xl font-medium">
                <Map size={20} />
                Map
              </button>

              {/* REQUESTS */}
              <button className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-100 transition">
                <div className="flex items-center gap-3 text-gray-700">
                  <Bell size={20} />
                  Requests
                </div>

                <div className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  3
                </div>
              </button>

              {/* CHAT */}
              <button className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-100 transition">
                <div className="flex items-center gap-3 text-gray-700">
                  <MessageCircle size={20} />
                  Chat
                </div>

                <div className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  2
                </div>
              </button>

              {/* SETTINGS */}
              <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition text-gray-700">
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
                {username}
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
          <div className="bg-white rounded-[24px] border border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between shadow-sm">
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
                  Hi, {username} 👋
                </h1>

                <p className="text-gray-500 mt-1 text-sm md:text-base">
                  Welcome back! You are online.
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="hidden sm:flex bg-[#F7F7F7] px-4 py-2 rounded-xl items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>

                <span className="text-gray-700 font-medium text-sm">
                  128 online
                </span>
              </div>

              <button className="w-10 h-10 md:w-11 md:h-11 rounded-xl border border-gray-200 flex items-center justify-center">
                <Bell size={20} />
              </button>
            </div>
          </div>

          {/* MAP CARD */}
          <div className="bg-white rounded-[24px] border border-gray-200 p-3 md:p-4 shadow-sm flex-1 flex flex-col">
            {/* MAP */}
            <div className="h-[350px] sm:h-[450px] md:h-[550px] rounded-[20px] overflow-hidden">
              <MapContainer
                className="h-full w-full"
                center={[
                  currentLocation.lat,
                  currentLocation.long,
                ]}
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
                      {location.user_id.name}
                    </Popup>
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
                  placeholder="What's happening nearby?"
                  value={post}
                  onChange={(e) => setPost(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-700 text-sm md:text-base"
                />
              </div>

              {/* BUTTON */}
              <button className="bg-violet-500 hover:bg-violet-600 transition text-white px-5 md:px-6 py-3 rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto">
                <Send size={18} />
                Post
              </button>
            </div>

            {/* POSTS */}
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
                      <h1 className="font-semibold text-violet-600">
                        Rahul
                      </h1>
                    </div>

                    <p className="text-gray-800 mt-1 font-medium text-sm md:text-base">
                      Hey, anyone up for coffee? ☕
                    </p>

                    <p className="text-xs md:text-sm text-gray-400 mt-1">
                      Connaught Place, New Delhi 
                    </p>
                  </div>
                </div>

                {/* BUTTON */}
                <button className="border border-violet-200 text-violet-600 hover:bg-violet-50 transition px-5 py-3 rounded-xl font-medium w-full md:w-auto">
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Location;