import React, { useState, useEffect } from "react";
import Cards from "../components/Cards";
import adminApi from "../api/adminApi";
import '../dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    adminApi.getDashboardStats()
      .then((res) => {
        const cardsData = [
          { title: "Users", value: res.data.users, icon: "👤" },
          { title: "Sermons", value: res.data.sermons, icon: "🎤" },
          { title: "Events", value: res.data.events, icon: "📅" },
          { title: "Donations", value: `$${res.data.donations}`, icon: "💰" },
        ];
        setStats(cardsData);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <Cards cards={stats} />
    </div>
  );
};

export default Dashboard;
