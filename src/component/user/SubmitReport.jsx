import { useEffect, useState } from "react";
import api from "../../api/axios";

const SubmitReport = () => {
  const [tasks, setTasks] = useState([]); // ✅ always array
  const [taskId, setTaskId] = useState("");
  const [summary, setSummary] = useState("");
  const [hours, setHours] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  /* ================= FETCH TASKS ================= */
  const fetchTasks = async () => {
    try {
      const res = await api.get("/my-tasks");
      console.log("MY TASKS RESPONSE:", res.data); // 🔍 debug once

      const tasksArray =
        Array.isArray(res.data) ? res.data :
        Array.isArray(res.data.tasks) ? res.data.tasks :
        Array.isArray(res.data.data) ? res.data.data :
        [];

      setTasks(tasksArray);
    } catch (err) {
      console.error("Failed to load tasks", err);
      setTasks([]);
    }
  };

  /* ================= SUBMIT REPORT ================= */
  const submit = async () => {
    if (!taskId) {
      alert("Please select a task");
      return;
    }

    try {
      await api.post("/team-report/submit", {
        task_id: Number(taskId),
        work_summary: summary,
        hours_spent: Number(hours),
      });

      alert("Report submitted successfully");

      setTaskId("");
      setSummary("");
      setHours("");
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.message || "Submission failed");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-md">
      <h2 className="font-semibold mb-3">Submit Task Report</h2>

      {/* TASK SELECT */}
      <select
        className="border w-full p-2 mb-3"
        value={taskId}
        onChange={(e) => setTaskId(e.target.value)}
      >
        <option value="">Select Task</option>

        {tasks.length === 0 && (
          <option disabled>No tasks found</option>
        )}

        {tasks.map((task) => (
          <option key={task.id} value={task.id}>
            {task.title}
          </option>
        ))}
      </select>

      {/* SUMMARY */}
      <textarea
        className="border w-full p-2 mb-3"
        placeholder="Work summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />

      {/* HOURS */}
      <input
        type="number"
        className="border w-full p-2 mb-3"
        placeholder="Hours spent"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
      />

      <button
        onClick={submit}
        className="bg-[#531954] text-white px-4 py-2 rounded w-full"
      >
        Submit Report
      </button>
    </div>
  );
};

export default SubmitReport;
