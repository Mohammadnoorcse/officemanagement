import React, { useEffect, useState, useMemo } from "react";
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

/* 🔧 Leaflet marker icon fix */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
});

/* 📍 Auto fit map bounds */
const FitBounds = ({ locations }) => {
  const map = useMap();

  useEffect(() => {
    if (!locations || locations.length === 0) return;

    if (locations.length === 1) {
      map.setView(
        [
          parseFloat(locations[0].latitude),
          parseFloat(locations[0].longitude),
        ],
        15
      );
      return;
    }

    const bounds = L.latLngBounds(
      locations.map((loc) => [
        parseFloat(loc.latitude),
        parseFloat(loc.longitude),
      ])
    );

    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 16,
    });
  }, [locations, map]);

  return null;
};

const AllUserLocation = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔄 Fetch user locations */
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

  /* 🔁 Poll every 5s */
  useEffect(() => {
    fetchLocations();
    const interval = setInterval(fetchLocations, 5000);
    return () => clearInterval(interval);
  }, []);

  /* ✅ Filter valid coordinates (memoized) */
  const validLocations = useMemo(() => {
    return locations.filter(
      (loc) =>
        loc.latitude &&
        loc.longitude &&
        !isNaN(parseFloat(loc.latitude)) &&
        !isNaN(parseFloat(loc.longitude))
    );
  }, [locations]);

  if (loading) return <p>Loading map...</p>;

  return (
    <div>
      <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
        All Users Live Location
      </h2>

      <MapContainer
        center={[23.8103, 90.4125]} // Dhaka fallback
        zoom={7}
        preferCanvas
        style={{ height: "500px", width: "100%", marginTop: "12px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />

        <FitBounds locations={validLocations} />

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
              {/* Optional if backend provides address */}
              {loc.address && (
                <>
                  <br />
                  <small>{loc.address}</small>
                </>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default AllUserLocation;
