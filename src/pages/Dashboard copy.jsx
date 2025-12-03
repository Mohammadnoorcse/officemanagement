import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"

const data = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "admin" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "user" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "user" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-full flex-col gap-4 ">
        <div className="flex justify-between items-center bg-[#531954] px-8 py-2">
            <div>
                <img src={logo} alt=""  className="w-32"/>
            </div>
          <div className="flex gap-4">
             <div className="flex gap-4 items-center">
                <button className="bg-red-600 px-4 py-2 rounded cursor-pointer text-white" onClick={handleLogout}>Logout</button>

            </div>

             <div className="relative group w-[2rem] h-[2rem] bg-white rounded-full">
            {/* Avatar */}
            <img
                src="https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png"
                alt="Profile"
                className="w-full h-full rounded-full cursor-pointer"
            />

                {/* Dropdown */}
                <div className="absolute top-8 right-0 w-40 bg-white shadow-lg rounded hidden group-hover:block z-10">
                    <ul className="flex flex-col p-2 text-gray-700">
                    <li className="py-2 px-3 hover:bg-gray-100 cursor-pointer">Profile</li>
                    <li className="py-2 px-3 hover:bg-gray-100 cursor-pointer">Settings</li>
                    {/* <li className="py-2 px-3 hover:bg-gray-100 cursor-pointer">Logout</li> */}
                    </ul>
                </div>
            </div>

          </div>

        </div>

        <div className="mt-4 w-full flex justify-between items-center px-8">
            <div className="flex ">
                <form action="" className="flex border border-gray-200 rounded">
                    <input type="text" placeholder="searching name ..." className="w-[10rem] pl-2 py-2 outline-none border-none text-base"/>
                    <button type="submit" className="w-[5rem] py-2 bg-[#531954] text-white rounded-r cursor-pointer ">Submit</button>

                </form>

            </div>

           

        </div>

       <div className="overflow-x-auto mt-4 px-8">
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
            {data.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{user.id}</td>
                <td className="py-2 px-4 border-b">{user.name}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
                <td className="py-2 px-4 border-b flex gap-2">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Edit</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
   

      
    </div>
  );
}
