import React, { useEffect, useState } from "react";
import axios from "axios";

export default function WeekManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [allweekend, setAllWeekend] = useState([]);
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
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Fetch all weekends (nested by user)
  const fetchUserWeekendsList = async () => {
    try {
      const res = await api.get("/users-weekend-list");
      setAllWeekend(res.data);
    } catch (err) {
      console.error("Error fetching user weekends:", err);
    }
  };

  // Fetch weekends for a selected user
  const fetchWeekends = async (userId) => {
    setSelectedUser(userId);
    setLoading(true);
    try {
      const res = await api.get(`/weekend/${userId}`);
      setWeekends(res.data);
    } catch (err) {
      console.error("Error fetching weekends:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new weekend
  const addWeekend = async () => {
    if (!newDay || !selectedUser) return;

    try {
      const res = await api.post("/weekend/create", {
        user_id: selectedUser,
        day: newDay,
      });

      const newWeekend = res.data.data;

      // Update selected user's weekends
      setWeekends(prev => [...prev, newWeekend]);

      // Update allweekend nested structure
      setAllWeekend(prev => prev.map(user => {
        if (user.id === selectedUser) {
          return {
            ...user,
            weekends: [...user.weekends, newWeekend]
          };
        }
        return user;
      }));

      setNewDay("");
    } catch (err) {
      console.error("Error adding weekend:", err);
    }
  };

  // Delete a weekend
  const deleteWeekend = async (id) => {
    try {
      await api.delete(`/weekend/delete/${id}`);

      // Remove from selected user's weekends
      setWeekends(prev => prev.filter(w => w.id !== id));

      // Remove from allweekend nested structure
      setAllWeekend(prev => prev.map(user => ({
        ...user,
        weekends: user.weekends.filter(w => w.id !== id)
      })));

    } catch (err) {
      console.error("Error deleting weekend:", err);
    }
  };

  // Fetch users and all weekends on mount
  useEffect(() => {
    fetchUsers();
    fetchUserWeekendsList();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
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
        </div>
      )}

     {/* Show All Weekends in Table */}
{/* Show All Weekends grouped by user */}
<div className="mt-10">
  <h2 className="text-xl font-semibold mb-4">All Weekends</h2>

  {allweekend.length === 0 ? (
    <p>No weekends found.</p>
  ) : (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-4 py-2 text-left">User Name</th>
          <th className="border px-4 py-2 text-left">Weekend Days</th>
          <th className="border px-4 py-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {allweekend.map(user => (
          <tr key={user.id} className="hover:bg-gray-50">
            <td className="border px-4 py-2">{user.name}</td>
            <td className="border px-4 py-2">
              {user.weekends.map(w => w.day.charAt(0).toUpperCase() + w.day.slice(1)).join(", ")}
            </td>
            <td className="border px-4 py-2 flex gap-2">
              {user.weekends.map(w => (
                <button
                  key={w.id}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  onClick={() => deleteWeekend(w.id)}
                >
                  Delete {w.day.charAt(0).toUpperCase() + w.day.slice(1)}
                </button>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>


    </div>
  );
}
