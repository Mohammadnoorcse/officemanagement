import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ShiftManager() {
  const [shifts, setShifts] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    id: null,
    user_id: "",
    name: "",
    date: "",
    start_time: "",
    end_time: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  /** ------------------ Fetch shifts ------------------ */
  const fetchShifts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/shifts");
      setShifts(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  /** ------------------ Fetch users ------------------ */
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchShifts();
    fetchUsers();
  }, []);

  /** ------------------ Handle input ------------------ */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /** ------------------ Create / Update shift ------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      if (form.id) {
        // Update
        await api.put(`/shifts/${form.id}`, form);
        setMessage("Shift updated successfully!");
      } else {
        // Create
        await api.post("/shifts", form);
        setMessage("Shift created successfully!");
      }
      setForm({
        id: null,
        user_id: "",
        name: "",
        date: "",
        start_time: "",
        end_time: "",
      });
      fetchShifts();
    } catch (err) {
      setError(err.response?.data?.message || "Error saving shift");
    }
  };

  /** ------------------ Edit shift ------------------ */
  const handleEdit = (shift) => {
    setForm({
      id: shift.id,
      user_id: shift.user_id,
      name: shift.name,
      date: shift.date,
      start_time: shift.start_time,
      end_time: shift.end_time,
    });
  };

  /** ------------------ Delete shift ------------------ */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this shift?")) return;
    try {
      await api.delete(`/shifts/${id}`);
      setMessage("Shift deleted successfully!");
      fetchShifts();
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting shift");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-5 space-y-8">
      {/* ------------------ Shift Form ------------------ */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">
          {form.id ? "Edit Shift" : "Add Shift"}
        </h2>

        {message && <div className="mb-4 text-green-600">{message}</div>}
        {error && <div className="mb-4 text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select User */}
          <select
            name="user_id"
            value={form.user_id}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="name"
            placeholder="Shift Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />

          <div className="flex gap-2">
            <input
              type="time"
              name="start_time"
              value={form.start_time}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="time"
              name="end_time"
              value={form.end_time}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {form.id ? "Update Shift" : "Add Shift"}
          </button>
        </form>
      </div>

      {/* ------------------ Shift List ------------------ */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">All Shifts</h2>

        {loading ? (
          <div className="text-center">Loading shifts...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">User</th>
                  <th className="border p-2">Shift Name</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Start</th>
                  <th className="border p-2">End</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {shifts?.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-3">
                      No shifts found
                    </td>
                  </tr>
                ) : (
                  shifts?.map((s) => (
                    <tr key={s.id} className="text-center">
                      <td className="border p-2">{s.user?.name}</td>
                      <td className="border p-2">{s.name}</td>
                      <td className="border p-2">{s.date}</td>
                      <td className="border p-2">
                        {s.start_time
                          ? new Date(
                              `1970-01-01T${s.start_time}`
                            ).toLocaleTimeString("en-US", {
                              hour12: true,
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </td>
                      <td className="border p-2">
                        {s.end_time
                          ? new Date(
                              `1970-01-01T${s.end_time}`
                            ).toLocaleTimeString("en-US", {
                              hour12: true,
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </td>{" "}
                      <td className="border p-2 flex justify-center gap-2">
                        <button
                          className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                          onClick={() => handleEdit(s)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                          onClick={() => handleDelete(s.id)}
                        >
                          Delete
                        </button>
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
