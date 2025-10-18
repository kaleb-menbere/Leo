import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Loader from "../components/Loader";
import Swal from "sweetalert2";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        const decoded = parseJwt(data.token);
        setUser(decoded);
        Swal.fire({ icon: "success", title: "Login successful" });
        if (decoded && decoded.role === "RESTAURANT") navigate("/restaurant");
        else if (decoded && decoded.role === "ADMIN") navigate("/admin");
        else navigate("/dishes");
      } else {
        Swal.fire({ icon: "error", title: data.error || "Login failed" });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Server error" });
    } finally {
      setSubmitting(false);
    }
  };

  // Simple JWT decode helper
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit" disabled={submitting}>{submitting ? "Logging in..." : "Login"}</button>
      </form>
      {submitting ? <Loader text="Signing you in" /> : null}
    </div>
  );
}

export default Login;
