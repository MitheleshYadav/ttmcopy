import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { User, ChevronDown, Settings, LogOut } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

function Location() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state.username;
  const [currentLocation, setCurrentLocation] = useState(null);

  const [locations, setLocations] = useState([]);

  // GET LIVE LOCATION WHEN PAGE LOADS

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
    return <div>Loading...</div>;
  }

  function logout() {
    fetch("http://192.168.1.23:3000/location/logout", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          window.alert("Logout failed");
        }
      })
      .catch((err) => {
        window.alert("Logout failed");
        console.error(err);
      });
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#312E81] p-3 sm:p-4 md:p-6">
      {/* Outer Glass Container */}
      <div className="h-[calc(100vh-24px)] sm:h-[calc(100vh-32px)] md:h-[calc(100vh-48px)] w-full rounded-2xl md:rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_60px_rgba(0,0,0,0.6)] p-3 sm:p-4 md:p-6 flex flex-col gap-4 md:gap-6">
        {/* Navbar */}
        <div className="relative z-50 w-full rounded-2xl md:rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 md:px-8 md:py-6">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Hi, {username} 👋
            </h1>

            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>

              <p className="text-gray-300 text-sm sm:text-base md:text-lg">
                Welcome back! You are online.
              </p>
            </div>
          </div>

          {/* Profile Button */}
          <div className="relative group">
            {/* Button */}
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-5 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition duration-300">
              <span className="text-sm sm:text-base md:text-lg font-medium">
                Menu
              </span>

              <ChevronDown size={18} />
            </button>

            {/* Dropdown */}
            <ul className="absolute z-50 top-full right-0 mt-2 w-48 bg-[#1E293B] border border-white/10 rounded-lg shadow-lg p-3 text-gray-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <li className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-md cursor-pointer">
                <User size={20} />
                Profile
              </li>

              <li className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-md cursor-pointer">
                <Settings size={20} />
                Setting
              </li>

              <li
                className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-md cursor-pointer"
                onClick={logout}
              >
                <LogOut size={20} />
                Logout
              </li>
            </ul>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 rounded-2xl md:rounded-[35px] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] min-h-[300px] overflow-hidden relative z-0">
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
                <Popup className=" color:red">
                  You are here 📍 {location.user_id.name}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default Location;
