import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const AttendaceRecord = () => {
  const [data, setData] = useState(null);
  const [month, setMonth] = useState("");
  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchData = async (selectedMonth = "") => {
    try {
      const res = await api.get(
        `/month-matrix${selectedMonth ? `?month=${selectedMonth}` : ""}`
      );
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statusColor = (status, date) => {
    const today = new Date().toISOString().split("T")[0];
    if (status === "absent" && date < today) return "bg-red-500";
    switch (status) {
      case "present":
        return "bg-green-500";
      case "late":
        return "bg-yellow-400";
      case "leave":
        return "bg-blue-400";
      case "holiday":
        return "bg-purple-400";
      case "weekend":
        return "bg-gray-400";
      default:
        return "bg-gray-200";
    }
  };

  const statusLetter = (status, date) => {
    const today = new Date().toISOString().split("T")[0];
    if (status === "absent" && date < today) return "A";
    if (status === "present") return "P";
    if (status === "late") return "L";
    if (status === "weekend") return "W";
    if (status === "leave") return "Le";
    if (status === "holiday") return "H";
    return "";
  };

  // Export Excel
  const exportExcel = () => {
    if (!data) return;

    const wsData = [
      ["Name", ...data.dates],
      ...data.users.map((user) => [
        user.name,
        ...data.dates.map((date) => statusLetter(user.records[date] || "absent", date)),
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");

    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buf], { type: "application/octet-stream" }),
      `attendance_${data.month}.xlsx`
    );
  };

  if (!data) return <div className="p-5">Loading...</div>;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="p-5">
      {/* Month Picker & Export */}
      <div className="mb-4 flex items-center gap-4">
        <input
          type="month"
          className="border p-2 rounded"
          value={month}
          onChange={(e) => {
            setMonth(e.target.value);
            fetchData(e.target.value);
          }}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={exportExcel}
        >
          Export Excel
        </button>
      </div>

      {/* Attendance Table */}
      <div className="overflow-auto border rounded">
        <table className="min-w-full text-sm text-center">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="p-2 border">Name</th>
              {data.dates.map((d) => (
                <th key={d} className="p-2 border">
                  {d.split("-")[2]}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.users.map((user) => (
              <tr key={user.user_id}>
                <td className="border p-2 font-semibold text-left">{user.name}</td>
                {data.dates.map((date) => {
                  const status = user.records[date] || "absent";
                  const colorClass = statusColor(status, date);
                  const letter = statusLetter(status, date);

                  return (
                    <td key={date} className="border p-1">
                      <div
                        className={`w-6 h-6 mx-auto rounded flex items-center justify-center text-white text-xs ${colorClass}`}
                        title={status}
                      >
                        {letter}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 text-sm flex-wrap">
        <Legend color="bg-green-500" label="Present (P)" />
        <Legend color="bg-yellow-400" label="Late (L)" />
        <Legend color="bg-red-500" label="Absent(A)" />
        <Legend color="bg-blue-400" label="Leave(Le)" />
        <Legend color="bg-purple-400" label="Holiday(H)" />
        <Legend color="bg-gray-400" label="Weekend (W)" />
      </div>
    </div>
  );
};

// Legend Component
const Legend = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 ${color} rounded`}></div>
    <span>{label}</span>
  </div>
);

export default AttendaceRecord;
