import React from "react";

export default function Sidebar({ active, setActive, handleLogout, sidebarOpen, setSidebarOpen }) {
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
          fixed top-0 left-0 z-30
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <button
          className={`py-2 px-4 mb-2 text-left rounded ${
            active === "dashboard" ? "bg-[#531954] text-white" : ""
          }`}
          onClick={() => {
            setActive("dashboard");
            setSidebarOpen(false);
          }}
        >
          Dashboard
        </button>

        <button
          className={`py-2 px-4 mb-2 text-left rounded ${
            active === "user" ? "bg-[#531954] text-white" : ""
          }`}
          onClick={() => {
            setActive("user");
            setSidebarOpen(false);
          }}
        >
          Employee
        </button>

        <button
          className={`py-2 px-4 mb-2 text-left rounded ${
            active === "attendace" ? "bg-[#531954] text-white" : ""
          }`}
          onClick={() => {
            setActive("attendace");
            setSidebarOpen(false);
          }}
        >
          Attendace
        </button>

        <button
          className={`py-2 px-4 mb-2 text-left rounded ${
            active === "salary" ? "bg-[#531954] text-white" : ""
          }`}
          onClick={() => {
            setActive("salary");
            setSidebarOpen(false);
          }}
        >
          Salary
        </button>

        {/* Logout button (shows only when sidebar is open on mobile, always visible on desktop) */}
        <button
          className={`mt-auto py-2 px-4 bg-red-600 text-white rounded cursor-pointer
            ${sidebarOpen ? "block" : "hidden md:block"}`}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </>
  );
}
