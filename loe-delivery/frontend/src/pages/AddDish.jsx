import React, { useState } from "react";
import Loader from "../components/Loader";
import Swal from "sweetalert2";

function AddDish() {
  const [form, setForm] = useState({ name: "", price: "", category: "", video_url: "" });
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem("token");

  const addDish = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/dishes", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
        Swal.fire({ icon: "success", title: "Dish created" });
      } else {
        Swal.fire({ icon: "error", title: data.error || "Failed to create dish" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 style={{ color: "#FF7A00", textAlign: "center" }}>Add New Dish</h2>
      <div className="form-container">
        <form onSubmit={addDish}>
          <input type="text" placeholder="Dish name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <input type="text" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
          <input type="text" placeholder="Video URL" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} />
          <button type="submit" disabled={submitting}>{submitting ? "Adding..." : "Add Dish"}</button>
        </form>
        {submitting ? <Loader text="Creating dish" /> : null}
      </div>
    </div>
  );
}

export default AddDish;
