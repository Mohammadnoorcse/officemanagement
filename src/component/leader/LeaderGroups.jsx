import { useEffect, useState } from "react";
import api from "../../api/axios";

const LeaderGroups = () => {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Load groups, users & current user
  useEffect(() => {
    fetchCurrentUser();
    fetchGroups();
    fetchUsers();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("/user");
      setCurrentUser(res.data);
    } catch {
      alert("Failed to fetch current user");
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await api.get("/group/my-groups");
      setGroups(res.data);
    } catch {
      alert("Failed to fetch groups");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch {
      alert("Failed to fetch users");
    }
  };

  // Create Group
  const createGroup = async () => {
    if (!groupName.trim()) return alert("Group name required");

    setLoading(true);
    try {
      await api.post("/group/create", { name: groupName });
      setGroupName("");
      fetchGroups();
      alert("Group created successfully");
    } catch {
      alert("Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  // Add member to group
  const addMember = async () => {
    if (!selectedGroup || !selectedUser) return alert("Select group & user");

    try {
      await api.post(`/group/${selectedGroup.id}/add-member`, {
        user_id: selectedUser,
      });
      setSelectedUser("");
      fetchGroups();
      alert("Member added successfully");
    } catch {
      alert("Failed to add member");
    }
  };

  // Remove member
  const removeMember = async (userId) => {
    if (!selectedGroup) return;
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    try {
      await api.post(`/group/${selectedGroup.id}/remove-member`, { user_id: userId });
      fetchGroups();
      alert("Member removed successfully");
    } catch {
      alert("Failed to remove member");
    }
  };

  // Delete group
  const deleteGroup = async (groupId) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;

    try {
      await api.delete(`/group/${groupId}`);
      fetchGroups();
      if (selectedGroup?.id === groupId) setSelectedGroup(null);
      alert("Group deleted successfully");
    } catch {
      alert("Failed to delete group");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* Create Group */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-xl shadow-lg p-6 flex flex-col justify-between">
        <h2 className="text-xl font-bold mb-4">Create Group</h2>
        <input
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group Name"
          className="p-3 rounded text-black w-full mb-4 shadow-inner"
        />
        <button
          onClick={createGroup}
          disabled={loading}
          className="bg-white text-purple-600 font-semibold px-4 py-2 rounded shadow hover:bg-gray-100 transition"
        >
          {loading ? "Creating..." : "Create Group"}
        </button>
      </div>

      {/* Groups List */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-1">
        <h2 className="text-lg font-semibold mb-4">My Groups</h2>
        {groups.length === 0 && <p className="text-gray-400">No groups found</p>}
        <div className="space-y-3">
          {groups.map((group) => (
            <div
              key={group.id}
              onClick={() => setSelectedGroup(group)}
              className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center transition ${
                selectedGroup?.id === group.id
                  ? "bg-purple-50 border-purple-500"
                  : "hover:bg-gray-50"
              }`}
            >
              <div>
                <p className="font-medium">{group.name}</p>
                <p className="text-xs text-gray-500">
                  Members: {group.members?.length || 0}
                </p>
              </div>
              {/* Delete button only for group leader */}
              {currentUser?.id === group.created_by && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteGroup(group.id);
                  }}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Group & Members */}
      {selectedGroup && currentUser && (
        <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2 flex flex-col gap-6">
          <h2 className="text-lg font-semibold">
            Manage: <span className="text-purple-600">{selectedGroup.name}</span>
          </h2>

          {/* Add Member */}
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="border p-2 rounded flex-1 shadow-inner"
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            <button
              onClick={addMember}
              className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 transition"
            >
              Add Member
            </button>
          </div>

          {/* Members List */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
            <h3 className="font-semibold mb-2 text-gray-700">Members</h3>
            <ul className="divide-y divide-gray-200">
              {selectedGroup.members?.map((member) => (
                <li
                  key={member.id}
                  className="flex justify-between items-center py-2"
                >
                  <span>{member.name} ({member.email})</span>
                  {/* Remove button only for group leader */}
                  {selectedGroup.created_by === currentUser.id && (
                    <button
                      onClick={() => removeMember(member.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition text-sm"
                    >
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderGroups;
