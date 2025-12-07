import React from "react";

const AttendanceFilters = ({ month, setMonth, search, setSearch }) => {
  return (
    <div className="flex gap-4 mb-4 flex-wrap">
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Search by date or user"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded flex-1"
      />
    </div>
  );
};


export default AttendanceFilters;
