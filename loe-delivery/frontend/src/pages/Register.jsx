import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./Register.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CUSTOMER",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [animate, setAnimate] = useState(false);
  const [selectedRole, setSelectedRole] = useState("CUSTOMER");
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "role" ? value.toUpperCase() : value;
    setForm({ ...form, [name]: newValue });
    
    if (name === "role") {
      setSelectedRole(value.toUpperCase());
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      // Shake animation on error
      containerRef.current.classList.add('shake-error');
      setTimeout(() => {
        containerRef.current.classList.remove('shake-error');
      }, 500);
      
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Success animation
      containerRef.current.classList.add('register-success');
      
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Welcome Aboard! 🎉",
          text: "Account created successfully",
          showConfirmButton: false,
          timer: 2000,
          background: '#2A9D8F',
          color: 'white',
        });

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        containerRef.current.classList.remove('register-success');
        
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: data.error || "Something went wrong",
          confirmButtonColor: "#FF6B35",
          background: '#F8F9FA',
        });
      }
    } catch (err) {
      console.error(err);
      containerRef.current.classList.remove('register-success');
      
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

  const handleQuickFill = (role) => {
    const demoData = {
      CUSTOMER: {
        name: "John Doe",
        email: "customer@example.com",
        password: "customer123",
        confirmPassword: "customer123",
      },
      RESTAURANT: {
        name: "Gourmet Kitchen",
        email: "restaurant@example.com",
        password: "restaurant123",
        confirmPassword: "restaurant123",
      },
    };
    
    setForm({ ...form, ...demoData[role], role });
    setSelectedRole(role);
    
    Swal.fire({
      icon: "info",
      title: `Demo ${role.toLowerCase()} data filled!`,
      text: "You can edit the fields before submitting",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <div className={`register-page ${animate ? 'loaded' : ''}`}>
      {/* Animated Background */}
      <div className="register-bg">
        <div className="bg-particles">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            ></div>
          ))}
        </div>
        <div className="floating-icons">
          <span className="icon">👨‍🍳</span>
          <span className="icon">🍽️</span>
          <span className="icon">🚚</span>
          <span className="icon">⭐</span>
          <span className="icon">💳</span>
        </div>
      </div>

      <div className="register-container" ref={containerRef}>
        {/* Left Panel - Registration Form */}
        <div className="register-left">
          <div className="form-wrapper">
            <div className="form-header">
              <h1 className="form-title">Create Account</h1>
              <p className="form-subtitle">Join our food delivery community</p>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
              {/* Name Input */}
              <div className="input-group">
                <label className="input-label">
                  <span className="label-icon">👤</span>
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className={`register-input ${errors.name ? 'error' : ''}`}
                  disabled={submitting}
                />
                {errors.name && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Email Input */}
              <div className="input-group">
                <label className="input-label">
                  <span className="label-icon">📧</span>
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={`register-input ${errors.email ? 'error' : ''}`}
                  disabled={submitting}
                />
                {errors.email && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password Inputs */}
              <div className="password-row">
                <div className="input-group">
                  <label className="input-label">
                    <span className="label-icon">🔒</span>
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className={`register-input ${errors.password ? 'error' : ''}`}
                    disabled={submitting}
                  />
                  {errors.password && (
                    <div className="error-message">
                      <span className="error-icon">⚠️</span>
                      {errors.password}
                    </div>
                  )}
                </div>

                <div className="input-group">
                  <label className="input-label">
                    <span className="label-icon">🔐</span>
                    Confirm Password
                  </label>
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Repeat your password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className={`register-input ${errors.confirmPassword ? 'error' : ''}`}
                    disabled={submitting}
                  />
                  {errors.confirmPassword && (
                    <div className="error-message">
                      <span className="error-icon">⚠️</span>
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>
              </div>

              {/* Role Selection */}
              <div className="role-section">
                <label className="section-label">
                  <span className="section-icon">🎯</span>
                  Select Your Role
                </label>
                
                <div className="role-cards">
                  <div 
                    className={`role-card ${selectedRole === 'CUSTOMER' ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedRole('CUSTOMER');
                      setForm({...form, role: 'CUSTOMER'});
                    }}
                  >
                    <div className="role-icon">👤</div>
                    <div className="role-info">
                      <h4 className="role-title">Customer</h4>
                      <p className="role-desc">Order food from restaurants</p>
                    </div>
                    <div className="role-check">
                      <div className="check-circle"></div>
                    </div>
                  </div>

                  <div 
                    className={`role-card ${selectedRole === 'RESTAURANT' ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedRole('RESTAURANT');
                      setForm({...form, role: 'RESTAURANT'});
                    }}
                  >
                    <div className="role-icon">🍽️</div>
                    <div className="role-info">
                      <h4 className="role-title">Restaurant</h4>
                      <p className="role-desc">List your dishes & manage orders</p>
                    </div>
                    <div className="role-check">
                      <div className="check-circle"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo Buttons */}
              <div className="demo-buttons">
                <p className="demo-label">Quick fill demo data:</p>
                <div className="demo-actions">
                  <button 
                    type="button" 
                    className="demo-btn customer"
                    onClick={() => handleQuickFill('CUSTOMER')}
                    disabled={submitting}
                  >
                    Fill Customer
                  </button>
                  <button 
                    type="button" 
                    className="demo-btn restaurant"
                    onClick={() => handleQuickFill('RESTAURANT')}
                    disabled={submitting}
                  >
                    Fill Restaurant
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="terms-group">
                <label className="terms-label">
                  <input type="checkbox" required />
                  <span className="custom-checkbox"></span>
                  <span className="terms-text">
                    I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`register-button ${submitting ? 'loading' : ''}`}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="button-loader"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <span className="button-text">Create Account</span>
                    <span className="button-sparkle">✨</span>
                  </>
                )}
              </button>

              {/* Login Link */}
              <div className="login-link">
                Already have an account?{" "}
                <Link to="/login" className="login-text">
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right Panel - Features & Benefits */}
        <div className="register-right">
          <div className="right-content">
            <div className="benefits-header">
              <div className="logo-display">
                <span className="logo-icon">🍔</span>
                <h2 className="logo-text">LOE Delivery</h2>
              </div>
              <p className="benefits-subtitle">Join thousands of food lovers</p>
            </div>

            <div className="benefits-list">
              <div className="benefit-card">
                <div className="benefit-icon">🚀</div>
                <div className="benefit-content">
                  <h4>Lightning Fast Delivery</h4>
                  <p>Get your food delivered in 30 minutes or less</p>
                </div>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">⭐</div>
                <div className="benefit-content">
                  <h4>Premium Restaurants</h4>
                  <p>Access top-rated restaurants in your area</p>
                </div>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">🔒</div>
                <div className="benefit-content">
                  <h4>Secure Payments</h4>
                  <p>Your transactions are 100% secure</p>
                </div>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">🎯</div>
                <div className="benefit-content">
                  <h4>Personalized Experience</h4>
                  <p>Recommendations based on your taste</p>
                </div>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">💳</div>
                <div className="benefit-content">
                  <h4>Flexible Payment</h4>
                  <p>Multiple payment options available</p>
                </div>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">👑</div>
                <div className="benefit-content">
                  <h4>Loyalty Rewards</h4>
                  <p>Earn points with every order</p>
                </div>
              </div>
            </div>

            <div className="stats-display">
              <div className="stat-card">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Happy Users</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">1K+</div>
                <div className="stat-label">Restaurants</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">4.8</div>
                <div className="stat-label">Avg. Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Overlay */}
        <div className="success-overlay">
          <div className="success-content">
            <div className="success-icon">🎉</div>
            <h3>Welcome to LOE Delivery!</h3>
            <p>Your account is being created...</p>
            <div className="success-progress">
              <div className="progress-bar"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="register-footer">
        <p>© 2024 LOE Delivery. Experience the future of food delivery.</p>
      </div>
    </div>
  );
}

export default Register;