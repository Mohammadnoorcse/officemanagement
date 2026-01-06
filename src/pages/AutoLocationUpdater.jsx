import { useEffect } from "react";
import axios from "axios";

const AutoLocationUpdater = () => {
  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const device_info = navigator.userAgent;

        try {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/geo-locations`,
            { latitude, longitude, device_info },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("Location updated");
        } catch (err) {
          console.error("API error", err.response?.data || err);
        }
      },
      (error) => {
        console.error("Geo error:", error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return null;
};

export default AutoLocationUpdater;
