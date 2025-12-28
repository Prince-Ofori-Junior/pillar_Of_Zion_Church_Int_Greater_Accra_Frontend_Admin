import React from "react";
import { NavLink } from "react-router-dom";
import '../sidebar.css';

const Sidebar = () => {
  const links = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Users", path: "/admin/users" },
    { name: "Sermons", path: "/admin/sermons" },
    { name: "Events", path: "/admin/events" },
    { name: "Prayers", path: "/admin/prayers" },
    { name: "Donations", path: "/admin/donations" },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">Admin Panel</div>
      <nav>
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
