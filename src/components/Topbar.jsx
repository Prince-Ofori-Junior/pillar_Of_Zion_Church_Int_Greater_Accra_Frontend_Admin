import React from "react";
import { useNavigate } from "react-router-dom";
import '../topbar.css';

const Topbar = ({ userName = "Admin" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login"); // redirect to login page
  };

  return (
    <header className="topbar">
      <h1>Admin Dashboard</h1>
      <div className="user-info">
        <span>{userName}</span>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
