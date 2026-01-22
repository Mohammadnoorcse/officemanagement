import { useEffect, useState } from "react";
import api from "../../api/axios";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get("/my-tasks").then(res => setTasks(res.data));
  }, []);

  const updateStatus = async (id) => {
    await api.post(`/my-task/${id}/status`, { status: "completed" });
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, status: "completed" } : t
    ));
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="font-semibold mb-4">My Tasks</h2>

      {tasks.map(task => (
        <div key={task.id} className="border p-3 mb-3 rounded">
          <h3 className="font-medium">{task.title}</h3>
          <p className="text-sm text-gray-500">{task.description}</p>

          <div className="flex justify-between mt-2">
            <span className={`text-xs px-2 py-1 rounded ${
              task.status === "completed"
                ? "bg-green-100 text-green-600"
                : "bg-yellow-100 text-yellow-600"
            }`}>
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
