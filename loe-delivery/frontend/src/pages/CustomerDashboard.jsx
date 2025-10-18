import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Swal from "sweetalert2";

function CustomerDashboard() {
  const [dishes, setDishes] = useState([]);
  const [selected, setSelected] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState({ dishes: false, orders: false });
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const fetchDishes = async () => {
    setLoading((s) => ({ ...s, dishes: true }));
    try {
      const res = await fetch("http://localhost:5000/api/dishes", {
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
    fetchDishes();
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleDish = (dish) => {
    if (selected.find((d) => d.id === dish.id)) {
      setSelected(selected.filter((d) => d.id !== dish.id));
    } else {
      setSelected([...selected, dish]);
    }
  };

  const placeOrder = async () => {
    const payload = {
      dishes: selected.map((d) => ({ dishId: d.id, quantity: 1 })),
    };
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Order created" });
        setSelected([]);
        fetchOrders();
      } else {
        Swal.fire({ icon: "error", title: data.error || "Failed to create order" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 id="dishes" style={{ color: "#FF7A00", textAlign: "center" }}>Available Dishes</h2>

      {loading.dishes ? <Loader text="Loading dishes" /> : null}
      <div className="dish-list">
        {dishes.map((dish) => (
          <div key={dish.id} className="dish-card">
            <h4>{dish.name}</h4>
            <p>${dish.price}</p>
            {dish.video_url && (
              <video width="240" controls src={dish.video_url} />
            )}
            <button onClick={() => toggleDish(dish)}>
              {selected.find((d) => d.id === dish.id)
                ? "Remove"
                : "Add to Order"}
            </button>
          </div>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="form-container" style={{ maxWidth: "500px" }}>
          <h3>Selected Dishes:</h3>
          <ul>
            {selected.map((d) => (
              <li key={d.id}>
                {d.name} - ${d.price}
              </li>
            ))}
          </ul>
          <button disabled={submitting} onClick={placeOrder}>{submitting ? "Placing..." : "Place Order"}</button>
        </div>
      )}

      <h3 id="orders" style={{ marginTop: 24 }}>My Orders</h3>
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomerDashboard;
