import React, { useEffect, useState } from "react";

function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalOrders: 0, mostOrderedDish: null, totalRevenue: 0 });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAnalytics = async () => {
      const res = await fetch("http://localhost:5000/api/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setStats(await res.json());
    };
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h2 style={{ color: "#FF7A00", textAlign: "center" }}>Admin Analytics</h2>
      <div className="form-container" style={{ maxWidth: 600 }}>
        <div className="dish-card">
          <h4>Total Users</h4>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="dish-card">
          <h4>Total Orders</h4>
          <p>{stats.totalOrders}</p>
        </div>
        <div className="dish-card">
          <h4>Most Ordered Dish</h4>
          <p>{stats.mostOrderedDish || "N/A"}</p>
        </div>
        <div className="dish-card">
          <h4>Total Revenue</h4>
          <p>${stats.totalRevenue}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
