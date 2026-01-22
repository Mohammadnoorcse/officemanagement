import React, { useEffect, useState } from "react";
import axios from "axios";
import AttendanceFilters from "./AttendanceFilters";
import AttendanceTable from "./AttendanceTable";

const Attendance = () => {
  // ✅ Always current month
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [attendances, setAttendances] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  // ✅ Get userId from localStorage (safe)
  const storedUser =
    JSON.parse(localStorage.getItem("user")) || {};
  const userId =
    storedUser.id || localStorage.getItem("user_id");

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  // ✅ Fetch attendance (USER + MONTH)
  const fetchAttendances = async () => {
    if (!userId) return;

    try {
      const res = await api.get(
        `/attendances/${userId}/month`,
        { params: { month } }
      );

      // Optional: present days only
      const presentOnly = res.data.filter(
        (att) => att.login_time !== null
      );

      setAttendances(presentOnly);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setAttendances([]);
    }
  };

  // 🔁 Auto fetch on month change
  useEffect(() => {
    fetchAttendances();
  }, [month]);

  // 🔍 Search filter
  const filtered = attendances.filter(
    (att) =>
      att.date.includes(search) ||
      att.user?.name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // 📄 Pagination
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="p-4 max-w-6xl mx-auto flex flex-col gap-4">
      <h2 className="text-2xl font-bold">
        My Attendance ({month})
      </h2>

      <AttendanceFilters
        month={month}
        setMonth={setMonth}
        search={search}
        setSearch={setSearch}
      />

      <AttendanceTable data={currentData} />

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (num) => (
              <button
                key={num}
                className={`px-3 py-1 rounded ${
                  currentPage === num
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setCurrentPage(num)}
              >
                {num}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Attendance;
