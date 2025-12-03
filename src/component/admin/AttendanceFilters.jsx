import React from "react";

const AttendanceFilters = ({
  users,
  selectedUser,
  setSelectedUser,
  month,
  setMonth,
  search,
  setSearch,
  onDownload,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4 items-center">
      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        className="border p-1 rounded"
      >
        <option value="">Select User</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border p-1 rounded"
      />

      <input
        type="text"
        placeholder="Search by date (YYYY-MM-DD)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-1 rounded"
      />

      <button
        onClick={onDownload}
        className="bg-green-600 text-white px-3 py-1 rounded"
      >
        Download XML
      </button>
    </div>
  );
};

export default AttendanceFilters;
