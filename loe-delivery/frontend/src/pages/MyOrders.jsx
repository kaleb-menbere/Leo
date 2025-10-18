import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setOrders(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h2 style={{ color: "#FF7A00", textAlign: "center" }}>My Orders</h2>
      {loading ? <Loader text="Loading orders" /> : null}
      <div className="dish-list" style={{ marginTop: 12 }}>
        {orders.map((order) => (
          <div key={order.id} className="dish-card">
            <h4>Order #{order.id}</h4>
            <p>Status: {order.status}</p>
            <p>Total: ${order.total}</p>
            <ul>
              {order.dishes?.map((od) => (
                <li key={od.id}>{od.dish?.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrders;
