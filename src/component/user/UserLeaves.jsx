import React, { useState, useEffect } from "react";
import axios from "axios";

export default function UserLeaves() {
  const [form, setForm] = useState({
    from_date: "",
    to_date: "",
    type: "",
    reason: "",
  });

  const [leaves, setLeaves] = useState([]); // always array
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  /* ---------------- Fetch My Leaves ---------------- */
  const fetchMyLeaves = async () => {
    try {
      setLoading(true);
      const res = await api.get("/leave/my");

      // 🔒 NULL SAFE
      setLeaves(Array.isArray(res.data?.leaves) ? res.data.leaves : []);
    } catch (err) {
      console.error(err);
      setLeaves([]); // prevent map crash
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Handle Form Change ---------------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ---------------- Submit Leave ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await api.post("/leave/apply", form);
      setMessage(res.data?.message || "Leave applied successfully!");
      setForm({ from_date: "", to_date: "", type: "", reason: "" });
      fetchMyLeaves();
    } catch (err) {
      setError(err.response?.data?.message || "Error applying leave");
    }
  };

  useEffect(() => {
    if (token) fetchMyLeaves();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-5 space-y-8">
      {/* ---------------- Apply Leave ---------------- */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Apply for Leave</h2>

        {message && <p className="text-green-600 mb-3">{message}</p>}
        {error && <p className="text-red-600 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="date"
            name="from_date"
            value={form.from_date}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />

          <input
            type="date"
            name="to_date"
            value={form.to_date}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          >
            <option value="">Select Type</option>
            <option value="casual">Casual</option>
            <option value="sick">Sick</option>
            <option value="earned">Earned</option>
          </select>

          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            rows="3"
            placeholder="Optional"
          />

          <button
            type="submit"
            className="bg-purple-600 text-white py-2 rounded w-full hover:bg-purple-700"
          >
            Apply Leave
          </button>
        </form>
      </div>

      {/* ---------------- My Leaves ---------------- */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">My Leaves</h2>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">From</th>
                <th className="border p-2">To</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Reason</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4">
                    No leaves found
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave.id || leave._id} className="text-center">
                    <td className="border p-2">{leave.from_date || "-"}</td>
                    <td className="border p-2">{leave.to_date || "-"}</td>
                    <td className="border p-2">{leave.type || "-"}</td>
                    <td className="border p-2">{leave.reason || "-"}</td>
                    <td className="border p-2 font-semibold">
                      {leave.status
                        ? leave.status.charAt(0).toUpperCase() +
                          leave.status.slice(1)
                        : "Pending"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
