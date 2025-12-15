import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Swal from "sweetalert2";
import "./Login.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const containerRef = useRef(null);

  useEffect(() => {
    setAnimate(true);
  }, []);

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
        
        // Success animation
        containerRef.current.classList.add('login-success');
        
        Swal.fire({
          icon: "success",
          title: "Welcome Back!",
          text: "Login successful",
          showConfirmButton: false,
          timer: 1500,
          background: '#2A9D8F',
          color: 'white',
        });

        // Redirect based on role
        setTimeout(() => {
          if (decoded?.role === "RESTAURANT") navigate("/restaurant");
          else if (decoded?.role === "ADMIN") navigate("/admin");
          else navigate("/dishes");
        }, 1500);
        
      } else {
        // Shake animation on error
        containerRef.current.classList.add('shake-error');
        setTimeout(() => {
          containerRef.current.classList.remove('shake-error');
        }, 500);
        
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.error || "Invalid credentials",
          confirmButtonColor: "#FF6B35",
          background: '#F8F9FA',
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Connection Error",
        text: "Please check your connection",
        confirmButtonColor: "#FF6B35",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  const handleGuestLogin = () => {
    setForm({ email: "guest@example.com", password: "guest123" });
  };

  return (
    <div className={`login-page ${animate ? 'loaded' : ''}`}>
      {/* Animated Background */}
      <div className="login-bg">
        <div className="bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
        <div className="floating-food">
          <span className="food-icon">🍕</span>
          <span className="food-icon">🍔</span>
          <span className="food-icon">🍣</span>
          <span className="food-icon">🥗</span>
        </div>
      </div>

      <div className="login-container" ref={containerRef}>
        {/* Left Panel - Brand/Info */}
        <div className="login-left">
          <div className="left-content">
            <div className="brand-header">
              <div className="brand-logo">
                <span className="logo-icon">🍔</span>
                <div className="logo-text">
                  <h1>LOE</h1>
                  <span className="logo-sub">Delivery</span>
                </div>
              </div>
              <div className="brand-pulse"></div>
            </div>

            <div className="welcome-message">
              <h2>Welcome Back!</h2>
              <p>Sign in to access your personalized food experience</p>
            </div>

            <div className="features-list">
              <div className="feature">
                <span className="feature-icon">🚀</span>
                <span>Fast Delivery</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🔒</span>
                <span>Secure Payments</span>
              </div>
              <div className="feature">
                <span className="feature-icon">⭐</span>
                <span>Premium Restaurants</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🎯</span>
                <span>Personalized Recommendations</span>
              </div>
            </div>

            <div className="stats">
              <div className="stat">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
              <div className="stat">
                <div className="stat-number">500+</div>
                <div className="stat-label">Restaurants</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="login-right">
          <div className="form-wrapper">
            <div className="form-header">
              <h2 className="form-title">Sign In</h2>
              <p className="form-subtitle">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <div className="input-icon">
                  <span>📧</span>
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="login-input"
                  disabled={submitting}
                />
                <div className="input-border"></div>
              </div>

              <div className="input-group">
                <div className="input-icon">
                  <span>🔒</span>
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="login-input"
                  disabled={submitting}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
                <div className="input-border"></div>
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className={`login-button ${submitting ? 'loading' : ''}`}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="button-loader"></span>
                    Signing In...
                  </>
                ) : (
                  <>
                    <span className="button-text">Sign In</span>
                    <span className="button-arrow">→</span>
                  </>
                )}
              </button>

              <div className="divider">
                <span>or continue with</span>
              </div>

              <div className="social-login">
                <button type="button" className="social-button google">
                  <span className="social-icon">G</span>
                  Google
                </button>
                <button type="button" className="social-button github">
                  <span className="social-icon">G</span>
                  GitHub
                </button>
              </div>

              <button
                type="button"
                className="guest-button"
                onClick={handleGuestLogin}
                disabled={submitting}
              >
                <span className="guest-icon">👤</span>
                Try Guest Account
              </button>

              <div className="signup-link">
                Don't have an account?{" "}
                <Link to="/register" className="signup-text">
                  Create Account
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Success Animation Overlay */}
        <div className="success-overlay">
          <div className="success-content">
            <div className="success-icon">🎉</div>
            <h3>Welcome Back!</h3>
            <p>Redirecting to your dashboard...</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="login-footer">
        <p>© 2024 LOE Delivery. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;