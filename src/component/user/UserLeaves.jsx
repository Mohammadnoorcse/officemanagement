import React, { useState, useEffect } from "react";
import axios from "axios";

export default function UserLeaves() {
  const [form, setForm] = useState({
    from_date: "",
    to_date: "",
    type: "",
    reason: "",
  });
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  /** ------------------------
   * Fetch user's leaves
   * ------------------------ */
  const fetchMyLeaves = async () => {
    try {
      setLoading(true);
      const res = await api.get("/leave/my");
      setLeaves(res.data.leaves);
      console.log(res.data.leaves)
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  /** ------------------------
   * Handle form change
   * ------------------------ */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /** ------------------------
   * Submit leave application
   * ------------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await api.post("/leave/apply", form);
      setMessage(res.data.message || "Leave applied successfully!");
      setForm({ from_date: "", to_date: "", type: "", reason: "" });
      fetchMyLeaves(); // reload leaves
    } catch (err) {
      setError(err.response?.data?.message || "Error applying leave");
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-5 space-y-8">

      {/* ------------------ Leave Application Form ------------------ */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Apply for Leave</h2>

        {message && <div className="mb-4 text-green-600">{message}</div>}
        {error && <div className="mb-4 text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">From Date</label>
            <input
              type="date"
              name="from_date"
              value={form.from_date}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1">To Date</label>
            <input
              type="date"
              name="to_date"
              value={form.to_date}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">Select Type</option>
              <option value="casual">Casual</option>
              <option value="sick">Sick</option>
              <option value="earned">Earned</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Reason</label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              rows="3"
              placeholder="Optional"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
          >
            Apply Leave
          </button>
        </form>
      </div>

      {/* ------------------ Show My Leaves ------------------ */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">My Leaves</h2>

        {loading ? (
          <div className="text-center">Loading your leaves...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
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
                    <td colSpan="5" className="text-center p-3">
                      You have no leaves
                    </td>
                  </tr>
                ) : (
                  leaves.map((leave) => (
                    <tr key={leave.id} className="text-center">
                      <td className="border p-2">{leave.from_date}</td>
                      <td className="border p-2">{leave.to_date}</td>
                      <td className="border p-2">{leave.type || "-"}</td>
                      <td className="border p-2">{leave.reason || "-"}</td>
                      <td className="border p-2 font-semibold">
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
