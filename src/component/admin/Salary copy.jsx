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
        params: { month: selectedMonth },
      });

      const salariesData = res.data.active_users.map((u) => ({
        user_id: u.user_id,
        user_name: u.user_name,
        ...u.salary,
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

      setSalaries((prev) =>
        prev.map((s) => (s.user_id === user_id ? { ...s, status } : s)),
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
            onChange={(e) => setMonth(e.target.value)}
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
          <div className="w-full overflow-x-auto">
            <div className="min-w-[1100px] sm:min-w-full">
              <table className="w-full border-collapse border border-gray-300 text-xs sm:text-sm">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr className="whitespace-nowrap text-center">
                    <th className="border px-2 py-1">Name</th>
                    <th className="border px-2 py-1">Basic</th>
                    <th className="border px-2 py-1 hidden sm:table-cell">
                      MonthDays
                    </th>
                    <th className="border px-2 py-1">Present</th>
                    <th className="border px-2 py-1 hidden md:table-cell">
                      Late
                    </th>
                    <th className="border px-2 py-1 hidden md:table-cell">
                      Leave
                    </th>
                    <th className="border px-2 py-1">Absent</th>
                    <th className="border px-2 py-1 hidden lg:table-cell">
                      Holiday
                    </th>
                    <th className="border px-2 py-1 hidden lg:table-cell">
                      Weekend
                    </th>
                    <th className="border px-2 py-1 hidden lg:table-cell">
                      Overtime
                    </th>
                    <th className="border px-2 py-1 hidden xl:table-cell">
                      OT Amount
                    </th>
                    <th className="border px-2 py-1 hidden xl:table-cell">
                      Late Deduct
                    </th>
                    <th className="border px-2 py-1 hidden xl:table-cell">
                      Deduction
                    </th>
                    <th className="border px-2 py-1 hidden xl:table-cell">
                      Working Days
                    </th>
                    <th className="border px-2 py-1 hidden xl:table-cell">
                      Per Day
                    </th>
                    <th className="border px-2 py-1">Total</th>
                    <th className="border px-2 py-1">Status</th>
                    <th className="border px-2 py-1">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {salaries.map((s) => (
                    <tr
                      key={s.user_id}
                      className="text-center whitespace-nowrap"
                    >
                      <td className="border px-2 py-1">{s.user_name}</td>
                      <td className="border px-2 py-1">{s.basic_salary}</td>
                      <td className="border px-2 py-1 hidden sm:table-cell">
                        {s.month_in_days}
                      </td>
                      <td className="border px-2 py-1">{s.present_days}</td>
                      <td className="border px-2 py-1 hidden md:table-cell">
                        {s.late_days}
                      </td>
                      <td className="border px-2 py-1 hidden md:table-cell">
                        {s.leave_days}
                      </td>
                      <td className="border px-2 py-1">{s.absent_days}</td>
                      <td className="border px-2 py-1 hidden lg:table-cell">
                        {s.holiday}
                      </td>
                      <td className="border px-2 py-1 hidden lg:table-cell">
                        {s.weekend_days}
                      </td>
                      <td className="border px-2 py-1 hidden lg:table-cell">
                        {s.total_overtime_minutes}
                      </td>
                      <td className="border px-2 py-1 hidden xl:table-cell">
                        {s.overtime_amount}
                      </td>
                      <td className="border px-2 py-1 hidden xl:table-cell">
                        {s.late_deduction_days}
                      </td>
                      <td className="border px-2 py-1 hidden xl:table-cell">
                        {s.deduction_amount}
                      </td>
                      <td className="border px-2 py-1 hidden xl:table-cell">
                        {s.total_working_days}
                      </td>
                      <td className="border px-2 py-1 hidden xl:table-cell">
                        {s.per_day_amount}
                      </td>
                      <td className="border px-2 py-1 font-semibold">
                        {s.final_salary}
                      </td>
                      <td className="border px-2 py-1 capitalize">
                        {s.status}
                      </td>

                      <td className="border px-2 py-1">
                        {s.status === "pending" ? (
                          <button
                            className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                            onClick={() => updateStatus(s.user_id, "paid")}
                          >
                            Paid
                          </button>
                        ) : (
                          <button
                            className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                            onClick={() => updateStatus(s.user_id, "pending")}
                          >
                            Pending
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryPage;
