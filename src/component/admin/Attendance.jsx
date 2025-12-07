import React, { useEffect, useState } from "react";
import AttendanceFilters from "./AttendanceFilters";
import AttendanceTable from "./AttendanceTable";
import axios from "axios";

const Attendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const token = localStorage.getItem("token");
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  // Fetch all attendances for the current month
  const fetchAttendances = async () => {
    try {
      const res = await api.get(`/attendances/all?month=${month}`);
      const dataArray = Array.isArray(res.data)
        ? res.data
        : res.data.attendances || [];

      // Keep only rows with login_time (present days)
      const presentOnly = dataArray.filter((att) => att.login_time !== null);

      setAttendances(presentOnly);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setAttendances([]);
    }
  };

  useEffect(() => {
    fetchAttendances();
  }, [month]);

  // Filter by search (user name or date)
  const filtered = Array.isArray(attendances)
    ? attendances.filter(
        (att) =>
          att.date.includes(search) ||
          (att.user &&
            att.user.name.toLowerCase().includes(search.toLowerCase()))
      )
    : [];

  // Pagination
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="p-4 max-w-6xl mx-auto flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-4">Attendance Management</h2>

      <AttendanceFilters
        month={month}
        setMonth={setMonth}
        search={search}
        setSearch={setSearch}
      />

      <AttendanceTable data={currentData} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={`px-3 py-1 rounded ${
                currentPage === num ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setCurrentPage(num)}
            >
              {num}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Attendance;
