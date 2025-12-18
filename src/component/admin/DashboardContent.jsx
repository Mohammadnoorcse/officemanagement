import React, { useEffect, useState } from "react";
import { LuAlarmClockMinus } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import graph1 from "../../assets/graph1.png";
import graph2 from "../../assets/graph2.png";
import graph3 from "../../assets/graph3.png";
import graph4 from "../../assets/graph4.png";
import axios from "axios";

const DashboardContent = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [today, setToday] = useState({
    counts: {
      present: 0,
      late: 0,
      leave: 0,
    },
    employees: {
      present: [],
      late: [],
      leave: [],
    }
  });

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  // 🔹 Fetch today's attendance summary
  const fetchAttendanceToday = async () => {
    try {
      const res = await api.get("/attendance/today-summary");
      setToday(res.data); // ✅ FIXED
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Generate today's attendance (if needed)
  const fetchAttendance = async () => {
    try {
      await api.post("/attendance/generate-today");
    } catch (err) {
      console.error(err);
    }
  };

    /** ------------------ Fetch users ------------------ */
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAttendance();
    fetchAttendanceToday();
    fetchUsers();

  }, []);

    // Submit task
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser || !description || !startDate || !endDate) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const res = await api.post("/tasks", {
        user_id: selectedUser,
        description,
        start_date: startDate,
        end_date: endDate,
        // status defaults to "do" in backend
      });

      alert("Task created successfully!");
      setSelectedUser("");
      setDescription("");
      setStartDate("");
      setEndDate("");
    } catch (err) {
      console.error(err);
      alert("Error creating task.");
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex justify-between items-center">
        <div className="">
          <h1 className="text-xl font-bold text-[#531954]">Hii,Noor!</h1>
          <p className="text-sm text-gray-400">
            You have 2 leave request pending
            {selectedUser}
          </p>
        </div>

        <div className="p-2 border border-gray-400 rounded-md flex justify-between items-center gap-2">
          <div>
            <p className="text-sm text-gray-400">Current time</p>
            <span className="text-[12px] font-bold text-gray-600">
              {new Date().toLocaleString("en-US", {
                timeZone: "Asia/Dhaka",
                hour12: true,
              })}
            </span>
          </div>

          <span className="text-2xl text-gray-400">
            <LuAlarmClockMinus />
          </span>
        </div>
      </div>

      {/* second items */}

      <div className="w-full flex sm:flex-row flex-col gap-2">
        {/* items-1 */}
        <div className="sm:w-2/3 w-full grid grid-cols-2 gap-2">
          {/* card */}
          <div className="w-full border border-gray-400 rounded-md p-2 shadow">
            <div className="w-full flex justify-between items-center">
              <h2>Employee's total</h2>
              <div className="w-[1.7rem] h-[1.7rem] bg-green-200 rounded-full flex justify-center items-center">
                <span className="text-green-400">
                  <FaRegUser />
                </span>
              </div>
            </div>

            <div className="flex justify-between items-end mt-4">
              <span className="text-base font-bold">{users.length > 0 ? users.length - 1 : 0}</span>
              <img src={graph1} alt="graph" className="w-16" />
            </div>
          </div>
          {/* card */}
          <div className="w-full border border-gray-400 rounded-md p-2 shadow">
            <div className="w-full flex justify-between items-center">
              <h2>Employee's present today</h2>
              <div className="w-[1.7rem] h-[1.7rem] bg-green-200 rounded-full flex justify-center items-center">
                <span className="text-green-400">
                  <FaRegUser />
                </span>
              </div>
            </div>

            <div className="flex justify-between items-end mt-4">
              <span className="text-base font-bold">{today?.counts?.present ?? 0}</span>
              <img src={graph2} alt="graph" className="w-16" />
            </div>
          </div>
          {/* card */}
          <div className="w-full border border-gray-400 rounded-md p-2 shadow">
            <div className="w-full flex justify-between items-center">
              <h2>Employee's leave today</h2>
              <div className="w-[1.7rem] h-[1.7rem] bg-green-200 rounded-full flex justify-center items-center">
                <span className="text-green-400">
                  <FaRegUser />
                </span>
              </div>
            </div>

            <div className="flex justify-between items-end mt-[2rem]">
              <span className="text-base font-bold">{today?.counts?.leave ?? 0}</span>
              <img src={graph3} alt="graph" className="w-16" />
            </div>
          </div>
          {/* card */}
          <div className="w-full border border-gray-400 rounded-md p-2 shadow">
            <div className="w-full flex justify-between items-center">
              <h2>Employee's late today</h2>
              <div className="w-[1.7rem] h-[1.7rem] bg-green-200 rounded-full flex justify-center items-center">
                <span className="text-green-400">
                  <FaRegUser />
                </span>
              </div>
            </div>

            <div className="flex justify-between items-end mt-4">
              <span className="text-base font-bold">{today?.counts?.late ?? 0}</span>
              <img src={graph4} alt="graph" className="w-16" />
            </div>
          </div>
        </div>
        {/* items-2 */}
        <div className="sm:w-1/3 w-full border border-gray-400 p-2 rounded-md">
      <h2 className="text-sm font-bold text-[#531954]">Create Task</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
        {/* User select */}
        <select
          name="user_id"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        {/* Start Date */}
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />

        {/* End Date */}
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded w-full"
          min={startDate} // ensure end date >= start date
          required
        />

        {/* Description */}
        <textarea
          rows="6"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write the task"
          className="w-full p-2 text-sm rounded border border-gray-300 outline-none"
          required
        ></textarea>

        <button
          type="submit"
          className="bg-[#531954] py-1 px-4 text-white rounded-md cursor-pointer mt-2"
        >
          Submit
        </button>
      </form>
    </div>
      </div>

      {/* third section */}
      <div className="w-full flex md:flex-row flex-col gap-4 ">
        {/* item-1 */}
        <div className="md:w-2/3  border border-gray-400 rounded-md p-2 shadow">
          <h2 className="text-sm font-bold text-gray-600">
            Today's Attendance
          </h2>

          <div className="w-full max-h-[10rem] overflow-y-auto mt-4 ">
            <table className="w-full text-left">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="p-2 ">Image</th>
                  <th className="p-2 ">Name</th>
                  <th className="p-2 ">Check-In</th>
                  <th className="p-2 ">Check-Out</th>
                </tr>
              </thead>

              <tbody>
  {today.employees.present.length === 0 ? (
    <tr>
      <td colSpan="3" className="p-2 text-center text-gray-400">
        No present employees
      </td>
    </tr>
  ) : (
    today.employees.present.map((att) => (
      <tr key={att.id} className="border-b">
          <td className="p-2">
            <img
              src={att.user?.image || "https://via.placeholder.com/40"}
              alt="emp"
              className="w-10 h-10 rounded-full object-cover"
            />
        </td>
        <td className="p-2 text-[14px]">
          {att.user?.name}
        </td>

        <td className="p-2 text-[14px] text-green-600">
          {att.login_time
            ? new Date(att.login_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-"}
        </td>

        <td className="p-2 text-[14px] text-red-600">
          {att.logout_time
            ? new Date(att.logout_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-"}
        </td>
      </tr>
    ))
  )}
</tbody>
            </table>
          </div>
        </div>
        <div className="md:w-1/3  border border-gray-400 rounded-md p-2 shadow">
          <h2 className="text-sm font-bold text-gray-600">Today's Late</h2>
          <div className="w-full max-h-[10rem] overflow-y-auto mt-4 ">
            <table className="w-full text-left">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                 
                  <th className="p-2 text-[14px]">Name</th>
                  <th className="p-2 text-[14px]">Check-In</th>
                  <th className="p-2 text-[14px]">Check-Out</th>
                </tr>
              </thead>

              <tbody>
  {today.employees.late.length === 0 ? (
    <tr>
      <td colSpan="3" className="p-2 text-center text-gray-400">
        No late employees
      </td>
    </tr>
  ) : (
    today.employees.late.map((att) => (
      <tr key={att.id} className="border-b">
        <td className="p-2 text-[14px]">
          {att.user?.name}
        </td>

        <td className="p-2 text-[14px] text-green-600">
          {att.login_time
            ? new Date(att.login_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-"}
        </td>

        <td className="p-2 text-[14px] text-red-600">
          {att.logout_time
            ? new Date(att.logout_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-"}
        </td>
      </tr>
    ))
  )}
</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
