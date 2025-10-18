import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Swal from "sweetalert2";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER", // default uppercase
  });
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "role" ? value.toUpperCase() : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Registration successful" });
        navigate("/login");
      } else {
        Swal.fire({ icon: "error", title: data.error || "Registration failed" });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Server error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="CUSTOMER">Customer</option>
          <option value="RESTAURANT">Restaurant</option>
        </select>

        <button type="submit" disabled={submitting}>{submitting ? "Registering..." : "Register"}</button>
      </form>
      {submitting ? <Loader text="Creating your account" /> : null}
    </div>
  );
}

export default Register;
