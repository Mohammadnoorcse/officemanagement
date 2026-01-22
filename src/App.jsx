import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import Dashboard from "./pages/Dashboard";
import RegisterUser from "./pages/RegisterUser.jsx";
import LiveTrackerPage from "./pages/LiveTrackerPage.jsx";
import AutoLocationUpdater from "./pages/AutoLocationUpdater.jsx";
import { AdminRoute, UserRoute,TeamLeaderRoute } from "./routes/ProtectedRoutes.jsx";
import LeaderDashboard from "./pages/LeaderDashboard.jsx";


function App() {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  let defaultRoute = "/login";
  if (token) {
    defaultRoute =
      role === "admin"
        ? "/admin/dashboard"
        : role === "teamleader"
        ? "/teamleader/dashboard"
        : "/dashboard"; // user
  }

  return (
    <BrowserRouter>
      {/* Run AutoLocationUpdater for logged-in users */}
      {token && <AutoLocationUpdater />}

      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/register"
          element={
            <AdminRoute>
              <RegisterUser />
            </AdminRoute>
          }
        />

        {/* User routes */}
        <Route
          path="/dashboard"
          element={
            <UserRoute>
              <UserDashboard />
            </UserRoute>
          }
        />

          {/* Team Leader routes */}
        <Route
          path="/teamleader/dashboard"
          element={
            <TeamLeaderRoute>
              <LeaderDashboard />
            </TeamLeaderRoute>
          }
        />

        {/* Live tracking */}
        <Route path="/location/:id" element={<LiveTrackerPage />} />
        

        {/* Redirect unknown paths */}
        <Route path="*" element={<Navigate to={defaultRoute} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
