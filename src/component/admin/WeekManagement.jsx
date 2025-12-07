import React, { useEffect, useState } from "react";
import axios from "axios";

export default function WeekManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [weekends, setWeekends] = useState([]);
  const [newDay, setNewDay] = useState("");
  const [loading, setLoading] = useState(false);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const token = localStorage.getItem("token");
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  // Fetch all users
  useEffect(() => {
    api.get("/users") // Replace with your API
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch user weekends
  const fetchWeekends = (userId) => {
    setSelectedUser(userId);
    setLoading(true);
    api.get(`/weekend/${userId}`)
      .then(res => setWeekends(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  // Add new weekend day
  const addWeekend = () => {
    if (!newDay || !selectedUser) return;

    api.post("/weekend/create", { user_id: selectedUser, day: newDay })
      .then(res => {
        setWeekends(prev => [...prev, res.data.data]);
        setNewDay("");
      })
      .catch(err => console.error(err));
  };

  // Delete weekend
  const deleteWeekend = (id) => {
    axios.delete(`/api/weekend/delete/${id}`)
      .then(() => {
        setWeekends(prev => prev.filter(w => w.id !== id));
      })
      .catch(err => console.error(err));
  };



  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Week Management</h1>

      {/* Select User */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Select User:</label>
        <select
          className="border p-2 rounded w-full"
          value={selectedUser || ""}
          onChange={e => fetchWeekends(e.target.value)}
        >
          <option value="">-- Select User --</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>

      {selectedUser && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Weekend Days</h2>

          {/* Add Weekend Day */}
          <div className="flex gap-2 mb-4">
            <select
              className="border p-2 rounded flex-1"
              value={newDay}
              onChange={e => setNewDay(e.target.value)}
            >
              <option value="">-- Select Day --</option>
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={addWeekend}
            >
              Add
            </button>
          </div>

          {/* List Weekends */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="border rounded p-4">
              {weekends.length === 0 && <p>No weekend days added.</p>}
              {weekends.map(w => (
                <li key={w.id} className="flex justify-between items-center mb-2">
                  <span>{w.day.charAt(0).toUpperCase() + w.day.slice(1)}</span>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => deleteWeekend(w.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
