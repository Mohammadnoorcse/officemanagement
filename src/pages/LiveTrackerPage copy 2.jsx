import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useParams } from "react-router-dom";

const OPENCAGE_API_KEY = "a83f041117f24e74b2e235ba14f797f7";

const LiveTrackerPage = () => {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch latest location for the user
  const fetchLocation = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/geo-location/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log('res',res.data.data);

      setLocation(res.data.data || null);
      setLoading(false);
      setError("");

      if (res.data.data?.latitude && res.data.data?.longitude) {
        fetchAddress(res.data.data.latitude, res.data.data.longitude);
      }
    } catch (err) {
      console.error("Error fetching location", err);
      setError("Failed to fetch location");
      setLoading(false);
    }
  };

  // Fetch human-readable address from OpenCage API
  // const fetchAddress = async (lat, lon) => {
  //   if (!lat || !lon) return;

  //   try {
  //     const res = await axios.get(
  //       `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPENCAGE_API_KEY}`
  //     );

  //     if (res.data.results && res.data.results.length > 0) {
  //       setAddress(res.data.results[0].formatted);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching address", err);
  //     setAddress("");
  //   }
  // };

    const fetchAddress = async (lat, lon) => {
    if (!lat || !lon) return;

    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );

      

      if (res.data && res.data.address) {
        // res.data.display_name gives full address
        setAddress(res.data.display_name);
      } else {
        setAddress("Address not found");
      }
    } catch (err) {
      console.error("Error fetching address", err);
      setAddress("");
    }
  };


  // Fetch location on mount and every 5 seconds
  useEffect(() => {
    fetchLocation();
    const interval = setInterval(fetchLocation, 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <p>Loading location...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Employer Live Location Tracker</h2>

      {location ? (
        <div>
          {location.ip && <p><strong>IP:</strong> {location.ip}</p>}
          {location.city && <p><strong>City:</strong> {location.city}</p>}
          {location.country && <p><strong>Country:</strong> {location.country}</p>}
          {address && <p><strong>Address:</strong> {address}</p>}
        </div>
      ) : (
        <p>No location data available</p>
      )}

      {location?.latitude && location?.longitude && (
        <MapContainer
          key={`${location.latitude}-${location.longitude}`} // forces re-render when location changes
          center={[location.latitude, location.longitude]}
          zoom={13}
          style={{ height: "400px", width: "100%", marginTop: "20px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[location.latitude, location.longitude]}>
            <Popup>
              {location.city}, {location.country}
              {address && <><br />{address}</>}
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default LiveTrackerPage;
