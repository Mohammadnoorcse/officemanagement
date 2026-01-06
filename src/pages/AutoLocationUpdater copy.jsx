import React, { useEffect, useState } from "react";

import axios from "axios";

const AutoLocationUpdater = () => {
 useEffect(() => {
    const sendLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
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
              console.log("Location sent:", latitude, longitude);
            } catch (error) {
              console.error("Error sending location:", error);
            }
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    };

    // Send location immediately
    sendLocation();

    // Send location every 5 minutes
    const interval = setInterval(sendLocation, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default AutoLocationUpdater;
