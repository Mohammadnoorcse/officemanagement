import React from "react";

export default function LeaderSidebar({ active, setActive, handleLogout, sidebarOpen, setSidebarOpen }) {

    const leaderMenus = [
  { key: "dashboard", label: "Dashboard" },
  { key: "groups", label: "Groups" },        // create + add members
  { key: "teamTasks", label: "Assign Tasks" },
  { key: "chat", label: "Team Chat" },
  { key: "reports", label: "Team Reports" },
  { key: "attendance", label: "Attendance" },
  { key: "leave", label: "Leave" },
];
  return (
    <>
      {/* Overlay for small screens */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`
            w-64 h-screen bg-white flex flex-col p-4
          md:relative md:translate-x-0
          fixed top-0 left-0  z-30
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
       

    {leaderMenus.map(item => (
  <button
    key={item.key}
    className={`py-2 px-4 mb-2 rounded text-left ${
      active === item.key ? "bg-[#531954] text-white" : ""
    }`}
    onClick={() => {
      setActive(item.key);
      setSidebarOpen(false);
    }}
  >
    {item.label}
  </button>
))}

        <button
          className="mt-auto py-2 px-4 bg-red-600 rounded cursor-pointer text-white"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </>
  );
}
