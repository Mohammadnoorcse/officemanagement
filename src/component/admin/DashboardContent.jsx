import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DashboardContent = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  const rowsPerPage = 5;

  // Fetch Users
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter data
  const filteredData = users.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.role.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle Role Update
  const updateRole = async () => {
    const token = localStorage.getItem("token");

    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/users/${selectedUser.id}/role`,
      { role: newRole },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setShowModal(false);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
        const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/users/${id}`,
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );

        alert(response.data.message);

        // Refresh list
        setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
        alert(error.response?.data?.message || "Delete failed");
    }
};


  return (
    <div className="flex flex-col gap-4">
      {/* Search + Add User */}
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Search by name, email or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none"
        />
        <Link
          to="/admin/register"
          className="px-4 py-1 rounded-md bg-[#531954] text-white"
        >
          Register
        </Link>
      </div>

      {/* Table (Desktop) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-2 px-4 border-b">ID</th>
              <th className="text-left py-2 px-4 border-b">Name</th>
              <th className="text-left py-2 px-4 border-b">Email</th>
              <th className="text-left py-2 px-4 border-b">Role</th>
              <th className="text-left py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{user.id}</td>
                <td className="py-2 px-4 border-b">{user.name}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
                <td className="py-2 px-4 border-b flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    onClick={() => {
                      setSelectedUser(user);
                      setNewRole(user.role);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>

                  <button  onClick={() => handleDelete(user.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                    Delete
                  </button>
                  <a href={`/location/${user.id}`}>
                    location
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {paginatedData.map((user) => (
          <div
            key={user.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <p>
              <span className="font-bold">ID:</span> {user.id}
            </p>
            <p>
              <span className="font-bold">Name:</span> {user.name}
            </p>
            <p>
              <span className="font-bold">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-bold">Role:</span> {user.role}
            </p>
            <div className="flex gap-2 mt-2 relative">
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() => {
                  setSelectedUser(user);
                  setNewRole(user.role);
                  setShowModal(true);
                }}
              >
                Edit
              </button>
              <button  onClick={() => handleDelete(user.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                Delete
              </button>

              <Link to={`/location/${user.id}`}>
                location
              </Link>

             

            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex gap-2 justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-purple-600 text-white" : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow w-[20%] h-[10rem] flex flex-col justify-center items-center">
            {/* Role Selector Only */}
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="border p-1 rounded w-full"
            >
              <option value="admin">admin</option>
              <option value="user">user</option>
            </select>

            {/* Buttons */}
            <div className="w-full flex  gap-1 mt-2">
              <button
                className="w-1/2 bg-green-600 text-white px-2 py-1 rounded"
                onClick={updateRole}
              >
                Save
              </button>

              <button
                className="w-1/2 bg-gray-400 text-white px-2 py-1 rounded"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardContent;
