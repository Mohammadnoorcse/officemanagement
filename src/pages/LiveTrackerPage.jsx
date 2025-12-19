import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useParams } from "react-router-dom";

const LiveTrackerPage = () => {
  const { id } = useParams();

  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const lastCoords = useRef({ lat: null, lon: null });

  // 🔁 Fetch GPS every 5 seconds
  const fetchLocation = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/geo-location/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setLocation(res.data?.data || null);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch location");
      setLoading(false);
    }
  };

  // 📍 Reverse geocode via Laravel (SAFE)
  const fetchAddress = async (lat, lon) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/reverse-geocode`,
        {
          params: { lat, lon },
        }
      );

      setAddress(res.data?.display_name || "Address not found");
    } catch (err) {
      setAddress("Address unavailable");
    }
  };

  // Poll GPS
  useEffect(() => {
    fetchLocation();
    const interval = setInterval(fetchLocation, 5000);
    return () => clearInterval(interval);
  }, [id]);

  // Reverse geocode ONLY when coords change
  useEffect(() => {
    if (!location?.latitude || !location?.longitude) return;

    if (
      lastCoords.current.lat !== location.latitude ||
      lastCoords.current.lon !== location.longitude
    ) {
      lastCoords.current = {
        lat: location.latitude,
        lon: location.longitude,
      };

      fetchAddress(location.latitude, location.longitude);
    }
  }, [location?.latitude, location?.longitude]);

  if (loading) return <p>Loading location...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Live Location Tracker</h2>

      {location && (
        <>
          <p><b>City:</b> {location.city}</p>
          <p><b>Country:</b> {location.country}</p>
          <p><b>Address:</b> {address}</p>
        </>
      )}

      {location?.latitude && location?.longitude && (
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={15}
          style={{ height: "400px", marginTop: "20px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[location.latitude, location.longitude]}>
            <Popup>{address}</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default LiveTrackerPage;
