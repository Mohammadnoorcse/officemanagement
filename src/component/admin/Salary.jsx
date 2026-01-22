import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const SalaryPage = () => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [month, setMonth] = useState(currentMonth);
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  // Fetch salaries
  const fetchAllData = async (selectedMonth = month) => {
    if (!selectedMonth) return setMessage("Please select a month");
    setLoading(true);
    setMessage("");

    try {
      const res = await api.get("/salary/all", {
        params: { month: selectedMonth },
      });

      const data = res.data.active_users.map((u) => ({
        user_id: u.user_id,
        user_name: u.user_name,
        ...u.salary,
      }));

      setSalaries(data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error fetching salaries");
    } finally {
      setLoading(false);
    }
  };

  // Calculate salaries
  const calculateSalaries = async () => {
    if (!month) return setMessage("Please select a month");
    setLoading(true);
    setMessage("");

    try {
      await api.post("/salary/calculate-active", { month });
      fetchAllData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error calculating salaries");
    } finally {
      setLoading(false);
    }
  };

  // Update status
  const updateStatus = async (user_id, status) => {
    setLoading(true);
    try {
      await api.post("/salary/update-status", { user_id, month, status });
      setSalaries((prev) =>
        prev.map((s) => (s.user_id === user_id ? { ...s, status } : s))
      );
    } catch (err) {
      setMessage(err.response?.data?.message || "Error updating status");
    } finally {
      setLoading(false);
    }
  };

  // Excel Download (ALL columns)
  const downloadExcel = () => {
    if (!salaries.length) {
      setMessage("No data to export");
      return;
    }

    const excelData = salaries.map((s) => ({
      Name: s.user_name,
      "Basic Salary": s.basic_salary,
      "Month Days": s.month_in_days,
      "Present Days": s.present_days,
      "Late Days": s.late_days,
      "Leave Days": s.leave_days,
      "Absent Days": s.absent_days,
      Holiday: s.holiday,
      Weekend: s.weekend_days,
      "Overtime Minutes": s.total_overtime_minutes,
      "Overtime Amount": s.overtime_amount,
      "Late Deduction Days": s.late_deduction_days,
      "Deduction Amount": s.deduction_amount,
      "Total Working Days": s.total_working_days,
      "Per Day Amount": s.per_day_amount,
      "Final Salary": s.final_salary,
      Status: s.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Salary Report");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `salary_${month}.xlsx`);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div className="w-full p-2 flex flex-col gap-4">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <h1 className="text-xl font-bold text-[#531954]">Salary Management</h1>

        <div className="flex gap-2 flex-wrap">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="p-1 rounded"
          />

          <button
            className="bg-green-600 text-white px-3 py-1 rounded"
            onClick={calculateSalaries}
          >
            Calculate & Fetch
          </button>

          <button
            className="bg-blue-600 text-white px-3 py-1 rounded"
            onClick={() => fetchAllData()}
          >
            Refresh
          </button>

          <button
            className="bg-purple-600 text-white px-3 py-1 rounded"
            onClick={downloadExcel}
          >
            Download Excel
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] border text-sm">
            <thead className="bg-gray-100">
              <tr className="text-center">
                <th className="border p-1">Name</th>
                <th className="border p-1">Basic</th>
                <th className="border p-1">MonthDays</th>
                <th className="border p-1">Present</th>
                <th className="border p-1">Late</th>
                <th className="border p-1">Leave</th>
                <th className="border p-1">Absent</th>
                <th className="border p-1">Holiday</th>
                <th className="border p-1">Weekend</th>
                <th className="border p-1">Overtime</th>
                <th className="border p-1">OT Amount</th>
                <th className="border p-1">Late Deduct</th>
                <th className="border p-1">Deduction</th>
                <th className="border p-1">Working Days</th>
                <th className="border p-1">Per Day</th>
                <th className="border p-1">Total</th>
                <th className="border p-1">Status</th>
                <th className="border p-1">Action</th>
              </tr>
            </thead>

            <tbody>
              {salaries.map((s) => (
                <tr key={s.user_id} className="text-center">
                  <td className="border p-1">{s.user_name}</td>
                  <td className="border p-1">{s.basic_salary}</td>
                  <td className="border p-1">{s.month_in_days}</td>
                  <td className="border p-1">{s.present_days}</td>
                  <td className="border p-1">{s.late_days}</td>
                  <td className="border p-1">{s.leave_days}</td>
                  <td className="border p-1">{s.absent_days}</td>
                  <td className="border p-1">{s.holiday}</td>
                  <td className="border p-1">{s.weekend_days}</td>
                  <td className="border p-1">{s.total_overtime_minutes}</td>
                  <td className="border p-1">{s.overtime_amount}</td>
                  <td className="border p-1">{s.late_deduction_days}</td>
                  <td className="border p-1">{s.deduction_amount}</td>
                  <td className="border p-1">{s.total_working_days}</td>
                  <td className="border p-1">{s.per_day_amount}</td>
                  <td className="border p-1 font-semibold">
                    {s.final_salary}
                  </td>
                  <td className="border p-1 capitalize">{s.status}</td>
                  <td className="border p-1">
                    <button
                      className={`px-2 py-1 text-xs rounded text-white ${
                        s.status === "pending"
                          ? "bg-green-600"
                          : "bg-yellow-500"
                      }`}
                      onClick={() =>
                        updateStatus(
                          s.user_id,
                          s.status === "pending" ? "paid" : "pending"
                        )
                      }
                    >
                      {s.status === "pending" ? "Paid" : "Pending"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalaryPage;
