import React, { useEffect, useState } from "react";
import AttendanceFilters from "./AttendanceFilters";
import AttendanceTable from "./AttendanceTable";
import axios from "axios";

const Attendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [month, setMonth] = useState("");
  const [search, setSearch] = useState("");

  // Fetch all users for the dropdown
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch attendances based on selected user/month
  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      let url = `${import.meta.env.VITE_API_URL}/api/attendances`;

      if (selectedUser && month) {
        url = `${import.meta.env.VITE_API_URL}/api/attendances/${selectedUser}/month?month=${month}`;
      } else if (selectedUser) {
        url = `${import.meta.env.VITE_API_URL}/api/attendances/${selectedUser}`;
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Handle if API returns { user, attendances } or just array
      const dataArray = res.data.attendances ? res.data.attendances : res.data;
      setAttendances(dataArray);
    } catch (err) {
      console.error(err);
    }
  };

  // Download XML file for selected user/month
  const downloadXML = async () => {
    if (!selectedUser) return alert("Select a user first");
    try {
      const token = localStorage.getItem("token");
      let url = `${import.meta.env.VITE_API_URL}/api/attendances/${selectedUser}/download`;
      if (month) url += `/${month}`; // pass month if selected

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute(
        "download",
        `attendance_user_${selectedUser}${month ? "_" + month : ""}.xml`
      );
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAttendance();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [selectedUser, month]);

  // Filter by search (by date)
  const filteredAttendance = attendances.filter((att) =>
    att.date.includes(search)
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-bold mb-2">Attendance Management</h2>

      <AttendanceFilters
        users={users}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        month={month}
        setMonth={setMonth}
        search={search}
        setSearch={setSearch}
        onDownload={downloadXML}
      />

      <AttendanceTable data={filteredAttendance} />
    </div>
  );
};

export default Attendance;
