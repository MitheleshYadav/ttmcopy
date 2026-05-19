import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { User, ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import "leaflet/dist/leaflet.css";

function Location() {
    const location = useLocation();
    const username = location.state?.username || "User";
    const marker = [
    {
      geocode: [28.5286, 77.2883],
      popup: "This is the location of Sarita Vihar",
    },
    {
      geocode: [28.5035, 77.3005],
      popup: "This is the location of Badarpur",
    },
    {
      geocode: [28.4934, 77.3033],
      popup: "This is the location of Badarpur metro station",
    },
  ];

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#312E81] p-6 overflow-hidden">
      
      {/* Outer Glass Container */}
      <div className="h-full w-full rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_60px_rgba(0,0,0,0.6)] p-6 flex flex-col gap-6">

        {/* Navbar */}
        <div className="w-full min-h-[95px] rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex items-center justify-between px-8">
          
          {/* Left Side */}
          <div>
            <h1 className="text-4xl font-bold text-white">
              Hi, {username} 👋
            </h1>

            <div className="flex items-center gap-2 mt-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>

              <p className="text-gray-300 text-lg">
                Welcome back! You are online.
              </p>
            </div>
          </div>

          {/* Profile Button */}
          <button className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition duration-300">
            
            <User size={22} />

            <span className="text-lg font-medium">
              Profile
            </span>

            <ChevronDown size={20} />
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 rounded-[35px] overflow-hidden border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          
          <MapContainer
            className="h-full w-full"
            center={[28.503962, 77.301826]}
            zoom={13}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {marker.map((marker, index) => (
              <Marker key={index} position={marker.geocode}>
                <Popup>{marker.popup}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default Location;