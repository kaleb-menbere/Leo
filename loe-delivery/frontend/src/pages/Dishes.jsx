import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Swal from "sweetalert2";

function Dishes() {
  const [dishes, setDishes] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [quantities, setQuantities] = useState({}); // { [dishId]: number }
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("relevance");
  const token = localStorage.getItem("token");

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/dishes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setDishes(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleDish = (dish) => {
    if (selected.find((d) => d.id === dish.id)) {
      setSelected(selected.filter((d) => d.id !== dish.id));
      setQuantities((q) => {
        const { [dish.id]: _, ...rest } = q;
        return rest;
      });
    } else {
      setSelected([...selected, dish]);
      setQuantities((q) => ({ ...q, [dish.id]: 1 }));
    }
  };

  const setQty = (dishId, val) => {
    const num = Math.max(1, Number(val) || 1);
    setQuantities((q) => ({ ...q, [dishId]: num }));
  };

  const placeOrder = async () => {
    const payload = { dishes: selected.map((d) => ({ dishId: d.id, quantity: quantities[d.id] || 1 })) };
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Order created" });
        setSelected([]);
      } else {
        Swal.fire({ icon: "error", title: data.error || "Failed to create order" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 style={{ color: "#FF7A00", textAlign: "center" }}>Browse Dishes</h2>
      {/* Filters */}
      <div className="filters-bar">
        <input
          className="input"
          placeholder="Search dishes or restaurants"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="ALL">All Categories</option>
          {[...new Set(dishes.map((d) => d.category))].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select className="input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="relevance">Sort: Relevance</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {loading ? <Loader text="Loading dishes" /> : null}
      <div className="dish-list" style={{ marginTop: 12 }}>
        {dishes
          .filter((d) =>
            (category === "ALL" || d.category === category) &&
            (d.name.toLowerCase().includes(search.toLowerCase()) ||
              (d.restaurant?.name || "").toLowerCase().includes(search.toLowerCase()))
          )
          .sort((a, b) => {
            if (sortBy === "price_asc") return a.price - b.price;
            if (sortBy === "price_desc") return b.price - a.price;
            return 0;
          })
          .map((dish) => (
          <div key={dish.id} className="dish-card">
            <h4>{dish.name}</h4>
            <p className="muted">by {dish.restaurant?.name || "Restaurant"}</p>
            <div className="badges"><span className="badge">{dish.category}</span><span className="badge price">${dish.price}</span></div>
            {dish.video_url && <video width="240" controls src={dish.video_url} />}
            <button onClick={() => toggleDish(dish)}>
              {selected.find((d) => d.id === dish.id) ? "Remove" : "Add to Order"}
            </button>
            {selected.find((d) => d.id === dish.id) && (
              <div style={{ marginTop: 8 }}>
                <label style={{ fontSize: 12, marginRight: 6 }}>Qty</label>
                <input
                  type="number"
                  min={1}
                  value={quantities[dish.id] || 1}
                  onChange={(e) => setQty(dish.id, e.target.value)}
                  style={{ width: 72, padding: 6 }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="form-container" style={{ maxWidth: 500 }}>
          <h3>Selected Dishes</h3>
          <ul>
            {selected.map((d) => (
              <li key={d.id}>
                {d.name} - ${d.price} × {quantities[d.id] || 1}
              </li>
            ))}
          </ul>
          <button onClick={placeOrder} disabled={submitting}>
            {submitting ? "Placing..." : "Place Order"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Dishes;
