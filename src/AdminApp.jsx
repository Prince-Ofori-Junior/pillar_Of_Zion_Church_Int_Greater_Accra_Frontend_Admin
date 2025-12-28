import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Sermons from "./pages/Sermons";
import Events from "./pages/Events";
import Prayers from "./pages/Prayers";
import Donations from "./pages/Donations";
import Login from "./pages/Login";

import "./admin.css";

/* ======================
   Protected Layout
====================== */
const AdminLayout = () => {
  return (
    <div className="admin-container">
      <Sidebar />
      <div className="main-content">
        <Topbar userName="Admin" />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

/* ======================
   Protected Route
====================== */
const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

/* ======================
   App
====================== */
const AdminApp = () => {
  const [, forceUpdate] = useState(0);

  // 👇 React re-renders after login
  useEffect(() => {
    const onStorageChange = () => forceUpdate(n => n + 1);
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="sermons" element={<Sermons />} />
            <Route path="events" element={<Events />} />
            <Route path="prayers" element={<Prayers />} />
            <Route path="donations" element={<Donations />} />
          </Route>
        </Route>

        {/* Catch all */}
        <Route
          path="*"
          element={
            localStorage.getItem("token")
              ? <Navigate to="/admin/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </Router>
  );
};

export default AdminApp;
