import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Get user location first
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;

        

        try {
          // Send email + password + location together
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/login`,
            {
              email,
              password,
              latitude,
              longitude,
            }
          );

          const token = response.data.access_token;
          const user = response.data.user;

          // Store data
          localStorage.setItem("token", token);
          localStorage.setItem("role", user.role);
          localStorage.setItem("user", JSON.stringify(user));

          setSuccess("Login successful!");

          // Redirect
          const redirectTo =
            user.role === "admin" ? "/admin/dashboard" : "/dashboard";
          navigate(redirectTo);
        } catch (err) {
          setError(err.response?.data?.message || "Login failed!");
        }
      },

      (error) => {
        console.log("Location error:", error);
        setError("Please enable location to login.");
      }
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">
          Login
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
