import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";

function AdminPanel() {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState({ users: false, dishes: false, orders: false });
  const [qUsers, setQUsers] = useState("");
  const [qDishes, setQDishes] = useState("");
  const [qOrders, setQOrders] = useState("");

  const fetchUsers = async () => {
    setLoading((s) => ({ ...s, users: true }));
    try {
      const res = await fetch("http://localhost:5000/api/users", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setUsers(await res.json());
    } finally {
      setLoading((s) => ({ ...s, users: false }));
    }
  };

  const fetchDishes = async () => {
    setLoading((s) => ({ ...s, dishes: true }));
    try {
      const res = await fetch("http://localhost:5000/api/dishes", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setDishes(await res.json());
    } finally {
      setLoading((s) => ({ ...s, dishes: false }));
    }
  };

  const fetchOrders = async () => {
    setLoading((s) => ({ ...s, orders: true }));
    try {
      const res = await fetch("http://localhost:5000/api/orders", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setOrders(await res.json());
    } finally {
      setLoading((s) => ({ ...s, orders: false }));
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDishes();
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUsers = users.filter((u) =>
    [u.name, u.email, u.role].join(" ").toLowerCase().includes(qUsers.toLowerCase())
  );
  const filteredDishes = dishes.filter((d) =>
    [d.name, d.category, d.restaurant?.name].join(" ").toLowerCase().includes(qDishes.toLowerCase())
  );
  const filteredOrders = orders.filter((o) =>
    [String(o.id), o.status, (o.customer?.name || "")]
      .join(" ")
      .toLowerCase()
      .includes(qOrders.toLowerCase())
  );

  return (
    <div>
      <h2 style={{ color: "#FF7A00", textAlign: "center", marginBottom: 16 }}>Admin Panel</h2>

      {/* Users */}
      <section className="section">
        <div className="table-header">
          <h3>Users</h3>
          <input className="input" placeholder="Search users" value={qUsers} onChange={(e) => setQUsers(e.target.value)} />
        </div>
        {loading.users ? (
          <Loader text="Loading users" />
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className="badge">{u.role}</span></td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Dishes */}
      <section className="section">
        <div className="table-header">
          <h3>Dishes</h3>
          <input className="input" placeholder="Search dishes" value={qDishes} onChange={(e) => setQDishes(e.target.value)} />
        </div>
        {loading.dishes ? (
          <Loader text="Loading dishes" />
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Restaurant</th>
                </tr>
              </thead>
              <tbody>
                {filteredDishes.map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.name}</td>
                    <td>{d.category}</td>
                    <td>${d.price}</td>
                    <td>{d.restaurant?.name || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Orders */}
      <section className="section">
        <div className="table-header">
          <h3>Orders</h3>
          <input className="input" placeholder="Search orders" value={qOrders} onChange={(e) => setQOrders(e.target.value)} />
        </div>
        {loading.orders ? (
          <Loader text="Loading orders" />
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td><span className={`pill small ${o.status}`}>{o.status}</span></td>
                    <td>${o.total}</td>
                    <td>{o.customer?.name || "-"}</td>
                    <td>{o.dishes?.map((od) => od.dish?.name).join(", ")}</td>
                    <td>{new Date(o.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminPanel;
