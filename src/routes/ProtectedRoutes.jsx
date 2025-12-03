import React from "react";
import { Navigate } from "react-router-dom";

export function AdminRoute({ children }) {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  console.log(role,token);

//   If not logged in or not admin, redirect to login
  if (!token || role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  // If admin, allow access
  return children;
}


export function UserRoute({ children }) {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  console.log(role,token);

  if (!token || role !== "user") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
