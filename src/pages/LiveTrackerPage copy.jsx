import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useParams } from "react-router-dom";



const LiveTrackerPage = () => {
 const { id } = useParams(); // change to your employer/user id
  const [location, setLocation] = useState(null);

  // Fetch location from Laravel API
  const fetchLocation = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user-location/${id}`);
      setLocation(res.data);
    } catch (err) {
      console.error("Error fetching location", err);
    }
  };

 

  useEffect(() => {
    fetchLocation(); 

   
    const interval = setInterval(fetchLocation, 5000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Employer Live Location Tracker</h2>

      {/* Show details */}
      {location ? (
        <div>
          <p><strong>IP:</strong> {location.ip}</p>
          <p><strong>City:</strong> {location.city}</p>
          <p><strong>Country:</strong> {location.country}</p>
        </div>
      ) : (
        <p>Loading location...</p>
      )}

      {/* Show map */}
      {location?.latitude && location?.longitude && (
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={13}
          style={{ height: "400px", width: "100%", marginTop: "20px" }}
        >
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          />
          <Marker position={[location.latitude, location.longitude]}>
            <Popup>
              {location.city}, {location.country}
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default LiveTrackerPage;
