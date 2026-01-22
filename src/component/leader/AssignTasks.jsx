import { useEffect, useState } from "react";
import api from "../../api/axios";

const AssignTasks = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    assigned_to: "",
    due_date: "",
  });

  useEffect(() => {
    api.get("/users").then(res => setUsers(res.data));
  }, []);

  const submit = async () => {
    await api.post("/team-task/assign", form);
    alert("Task assigned");
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="font-semibold mb-4">Assign Task</h2>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Task Title"
        onChange={e => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        className="border p-2 w-full mb-3"
        placeholder="Description"
        onChange={e => setForm({ ...form, description: e.target.value })}
      />

      <select
        className="border p-2 w-full mb-3"
        onChange={e => setForm({ ...form, assigned_to: e.target.value })}
      >
        <option>Select Member</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>

      <input
        type="date"
        className="border p-2 w-full mb-3"
        onChange={e => setForm({ ...form, due_date: e.target.value })}
      />

      <button
        onClick={submit}
        className="bg-[#531954] text-white px-4 py-2 rounded"
      >
        Assign
      </button>
    </div>
  );
};

export default AssignTasks;
