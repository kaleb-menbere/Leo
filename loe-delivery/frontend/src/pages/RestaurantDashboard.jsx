import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Swal from "sweetalert2";

function RestaurantDashboard() {
  const [dishes, setDishes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", category: "", video_url: "" });
  const [loading, setLoading] = useState({ dishes: false, orders: false });
  const [submitting, setSubmitting] = useState({ dish: false, status: false });

  const token = localStorage.getItem("token");

  const fetchMyDishes = async () => {
    setLoading((s) => ({ ...s, dishes: true }));
    try {
      const res = await fetch("http://localhost:5000/api/dishes/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setDishes(await res.json());
    } finally {
      setLoading((s) => ({ ...s, dishes: false }));
    }
  };

  const fetchOrders = async () => {
    setLoading((s) => ({ ...s, orders: true }));
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setOrders(await res.json());
    } finally {
      setLoading((s) => ({ ...s, orders: false }));
    }
  };

  useEffect(() => {
    fetchMyDishes();
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addDish = async (e) => {
    e.preventDefault();
    setSubmitting((s) => ({ ...s, dish: true }));
    try {
      const res = await fetch("http://localhost:5000/api/dishes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          price: parseFloat(form.price),
          category: form.category,
          video_url: form.video_url,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setForm({ name: "", price: "", category: "", video_url: "" });
        fetchMyDishes();
        Swal.fire({ icon: "success", title: "Dish created" });
      } else {
        Swal.fire({ icon: "error", title: data.error || "Failed to create dish" });
      }
    } finally {
      setSubmitting((s) => ({ ...s, dish: false }));
    }
  };

  const updateOrderStatus = async (id, status) => {
    setSubmitting((s) => ({ ...s, status: true }));
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchOrders();
        Swal.fire({ icon: "success", title: `Order ${status}` });
      } else {
        Swal.fire({ icon: "error", title: data.error || "Failed to update status" });
      }
    } finally {
      setSubmitting((s) => ({ ...s, status: false }));
    }
  };

  return (
    <div>
      <h2 style={{ color: "#FF7A00", textAlign: "center" }}>Restaurant Dashboard</h2>

      <div id="add-dish" className="form-container">
        <h3>Add New Dish</h3>
        <form onSubmit={addDish}>
          <input
            type="text"
            placeholder="Dish name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Video URL"
            value={form.video_url}
            onChange={(e) => setForm({ ...form, video_url: e.target.value })}
          />
          <button type="submit" disabled={submitting.dish}>
            {submitting.dish ? "Adding..." : "Add Dish"}
          </button>
        </form>
      </div>

      <h3 id="dishes">My Dishes</h3>
      {loading.dishes ? <Loader text="Loading dishes" /> : null}
      <div className="dish-list">
        {dishes.map((dish) => (
          <div key={dish.id} className="dish-card">
            <h4>{dish.name}</h4>
            <p>${dish.price}</p>
            {dish.video_url && (
              <video width="240" controls src={dish.video_url} />
            )}
          </div>
        ))}
      </div>

      <h3 id="orders">Incoming Orders</h3>
      {loading.orders ? <Loader text="Loading orders" /> : null}
      <div className="dish-list">
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
            <div>
              <button disabled={submitting.status} onClick={() => updateOrderStatus(order.id, "accepted")}>Accept</button>
              <button disabled={submitting.status} onClick={() => updateOrderStatus(order.id, "delivered")}>Mark Delivered</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RestaurantDashboard;
