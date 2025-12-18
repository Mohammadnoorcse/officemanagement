import React, { useEffect, useState } from "react";
import axios from "axios";

const ITEMS_PER_PAGE = 10;

const AttendanceTable = ({ data }) => {
  const [addresses, setAddresses] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const fetchAddresses = async (pageData) => {
    const results = await Promise.all(
      pageData.map(async (att) => {
        if (!att.latitude || !att.longitude) return { id: att.id, address: "-" };

        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${att.latitude}&lon=${att.longitude}&format=json`
          );
          return { id: att.id, address: res.data.display_name || "-" };
        } catch (err) {
          return { id: att.id, address: "-" };
        }
      })
    );

    const addrObj = results.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.address }), {});
    setAddresses((prev) => ({ ...prev, ...addrObj }));
  };

  useEffect(() => {
    if (!data || data.length === 0) return;

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageData = data.slice(start, end);

    fetchAddresses(pageData);
  }, [data, currentPage]);

  if (!data || data.length === 0) return <p className="text-center p-4">No attendance records found.</p>;

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageData = data.slice(start, end);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Login</th>
            <th className="p-2 border">Logout</th>
            <th className="p-2 border">Login Address</th>
          </tr>
        </thead>
        <tbody>
          {pageData.map((att) => (
            <tr key={att.id} className="hover:bg-gray-50">
              <td className="p-2 border whitespace-nowrap">{att.date}</td>
              <td className="p-2 border">-</td>
              <td className="p-2 border whitespace-nowrap">{att.user.name}</td>
              <td className="p-2 border whitespace-nowrap">
                {att.login_time
                  ? new Date(att.login_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </td>
              <td className="p-2 border whitespace-nowrap">
                {att.logout_time
                  ? new Date(att.logout_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </td>
              <td className="p-2 border">{addresses[att.id] || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex flex-wrap justify-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`px-3 py-1 border rounded ${
              num === currentPage ? "bg-blue-500 text-white" : ""
            }`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AttendanceTable;
