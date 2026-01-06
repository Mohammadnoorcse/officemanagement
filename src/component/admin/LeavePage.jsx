import React, { useState, useEffect } from "react";
import axios from "axios";

export default function LeavePage() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  /** ------------------------
   * Fetch all leaves (admin)
   * ------------------------ */
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await api.get("/leave/all");
      setLeaves(res.data.leaves);
      setLoading(false);
    } catch (err) {
      console.error("Error loading leaves:", err);
      setLoading(false);
    }
  };

  /** ------------------------
   * Update leave status
   * ------------------------ */
  const updateStatus = async (leaveId, status) => {
    try {
      await api.put(`/leave/${leaveId}/status`, { status });
      fetchLeaves(); // reload
    } catch (err) {
      console.error("Error updating leave status:", err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading leaves...</div>;
  }

  return (
    <div className="p-5 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">All Leaves</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">User</th>
              <th className="border p-2">From</th>
              <th className="border p-2">To</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Reason</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-3">
                  No leaves found
                </td>
              </tr>
            ) : (
              leaves?.map((leave) => (
                <tr key={leave.id} className="text-center">
                  <td className="border p-2">{leave.user?.name}</td>
                  <td className="border p-2">{leave.from_date}</td>
                  <td className="border p-2">{leave.to_date}</td>
                  <td className="border p-2">{leave.type || "-"}</td>
                  <td className="border p-2">{leave.reason || "-"}</td>
                  <td className="border p-2 font-semibold">
                    {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                  </td>
                  <td className="border p-2 space-x-2">
                    {leave.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(leave.id, "approved")}
                          className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(leave.id, "rejected")}
                          className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
