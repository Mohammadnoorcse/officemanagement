import { useEffect, useState } from "react";
import api from "../../api/axios";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]); // ✅ always array

  useEffect(() => {
    fetchTasks();
  }, []);

  /* ================= FETCH TASKS ================= */
  const fetchTasks = async () => {
    try {
      const res = await api.get("/my-tasks");
      console.log("TASK RESPONSE:", res.data); // 🔍 debug once

      const tasksArray =
        Array.isArray(res.data) ? res.data :
        Array.isArray(res.data.tasks) ? res.data.tasks :
        Array.isArray(res.data.data) ? res.data.data :
        [];

      setTasks(tasksArray);
    } catch (error) {
      console.error(error);
      setTasks([]);
    }
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (id) => {
    try {
      await api.post(`/my-task/${id}/status`, { status: "completed" });

      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: "completed" } : t
        )
      );
    } catch {
      alert("Failed to update task status");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="font-semibold mb-4">My Tasks</h2>

      {tasks.length === 0 && (
        <p className="text-gray-400">No tasks found</p>
      )}

      {tasks.map((task) => (
        <div key={task.id} className="border p-3 mb-3 rounded">
          <h3 className="font-medium">{task.title}</h3>
          <p className="text-sm text-gray-500">{task.description}</p>

          <div className="flex justify-between mt-2">
            <span
              className={`text-xs px-2 py-1 rounded ${
                task.status === "completed"
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {task.status}
            </span>

            {task.status === "pending" && (
              <button
                onClick={() => updateStatus(task.id)}
                className="text-sm text-blue-600"
              >
                Mark Complete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyTasks;
