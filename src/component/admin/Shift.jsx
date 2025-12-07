import React, { useState } from "react";

export default function ShiftPage() {
  const [shifts, setShifts] = useState([
    {
      id: 1,
      name: "Aminur",
      date: "2025-12-05",
      startTime: "09:00 AM",
      endTime: "05:00 PM",
      role: "Manager",
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    role: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.role || !form.date || !form.startTime || !form.endTime) {
      alert("Please fill all fields!");
      return;
    }
    const newShift = { id: Date.now(), ...form };
    setShifts([...shifts, newShift]);
    setForm({ name: "", role: "", date: "", startTime: "", endTime: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Shift Schedule</h1>

        {/* Input Form */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Shift</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Employee Name"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            <input
              type="text"
              name="role"
              placeholder="Role"
              value={form.role}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 md:col-span-2"
            >
              Add Shift
            </button>
          </form>
        </div>

        {/* Shift Table for large screens */}
        <div className="hidden md:block overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shifts.map((shift) => (
                <tr key={shift.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{shift.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{shift.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{shift.startTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{shift.endTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{shift.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card layout for small screens */}
        <div className="md:hidden space-y-4">
          {shifts.map((shift) => (
            <div key={shift.id} className="bg-white p-4 rounded-lg shadow">
              <p><span className="font-semibold">Name:</span> {shift.name}</p>
              <p><span className="font-semibold">Role:</span> {shift.role}</p>
              <p><span className="font-semibold">Start:</span> {shift.startTime}</p>
              <p><span className="font-semibold">End:</span> {shift.endTime}</p>
              <p><span className="font-semibold">Date:</span> {shift.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
