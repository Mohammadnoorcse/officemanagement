import React, { useState, useEffect } from "react";
import axios from "axios";

export default function HolidayManager() {
  const [holidays, setHolidays] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    start_date: "",
    end_date: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  /** ------------------ Fetch all holidays ------------------ */
  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const res = await api.get("/holidays");
      setHolidays(res.data.holidays);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  /** ------------------ Handle form input ------------------ */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /** ------------------ Submit create/update ------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      if (form.id) {
        // Update
        await api.put(`/holidays/${form.id}`, form);
        setMessage("Holiday updated successfully!");
      } else {
        // Create
        await api.post("/holidays", form);
        setMessage("Holiday created successfully!");
      }
      setForm({ id: null, name: "", start_date: "", end_date: "", description: "" });
      fetchHolidays();
    } catch (err) {
      setError(err.response?.data?.message || "Error saving holiday");
    }
  };

  /** ------------------ Edit holiday ------------------ */
  const handleEdit = (holiday) => {
    setForm({
      id: holiday.id,
      name: holiday.name,
      start_date: holiday.start_date,
      end_date: holiday.end_date,
      description: holiday.description || "",
    });
  };

  /** ------------------ Delete holiday ------------------ */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this holiday?")) return;
    try {
      await api.delete(`/holidays/${id}`);
      setMessage("Holiday deleted successfully!");
      fetchHolidays();
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting holiday");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-5 space-y-8">

      {/* ------------------ Holiday Form ------------------ */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">{form.id ? "Edit Holiday" : "Add Holiday"}</h2>

        {message && <div className="mb-4 text-green-600">{message}</div>}
        {error && <div className="mb-4 text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Holiday Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />

          <div className="flex gap-4">
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            rows="3"
            placeholder="Optional description"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {form.id ? "Update Holiday" : "Add Holiday"}
          </button>
        </form>
      </div>

      {/* ------------------ Holiday List ------------------ */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">All Holidays</h2>

        {loading ? (
          <div className="text-center">Loading holidays...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Start Date</th>
                  <th className="border p-2">End Date</th>
                  <th className="border p-2">Description</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {holidays?.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-3">
                      No holidays found
                    </td>
                  </tr>
                ) : (
                  holidays?.map((h) => (
                    <tr key={h.id} className="text-center">
                      <td className="border p-2">{h.name}</td>
                      <td className="border p-2">{h.start_date}</td>
                      <td className="border p-2">{h.end_date}</td>
                      <td className="border p-2">{h.description || "-"}</td>
                      <td className="border p-2 flex justify-center gap-2">
                        <button
                          className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                          onClick={() => handleEdit(h)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                          onClick={() => handleDelete(h.id)}
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
