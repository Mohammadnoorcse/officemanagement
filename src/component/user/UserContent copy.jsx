import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LuAlarmClockMinus,
  LuClock,
  LuClockAlert,
  LuAlarmClockOff,
} from "react-icons/lu";
import icon1 from "../../assets/icons8-progress.gif";

const UserContent = () => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const [reason, setReason] = useState("");
  const [editId, setEditId] = useState(null);
  const [viewId, setViewId] = useState(null);

  // ✅ IMPORTANT: initialize with safe defaults
  const [getTask, setGetTask] = useState({ tasks: [] });
  const [attendance, setAttendance] = useState({ counts: {} });

  const [selectedStatus, setSelectedStatus] = useState("do");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  /* ================= BREAK APIs ================= */

  const startBreakApi = async () => {
    try {
      await api.post("/break/start", { reason });
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  const endBreakApi = async () => {
    try {
      await api.post("/break/end");
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  /* ================= FETCH DATA ================= */

  const fetchAttendances = async () => {
    try {
      const res = await api.get("/attendance/current-month-summary/user");
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTask = async () => {
    try {
      const res = await api.get(`/users/${user.id}/tasks`);
      setGetTask(res.data || { tasks: [] });
    } catch (err) {
      console.error(err);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      fetchTask();
      setEditId(null);
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  /* ================= EFFECTS ================= */

  // Fetch once
  useEffect(() => {
    fetchAttendances();
    fetchTask();
  }, []);

  // Timer
  useEffect(() => {
    if (running) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  /* ================= HANDLERS ================= */

  const handleStart = (e) => {
    e.preventDefault();
    if (!reason.trim()) return alert("Reason is required!");
    startBreakApi();
    setRunning(false);
  };

  const handleStop = () => {
    endBreakApi();
    setRunning(true);
    setSeconds(0);
    setReason("");
  };

  /* ================= TIME FORMAT ================= */

  const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  /* ================= JSX ================= */

  return (
    <div className="w-full flex flex-col gap-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-[#531954]">
            Hi, {user?.name}!
          </h1>
        </div>

        <div className="p-2 border rounded flex items-center gap-2">
          <span className="text-sm">
            {new Date().toLocaleString("en-US", {
              timeZone: "Asia/Dhaka",
              hour12: true,
            })}
          </span>
          <LuAlarmClockMinus />
        </div>
      </div>

      {/* STATS */}
      <div className="grid lg:grid-cols-3 gap-2">
        <div className="p-2 border rounded shadow">
          <p className="text-sm text-gray-600">
            Employee performance summary
          </p>
          <img src={icon1} alt="" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Stat icon={<LuClock />} label="Present" value={attendance?.counts?.present} />
          <Stat icon={<LuClockAlert />} label="Leave" value={attendance?.counts?.leave} />
          <Stat icon={<LuAlarmClockOff />} label="Late" value={attendance?.counts?.late} />
        </div>

        {/* BREAK */}
        <div className="border p-2 rounded">
          <h2 className="font-bold">Break Time</h2>

          {running ? (
            <form>
              <textarea
                rows="5"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border p-2"
                placeholder="Break reason"
              />
              <button
                onClick={handleStart}
                className="bg-[#531954] text-white px-4 py-1 mt-2 rounded"
              >
                Start
              </button>
            </form>
          ) : (
            <div className="text-center">
              <p className="font-bold text-lg">
                {hours}:{minutes}:{secs}
              </p>
              <button
                onClick={handleStop}
                className="bg-red-600 text-white px-4 py-1 rounded"
              >
                End
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TASKS */}
      <div className="border p-2 rounded shadow">
        <h2 className="font-bold">Tasks</h2>

        {getTask.tasks.length === 0 ? (
          <p className="text-sm text-gray-400 mt-2">No tasks found</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            {getTask.tasks.map((item) => (
              <div
                key={item.id}
                className="border rounded p-4 cursor-pointer"
                onClick={() => setViewId(item.id)}
              >
                <p className="text-sm">{item.description}</p>

                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                  {item.status}
                </span>

                <div className="flex justify-between mt-3">
                  <span>{item.end_date}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditId(item.id);
                    }}
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </button>
                </div>

                {/* EDIT MODAL */}
                {editId === item.id && (
                  <Modal close={() => setEditId(null)}>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="border w-full p-2"
                    >
                      <option value="do">Do</option>
                      <option value="doing">Doing</option>
                      <option value="done">Done</option>
                    </select>

                    <button
                      onClick={() =>
                        updateTaskStatus(item.id, selectedStatus)
                      }
                      className="bg-green-600 text-white px-3 py-1 mt-3 rounded"
                    >
                      Save
                    </button>
                  </Modal>
                )}

                {/* VIEW MODAL */}
                {viewId === item.id && (
                  <Modal close={() => setViewId(null)}>
                    <p>{item.description}</p>
                  </Modal>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const Stat = ({ icon, label, value }) => (
  <div className="border p-2 rounded shadow">
    <span>{icon}</span>
    <p className="font-bold">{value ?? 0} Days</p>
    <p className="text-sm">{label}</p>
  </div>
);

const Modal = ({ children, close }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center"
    onClick={close}
  >
    <div
      className="bg-white p-6 rounded w-full max-w-md"
      onClick={(e) => e.stopPropagation()}
    >
      <button onClick={close} className="float-right text-red-600">
        X
      </button>
      {children}
    </div>
  </div>
);

export default UserContent;
