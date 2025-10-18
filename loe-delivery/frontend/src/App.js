import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Dishes from "./pages/Dishes";
import MyOrders from "./pages/MyOrders";
import AddDish from "./pages/AddDish";
import MyDishes from "./pages/MyDishes";
import RestaurantOrders from "./pages/RestaurantOrders";
import "./App.css";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";

function App() {
  const { user, logout } = useContext(AuthContext);
  const role = user?.role;
  const onLogoClick = (e) => {
    // Clicking logo logs out and goes home
    logout();
    window.location.assign("/");
  };

  return (
    <Router>
      <header className={`header${!role ? " guest" : ""}`}>
        <button className="logo logo-btn" onClick={onLogoClick}>🍔 LOE Delivery</button>
        <nav>
          {!role && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
          {role === "RESTAURANT" && (
            <>
              <Link to="/restaurant/add">Add Dish</Link>
              <Link to="/restaurant/dishes">My Dishes</Link>
              <Link to="/restaurant/orders">My Orders</Link>
              <button className="btn btn-logout" onClick={() => { logout(); window.location.assign("/"); }}>Logout</button>
            </>
          )}
          {role === "CUSTOMER" && (
            <>
              <Link to="/dishes">Dishes</Link>
              <Link to="/orders">My Orders</Link>
              <button className="btn btn-logout" onClick={() => { logout(); window.location.assign("/"); }}>Logout</button>
            </>
          )}
          {role === "ADMIN" && (
            <>
              <Link to="/admin">Analytics</Link>
              <button className="btn btn-logout" onClick={() => { logout(); window.location.assign("/"); }}>Logout</button>
            </>
          )}
        </nav>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/restaurant" element={<RestaurantDashboard />} />
          <Route path="/restaurant/add" element={<AddDish />} />
          <Route path="/restaurant/dishes" element={<MyDishes />} />
          <Route path="/restaurant/orders" element={<RestaurantOrders />} />
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dishes" element={<Dishes />} />
          <Route path="/orders" element={<MyOrders />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
