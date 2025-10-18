import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Swal from "sweetalert2";

function RestaurantOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
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

  const updateOrderStatus = async (id, status) => {
    setUpdating(true);
    setUpdatingOrderId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({ icon: "success", title: `Order ${status}` });
        fetchOrders();
      } else {
        Swal.fire({ icon: "error", title: data.error || "Failed to update status" });
      }
    } finally {
      setUpdating(false);
      setUpdatingOrderId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
    const id = setInterval(fetchOrders, 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h2 style={{ color: "#FF7A00", textAlign: "center" }}>Incoming Orders</h2>
      {loading ? <Loader text="Loading orders" /> : null}
      <div className="dish-list" style={{ marginTop: 12 }}>
        {orders.map((order) => {
          const canAccept = order.status === "pending";
          const canDeliver = order.status === "accepted";
          const isUpdating = updating && updatingOrderId === order.id;
          return (
          <div key={order.id} className="dish-card">
            <h4>Order #{order.id}</h4>
            <div className="status">
              <span className={`pill ${order.status === "pending" ? "active" : "done"}`}>Pending</span>
              <span className={`pill ${order.status === "accepted" ? "active" : order.status === "delivered" ? "done" : ""}`}>Accepted</span>
              <span className={`pill ${order.status === "delivered" ? "active" : ""}`}>Delivered</span>
            </div>
            <p>Total: ${order.total}</p>
            <ul>
              {order.dishes?.map((od) => (
                <li key={od.id}>{od.dish?.name}</li>
              ))}
            </ul>
            <div>
              {canAccept && (
                <button disabled={isUpdating} onClick={() => updateOrderStatus(order.id, "accepted")}>{isUpdating ? "Accepting..." : "Accept"}</button>
              )}
              {canDeliver && (
                <button disabled={isUpdating} onClick={() => updateOrderStatus(order.id, "delivered")}>{isUpdating ? "Delivering..." : "Mark Delivered"}</button>
              )}
              {order.status === "delivered" && (
                <span className="muted">Completed</span>
              )}
            </div>
          </div>
        );})}
      </div>
    </div>
  );
}

export default RestaurantOrders;
