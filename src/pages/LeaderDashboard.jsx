import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"
import axios from "axios";
import LeaderSidebar from "../component/leader/LeaderSidebar";
import UserContent from "../component/user/UserContent";
import Attendance from "../component/admin/Attendance";
import UserLeaves from "../component/user/UserLeaves";
import AssignTasks from "../component/leader/AssignTasks";
import ChatLayout from "../component/chat/ChatLayout";
import LeaderGroups from "../component/leader/LeaderGroups";
import TeamReports from "../component/leader/TeamReports";
import DashboardContent from "../component/admin/DashboardContent";
import LeaderContent from "../component/leader/LeaderContent";

const LeaderDashboard = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/logout`,
        {}, // no body needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Remove token locally
      localStorage.removeItem("token");

      // Navigate to login page
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      // Still remove token and navigate to login if needed
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

const renderContent = () => {
  switch (active) {
    case "dashboard":
      return <LeaderContent/>;
    case "groups":
      return <LeaderGroups />;
    case "teamTasks":
      return <AssignTasks />;
    case "chat":
      return <ChatLayout />;
    case "reports":
      return <TeamReports />;
    case "attendance":
      return <Attendance />;
    case "leave":
      return <UserLeaves />;
    default:
      return null;
  }
};
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <div className="flex justify-between items-center bg-[#531954] px-4 py-2 md:px-8">
        <div className="flex items-center gap-4">
          {/* Hamburger menu for small screens */}
          <button
            className="md:hidden text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            &#9776;
          </button>

          <img src={logo} alt="Logo" className="w-32" />
        </div>

        {/* Avatar */}
        <div className="relative group w-8 h-8 bg-white rounded-full">
          <img
            src="https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png"
            alt="Profile"
            className="w-full h-full rounded-full cursor-pointer"
          />
          <div className="absolute top-10 right-0 w-40 bg-white shadow-lg rounded hidden group-hover:block z-10">
            <ul className="flex flex-col p-2 text-gray-700">
              <li className="py-2 px-3 hover:bg-gray-100 cursor-pointer">
                Profile
              </li>
              <li className="py-2 px-3 hover:bg-gray-100 cursor-pointer">
                Settings
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <LeaderSidebar
          active={active}
          setActive={setActive}
          handleLogout={handleLogout}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main content */}
        <div className="flex-1 p-4 md:p-8 bg-gray-100">{renderContent()}</div>
      </div>
    </div>
  );
};

export default LeaderDashboard;
