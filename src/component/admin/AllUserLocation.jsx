import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* 🔧 Leaflet default marker icon fix */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
});

/* 📍 Auto fit map to all valid markers */
const FitBounds = ({ locations }) => {
  const map = useMap();

  useEffect(() => {
    if (!locations || locations.length === 0) return;

    const bounds = L.latLngBounds(
      locations.map((loc) => [
        parseFloat(loc.latitude),
        parseFloat(loc.longitude),
      ])
    );

     map.fitBounds(bounds, { padding: [40, 40], maxZoom: 100 });
  }, [locations, map]);

  return null;
};

const AllUserLocation = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔄 Fetch locations */
  const fetchLocations = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user-locations`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      

      setLocations(res.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setLoading(false);
    }
  };

  /* 🔄 Live update every 5 seconds */
  useEffect(() => {
    fetchLocations();
    const interval = setInterval(fetchLocations, 5000);
    return () => clearInterval(interval);
  }, []);

  /* ✅ Filter only valid coordinates */
  const validLocations = locations.filter(
    (loc) =>
      loc.latitude &&
      loc.longitude &&
      !isNaN(parseFloat(loc.latitude)) &&
      !isNaN(parseFloat(loc.longitude))
  );

  if (loading) return <p>Loading map...</p>;

  return (
    <div >
      <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
        All Users Live Location
      </h2>

      <MapContainer
        center={[23.8103, 90.4125]} // fallback center (Dhaka)
        zoom={0}
        preferCanvas={true}
        style={{ height: "500px", width: "100%", marginTop: "12px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />

        {/* Auto zoom to markers */}
        <FitBounds locations={validLocations} />

        {/* User Markers */}
        {validLocations.map((loc) => (
          <Marker
            key={loc.id}
            position={[
              parseFloat(loc.latitude),
              parseFloat(loc.longitude),
            ]}
          >
            <Popup>
              <strong>{loc.user?.name || "Unknown User"}</strong>
              <br />
              Lat: {loc.latitude}
              <br />
              Lng: {loc.longitude}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default AllUserLocation;
