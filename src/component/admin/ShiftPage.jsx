import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ShiftManager() {
  const [shifts, setShifts] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    id: null,
    user_id: "",
    name: "",
    day_of_week: "",
    start_time: "",
    end_time: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const token = localStorage.getItem("token");
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  // Fetch shifts & users
  useEffect(() => {
    fetchShifts();
    fetchUsers();
  }, []);

  const fetchShifts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/shifts");
      setShifts(res.data);
    } catch {}
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch {}
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); setError("");

    try {
      if (form.id) {
        await api.put(`/shifts/${form.id}`, {
          name: form.name,
          day_of_week: form.day_of_week.toLowerCase(),
          start_time: form.start_time,
          end_time: form.end_time,
        });
        setMessage("Shift updated successfully!");
      } else {
        await api.post("/shifts", {
          user_id: form.user_id,
          shifts: [{
            day_of_week: form.day_of_week.toLowerCase(),
            start_time: form.start_time,
            end_time: form.end_time,
          }],
        });
        setMessage("Shift created successfully!");
      }

      setForm({ id: null, user_id: "", name: "", day_of_week: "", start_time: "", end_time: "" });
      fetchShifts();
    } catch (err) {
      setError(err.response?.data?.message || "Error saving shift");
    }
  };

  const handleEdit = (shift) => setForm({
    id: shift.id,
    user_id: shift.user_id,
    name: shift.name,
    day_of_week: shift.day_of_week,
    start_time: shift.start_time,
    end_time: shift.end_time,
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this shift?")) return;
    try { await api.delete(`/shifts/${id}`); fetchShifts(); } catch {}
  };

  const shiftsByUser = users.map(u => {
    const userShifts = shifts.filter(s => s.user_id === u.id);
    const dayMap = {}; days.forEach(d => dayMap[d] = null);
    userShifts.forEach(s => dayMap[s.day_of_week] = s);
    return { user: u, dayMap };
  });

  return (
    <div className="max-w-7xl mx-auto p-5 space-y-8">
      {/* FORM */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">{form.id ? "Edit Shift" : "Add Shift"}</h2>
        {message && <p className="text-green-600 mb-2">{message}</p>}
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select name="user_id" value={form.user_id} onChange={handleChange} className="border p-2 rounded" required>
            <option value="">Select User</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          <input type="text" name="name" placeholder="Shift Name" value={form.name} onChange={handleChange} className="border p-2 rounded" required />
          <select name="day_of_week" value={form.day_of_week} onChange={handleChange} className="border p-2 rounded" required>
            <option value="">Select Day</option>
            {days.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <input type="time" name="start_time" value={form.start_time} onChange={handleChange} className="border p-2 rounded" required />
          <input type="time" name="end_time" value={form.end_time} onChange={handleChange} className="border p-2 rounded" required />
          <button type="submit" className="bg-blue-600 text-white rounded p-2 md:col-span-3">{form.id ? "Update Shift" : "Add Shift"}</button>
        </form>
      </div>

      {/* Weekly Table */}
      <div className="bg-white p-6 rounded shadow overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Weekly Shift Schedule</h2>
        {loading ? <p>Loading...</p> :
        <table className="w-full border-collapse border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Name</th>
              {days.map(d => <th key={d} className="border p-2">{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {shiftsByUser.map(({ user, dayMap }) => (
              <tr key={user.id} className="text-center">
                <td className="border p-2 font-semibold">{user.name}</td>
                {days.map(d => {
                  const shift = dayMap[d];
                  return <td key={d} className="border p-2">
                    {shift ? (
                      <div className="bg-blue-50 rounded p-1">
                        <div className="font-medium">{shift.name}</div>
                        <div className="text-xs">
                          {new Date(`1970-01-01T${shift.start_time}`).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:true})} - 
                          {new Date(`1970-01-01T${shift.end_time}`).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:true})}
                        </div>
                        <div className="flex justify-center gap-1 mt-1">
                          <button onClick={() => handleEdit(shift)} className="text-xs bg-yellow-400 text-white px-2 rounded">Edit</button>
                          <button onClick={() => handleDelete(shift.id)} className="text-xs bg-red-600 text-white px-2 rounded">Del</button>
                        </div>
                      </div>
                    ) : <span className="text-gray-400">—</span>}
                  </td>
                })}
              </tr>
            ))}
          </tbody>
        </table>}
      </div>
    </div>
  );
}
