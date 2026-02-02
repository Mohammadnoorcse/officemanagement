import { useEffect, useState } from "react";
import api from "../../api/axios";

const AssignTasks = () => {
  const [groups, setGroups] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    group_id: "",
    assigned_to: "",
    due_date: "",
  });

  // Fetch all groups on mount
  useEffect(() => {
    api.get("/group/members")
      .then(res => setGroups(res.data))
      .catch(err => console.error(err));
  }, []);

  // Handle form submission
  const submit = async () => {
    if (!form.group_id || !form.assigned_to) {
      alert("Please select a group and a member");
      return;
    }

    try {
      await api.post("/team-task/assign", form);
      alert("Task assigned successfully!");
      setForm({
        title: "",
        description: "",
        group_id: "",
        assigned_to: "",
        due_date: "",
      });
      setSelectedGroupId("");
      setMembers([]);
    } catch (err) {
      console.error(err);
      alert("Failed to assign task");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-md mx-auto mt-10">
      <h2 className="font-semibold text-2xl mb-6">Assign Task</h2>

      {/* Task Title */}
      <input
        className="border p-2 w-full mb-3 rounded"
        placeholder="Task Title"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
      />

      {/* Task Description */}
      <textarea
        className="border p-2 w-full mb-3 rounded"
        placeholder="Description"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
      />

      {/* Select Group */}
      <select
        className="border p-2 w-full mb-3 rounded"
        value={selectedGroupId}
        onChange={e => {
          const groupId = e.target.value;
          setSelectedGroupId(groupId);
          setForm({ ...form, group_id: groupId, assigned_to: "" });

          const group = groups.find(g => g.id == groupId);
          if (group) {
            // Only teamleaders
            const teamLeaders = group.members.filter(m => m.role === "user");
            setMembers(teamLeaders);
          } else {
            setMembers([]);
          }
        }}
      >
        <option value="">Select Group</option>
        {groups.map(g => (
          <option key={g.id} value={g.id}>{g.name}</option>
        ))}
      </select>

      {/* Select Member */}
      <select
        className="border p-2 w-full mb-3 rounded"
        value={form.assigned_to}
        onChange={e => setForm({ ...form, assigned_to: e.target.value })}
      >
        <option value="">Select Member</option>
        {members.map(u => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>

      {/* Due Date */}
      <input
        type="date"
        className="border p-2 w-full mb-3 rounded"
        value={form.due_date}
        onChange={e => setForm({ ...form, due_date: e.target.value })}
      />

      {/* Submit Button */}
      <button
        onClick={submit}
        className="bg-[#531954] text-white px-4 py-2 rounded w-full hover:bg-[#3e1254] transition"
      >
        Assign Task
      </button>
    </div>
  );
};

export default AssignTasks;
