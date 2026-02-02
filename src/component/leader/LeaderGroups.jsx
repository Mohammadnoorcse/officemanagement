import { useEffect, useState } from "react";
import api from "../../api/axios";

const LeaderGroups = () => {
  const [groups, setGroups] = useState([]);     // ✅ Always array
  const [users, setUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchGroups();
    fetchUsers();
  }, []);

  /* ================= CURRENT USER ================= */
  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("/user");
      setCurrentUser(res.data);
    } catch {
      alert("Failed to fetch current user");
    }
  };

  /* ================= GROUPS ================= */
  const fetchGroups = async () => {
    try {
      const res = await api.get("/group/my-groups");
      console.log("GROUP RESPONSE:", res.data); // 🔍 debug once

      const groupsArray =
        Array.isArray(res.data) ? res.data :
        Array.isArray(res.data.groups) ? res.data.groups :
        Array.isArray(res.data.data) ? res.data.data :
        [];

      setGroups(groupsArray);
    } catch {
      alert("Failed to fetch groups");
      setGroups([]);
    }
  };

  /* ================= USERS ================= */
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch {
      alert("Failed to fetch users");
    }
  };

  /* ================= CREATE GROUP ================= */
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

  /* ================= ADD MEMBER ================= */
  const addMember = async () => {
    if (!selectedGroup || !selectedUser)
      return alert("Select group & user");

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

  /* ================= REMOVE MEMBER ================= */
  const removeMember = async (userId) => {
    if (!selectedGroup) return;

    if (!window.confirm("Remove this member?")) return;

    try {
      await api.post(`/group/${selectedGroup.id}/remove-member`, {
        user_id: userId,
      });
      fetchGroups();
      alert("Member removed");
    } catch {
      alert("Failed to remove member");
    }
  };

  /* ================= DELETE GROUP ================= */
  const deleteGroup = async (groupId) => {
    if (!window.confirm("Delete this group?")) return;

    try {
      await api.delete(`/group/${groupId}`);
      fetchGroups();
      if (selectedGroup?.id === groupId) setSelectedGroup(null);
      alert("Group deleted");
    } catch {
      alert("Failed to delete group");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">

      {/* ================= CREATE GROUP ================= */}
      <div className="bg-purple-600 text-white rounded-xl p-6 shadow">
        <h2 className="text-xl font-bold mb-4">Create Group</h2>
        <input
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group Name"
          className="w-full p-3 mb-4 rounded text-black"
        />
        <button
          onClick={createGroup}
          disabled={loading}
          className="bg-white text-purple-600 px-4 py-2 rounded font-semibold"
        >
          {loading ? "Creating..." : "Create Group"}
        </button>
      </div>

      {/* ================= GROUP LIST ================= */}
      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="font-semibold mb-4">My Groups</h2>

        {groups.length === 0 && (
          <p className="text-gray-400">No groups found</p>
        )}

        {groups.map((group) => (
          <div
            key={group.id}
            onClick={() => setSelectedGroup(group)}
            className={`p-3 mb-2 border rounded cursor-pointer flex justify-between
              ${selectedGroup?.id === group.id
                ? "bg-purple-50 border-purple-500"
                : "hover:bg-gray-50"}`}
          >
            <div>
              <p className="font-medium">{group.name}</p>
              <p className="text-xs text-gray-500">
                Members: {group.members?.length || 0}
              </p>
            </div>

            {currentUser?.id === group.created_by && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteGroup(group.id);
                }}
                className="bg-red-500 text-white px-2 py-1 rounded text-sm"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ================= GROUP DETAILS ================= */}
      {selectedGroup && currentUser && (
        <div className="bg-white rounded-xl p-6 shadow md:col-span-2">
          <h2 className="font-semibold mb-4">
            Manage: <span className="text-purple-600">{selectedGroup.name}</span>
          </h2>

          {/* Add Member */}
          <div className="flex gap-3 mb-4">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="border p-2 rounded flex-1"
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
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>

          {/* Members */}
          <ul className="divide-y">
            {selectedGroup.members?.map((member) => (
              <li key={member.id} className="py-2 flex justify-between">
                <span>{member.name} ({member.email})</span>

                {selectedGroup.created_by === currentUser.id && (
                  <button
                    onClick={() => removeMember(member.id)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LeaderGroups;
