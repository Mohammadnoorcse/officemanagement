import { useEffect, useState } from "react";
import api from "../../api/axios";

const GroupList = ({ setGroup }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await api.get("/group/my-groups");
      setGroups(res.data);
    } catch (err) {
      console.error("Failed to fetch groups", err);
    }
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h2 className="font-semibold mb-4">My Groups</h2>
      <div className="space-y-2">
        {groups.map((g) => (
          <div
            key={g.id}
            onClick={() => {
              setGroup(g);
              setSelectedGroupId(g.id);
            }}
            className={`p-2 rounded cursor-pointer transition ${
              selectedGroupId === g.id
                ? "bg-purple-100 font-semibold"
                : "hover:bg-gray-50"
            }`}
          >
            {g.name} ({g.members?.length || 0})
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupList;
