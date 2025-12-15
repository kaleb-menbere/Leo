import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "./contexts/AuthContext";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPanel from "./pages/AdminPanel";
import Dishes from "./pages/Dishes";
import MyOrders from "./pages/MyOrders";
import AddDish from "./pages/AddDish";
import MyDishes from "./pages/MyDishes";
import RestaurantOrders from "./pages/RestaurantOrders";

function Header() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const role = user?.role;
  const username = user?.username || user?.email?.split('@')[0];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const onLogoClick = (e) => {
    logout();
    window.location.assign("/");
  };

  const getRoleColor = () => {
    switch(role) {
      case 'RESTAURANT': return '#2A9D8F';
      case 'CUSTOMER': return '#FF6B35';
      case 'ADMIN': return '#E76F51';
      default: return '#264653';
    }
  };

  const getRoleIcon = () => {
    switch(role) {
      case 'RESTAURANT': return '👨‍🍳';
      case 'CUSTOMER': return '👤';
      case 'ADMIN': return '🛡️';
      default: return '🍔';
    }
  };

  return (
    <header 
      ref={headerRef}
      className={`header ${!role ? "guest" : ""} ${isScrolled ? "scrolled" : ""} ${isMenuOpen ? "menu-open" : ""}`}
      style={{ '--role-color': getRoleColor() }}
    >
      {/* Animated Background Elements */}
      <div className="header-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="header-container">
        {/* Logo Section */}
        <div className="logo-section">
          <button 
            className="logo logo-btn" 
            onClick={onLogoClick}
            aria-label="LOE Delivery - Click to logout and go home"
          >
            <span className="logo-icon">{getRoleIcon()}</span>
            <span className="logo-text">
              <span className="logo-main">LOE</span>
              <span className="logo-sub">Delivery</span>
            </span>
            <span className="logo-sparkle">✨</span>
          </button>

          {/* Role Badge */}
          {role && (
            <div className="role-badge">
              <span className="role-icon">{getRoleIcon()}</span>
              <span className="role-name">{username || role}</span>
              <div className="role-pulse"></div>
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          {!role && (
            <div className="nav-guest">
              <Link to="/" className="nav-link">
                <span className="nav-icon">🏠</span>
                <span className="nav-text">Home</span>
              </Link>
              <Link to="/login" className="nav-link btn-nav">
                <span className="nav-text">Login</span>
                <span className="nav-arrow">→</span>
              </Link>
              <Link to="/register" className="nav-link btn-nav primary">
                <span className="nav-text">Get Started</span>
                <span className="nav-sparkle">✨</span>
              </Link>
            </div>
          )}

          {role === "RESTAURANT" && (
            <div className="nav-restaurant">
              <Link to="/restaurant" className="nav-link">
                <span className="nav-icon">📊</span>
                <span className="nav-text">Dashboard</span>
              </Link>
              <Link to="/restaurant/add" className="nav-link">
                <span className="nav-icon">➕</span>
                <span className="nav-text">Add Dish</span>
              </Link>
              <Link to="/restaurant/dishes" className="nav-link">
                <span className="nav-icon">🍽️</span>
                <span className="nav-text">My Dishes</span>
              </Link>
              <Link to="/restaurant/orders" className="nav-link">
                <span className="nav-icon">📦</span>
                <span className="nav-text">Orders</span>
                <span className="nav-badge">3</span>
              </Link>
              <button 
                className="btn-logout" 
                onClick={() => { logout(); window.location.assign("/"); }}
                aria-label="Logout"
              >
                <span className="logout-icon">🚪</span>
                <span className="logout-text">Logout</span>
              </button>
            </div>
          )}

          {role === "CUSTOMER" && (
            <div className="nav-customer">
              <Link to="/dishes" className="nav-link">
                <span className="nav-icon">🍕</span>
                <span className="nav-text">Order Food</span>
              </Link>
              <Link to="/orders" className="nav-link">
                <span className="nav-icon">📋</span>
                <span className="nav-text">My Orders</span>
                <span className="nav-badge">2</span>
              </Link>
              <Link to="/customer" className="nav-link">
                <span className="nav-icon">👤</span>
                <span className="nav-text">Profile</span>
              </Link>
              <button 
                className="btn-logout" 
                onClick={() => { logout(); window.location.assign("/"); }}
                aria-label="Logout"
              >
                <span className="logout-icon">🚪</span>
              </button>
            </div>
          )}

          {role === "ADMIN" && (
            <div className="nav-admin">
              <Link to="/admin" className="nav-link">
                <span className="nav-icon">📈</span>
                <span className="nav-text">Analytics</span>
              </Link>
              <Link to="/admin/panel" className="nav-link">
                <span className="nav-icon">⚙️</span>
                <span className="nav-text">Panel</span>
              </Link>
              <Link to="/admin/users" className="nav-link">
                <span className="nav-icon">👥</span>
                <span className="nav-text">Users</span>
              </Link>
              <div className="admin-actions">
                <button 
                  className="btn-logout admin" 
                  onClick={() => { logout(); window.location.assign("/"); }}
                  aria-label="Logout as Admin"
                >
                  <span className="logout-icon">🔒</span>
                  <span className="logout-text">Logout</span>
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="menu-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <div className={`hamburger ${isMenuOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`nav-mobile ${isMenuOpen ? "open" : ""}`}>
        <div className="mobile-nav-content">
          {!role ? (
            <div className="mobile-guest">
              <Link to="/" className="mobile-link">
                <span className="mobile-icon">🏠</span>
                Home
              </Link>
              <Link to="/login" className="mobile-link">
                <span className="mobile-icon">🔐</span>
                Login
              </Link>
              <Link to="/register" className="mobile-link primary">
                <span className="mobile-icon">✨</span>
                Register
              </Link>
            </div>
          ) : role === "RESTAURANT" ? (
            <div className="mobile-restaurant">
              <Link to="/restaurant" className="mobile-link">
                <span className="mobile-icon">📊</span>
                Dashboard
              </Link>
              <Link to="/restaurant/add" className="mobile-link">
                <span className="mobile-icon">➕</span>
                Add Dish
              </Link>
              <Link to="/restaurant/dishes" className="mobile-link">
                <span className="mobile-icon">🍽️</span>
                My Dishes
              </Link>
              <Link to="/restaurant/orders" className="mobile-link">
                <span className="mobile-icon">📦</span>
                Orders <span className="mobile-badge">3</span>
              </Link>
            </div>
          ) : role === "CUSTOMER" ? (
            <div className="mobile-customer">
              <Link to="/dishes" className="mobile-link">
                <span className="mobile-icon">🍕</span>
                Order Food
              </Link>
              <Link to="/orders" className="mobile-link">
                <span className="mobile-icon">📋</span>
                My Orders <span className="mobile-badge">2</span>
              </Link>
              <Link to="/customer" className="mobile-link">
                <span className="mobile-icon">👤</span>
                Profile
              </Link>
            </div>
          ) : (
            <div className="mobile-admin">
              <Link to="/admin" className="mobile-link">
                <span className="mobile-icon">📈</span>
                Analytics
              </Link>
              <Link to="/admin/panel" className="mobile-link">
                <span className="mobile-icon">⚙️</span>
                Panel
              </Link>
              <Link to="/admin/users" className="mobile-link">
                <span className="mobile-icon">👥</span>
                Users
              </Link>
            </div>
          )}
          
          {role && (
            <button 
              className="mobile-logout" 
              onClick={() => { logout(); window.location.assign("/"); }}
            >
              <span className="logout-icon">🚪</span>
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function App() {
  const location = useLocation();

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="page-transition">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/restaurant" element={<RestaurantDashboard />} />
            <Route path="/restaurant/add" element={<AddDish />} />
            <Route path="/restaurant/dishes" element={<MyDishes />} />
            <Route path="/restaurant/orders" element={<RestaurantOrders />} />
            <Route path="/customer" element={<CustomerDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/panel" element={<AdminPanel />} />
            <Route path="/dishes" element={<Dishes />} />
            <Route path="/orders" element={<MyOrders />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

// Wrap App with Router
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}