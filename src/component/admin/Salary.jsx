import React, { useEffect, useState } from "react";
import axios from "axios";

const SalaryPage = () => {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const [month, setMonth] = useState(currentMonth);
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  // Fetch all active users salaries
  const fetchAllData = async (selectedMonth = month) => {
    if (!selectedMonth) return setMessage("Please select a month");
    setLoading(true);
    setMessage("");

    try {
      const res = await api.get("/salary/all", {
        params: { month: selectedMonth }
      });

      const salariesData = res.data.active_users.map(u => ({
        user_id: u.user_id,
        user_name: u.user_name,
        ...u.salary
      }));

      setSalaries(salariesData);
      setMessage("Salaries fetched successfully!");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error fetching salaries");
    } finally {
      setLoading(false);
    }
  };

  // Calculate salaries for all active users
  const calculateSalaries = async () => {
    if (!month) return setMessage("Please select a month");
    setLoading(true);
    setMessage("");

    try {
      await api.post("/salary/calculate-active", { month });
      setMessage("Salaries calculated successfully!");
      fetchAllData();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error calculating salaries");
      setLoading(false);
    }
  };

  // Update salary status
  const updateStatus = async (user_id, status) => {
    setLoading(true);
    setMessage("");

    try {
      await api.post("/salary/update-status", { user_id, month, status });

      setSalaries(prev =>
        prev.map(s => (s.user_id === user_id ? { ...s, status } : s))
      );

      setMessage(`Status updated to ${status}`);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error updating status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div className="w-full p-2 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <h1 className="text-xl font-bold text-[#531954]">Salary Management</h1>
        <div className="flex gap-2">
          <input
            type="month"
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="p-1 rounded outline-none"
          />
          <button
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            onClick={calculateSalaries}
          >
            Calculate & Fetch Salaries
          </button>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            onClick={() => fetchAllData()}
          >
            Refresh
          </button>
        </div>
      </div>

      {message && <div className="text-center text-red-600">{message}</div>}

      <div className="overflow-auto w-full">
        {loading ? (
          <div className="text-center p-4">Loading...</div>
        ) : (
          <table className="w-full border border-gray-300 table-auto text-xs sm:text-sm md:text-base">
            <thead className="bg-gray-100">
              <tr className="text-center">
                <th className="border p-1">Name</th>
                <th className="border p-1">Basic</th>
                <th className="border p-1">Working Days</th>
                <th className="border p-1">Late</th>
                <th className="border p-1">Leave</th>
                <th className="border p-1">Absent</th>
                <th className="border p-1">Overtime</th>
                <th className="border p-1">Total</th>
                <th className="border p-1">Status</th>
                <th className="border p-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {salaries.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center p-3">No salaries found</td>
                </tr>
              ) : (
                salaries.map(s => (
                  <tr key={s.user_id} className="text-center">
                    <td className="border p-1">{s.user_name}</td>
                    <td className="border p-1">{s.basic_salary}</td>
                    <td className="border p-1">{s.total_working_days}</td>
                    <td className="border p-1">{s.late_days}</td>
                    <td className="border p-1">{s.leave_days}</td>
                    <td className="border p-1">{s.absent_days}</td>
                    <td className="border p-1">{s.total_overtime_minutes}</td>
                    <td className="border p-1 font-semibold">{s.final_salary}</td>
                    <td className="border p-1 font-semibold">{s.status}</td>
                    <td className="border p-1 flex justify-center gap-1">
                      {s.status === "pending" ? (
                        <button
                          className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                          onClick={() => updateStatus(s.user_id, "paid")}
                        >
                          Mark Paid
                        </button>
                      ) : (
                        <button
                          className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                          onClick={() => updateStatus(s.user_id, "pending")}
                        >
                          Mark Pending
                        </button>
                      )}
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
};

export default SalaryPage;
