import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const [loaded, setLoaded] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [visibleCounters, setVisibleCounters] = useState({});
  const scrollRef = useRef(null);
  const animationRef = useRef(null);
  const statsRef = useRef(null);
  const lastScrollTime = useRef(Date.now());

  const categories = [
    { name: "Burgers", emoji: "🍔", color: "#FF6B35", items: 120 },
    { name: "Pizza", emoji: "🍕", color: "#F7C59F", items: 85 },
    { name: "Pasta", emoji: "🍝", color: "#2A9D8F", items: 45 },
    { name: "Bowls", emoji: "🥣", color: "#E9C46A", items: 60 },
    { name: "Salads", emoji: "🥗", color: "#264653", items: 55 },
    { name: "Desserts", emoji: "🍰", color: "#E76F51", items: 75 }
  ];

  const featuredItems = [
    { id: 1, name: "Truffle Mushroom Burger", price: 14.99, time: "20 min", rating: 4.8, emoji: "🍔", color: "#FF6B35", restaurant: "Burger Palace" },
    { id: 2, name: "Neapolitan Pizza", price: 18.50, time: "25 min", rating: 4.9, emoji: "🍕", color: "#F7C59F", restaurant: "Pizza Napoli" },
    { id: 3, name: "Lobster Pasta", price: 24.99, time: "30 min", rating: 4.7, emoji: "🍝", color: "#2A9D8F", restaurant: "Seafood Delight" },
    { id: 4, name: "Acai Power Bowl", price: 12.75, time: "15 min", rating: 4.6, emoji: "🥣", color: "#E9C46A", restaurant: "Healthy Bites" },
    { id: 5, name: "Caesar Salad", price: 10.99, time: "10 min", rating: 4.5, emoji: "🥗", color: "#264653", restaurant: "Green Garden" },
    { id: 6, name: "Chocolate Lava", price: 8.99, time: "12 min", rating: 4.9, emoji: "🍰", color: "#E76F51", restaurant: "Sweet Heaven" }
  ];

  const restaurants = [
    { id: 1, name: "Burger Palace", rating: 4.8, deliveryTime: "20-30 min", category: "American", emoji: "🍔" },
    { id: 2, name: "Pizza Napoli", rating: 4.9, deliveryTime: "25-35 min", category: "Italian", emoji: "🍕" },
    { id: 3, name: "Asian Fusion", rating: 4.7, deliveryTime: "30-40 min", category: "Asian", emoji: "🥢" },
    { id: 4, name: "Healthy Bites", rating: 4.6, deliveryTime: "15-25 min", category: "Healthy", emoji: "🥗" },
    { id: 5, name: "Taco Fiesta", rating: 4.5, deliveryTime: "20-30 min", category: "Mexican", emoji: "🌮" },
    { id: 6, name: "Sweet Heaven", rating: 4.9, deliveryTime: "10-20 min", category: "Desserts", emoji: "🍰" }
  ];

  const testimonials = [
    { id: 1, name: "Sarah Johnson", role: "Food Blogger", text: "LOE Delivery changed my food experience! The video previews help me make perfect choices every time.", avatar: "👩‍💼", rating: 5 },
    { id: 2, name: "Mike Chen", role: "Regular Customer", text: "Fastest delivery in town. My food always arrives hot and fresh. Highly recommended!", avatar: "👨‍💼", rating: 5 },
    { id: 3, name: "Emma Wilson", role: "Busy Professional", text: "As a working mom, LOE Delivery saves me hours every week. The interface is so intuitive!", avatar: "👩‍💻", rating: 4 },
    { id: 4, name: "David Park", role: "Food Enthusiast", text: "The restaurant variety is amazing. I discover new favorites every week!", avatar: "🧑‍🍳", rating: 5 }
  ];

  // Optimized initialization
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer for counter animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleCounters(prev => ({ ...prev, [entry.target.id]: true }));
            }, 200);
          }
        });
      },
      { threshold: 0.5 }
    );

    const statElements = document.querySelectorAll('.stat-number');
    statElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Optimized scroll handler with throttling
  const handleScroll = useCallback((direction) => {
    const now = Date.now();
    if (now - lastScrollTime.current < 100) return;
    
    lastScrollTime.current = now;
    
    if (scrollRef.current) {
      const cardWidth = 320;
      const scrollAmount = direction === 'right' ? cardWidth : -cardWidth;
      
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  // Mouse move parallax effect
  const handleMouseMove = useCallback((e) => {
    if (!animationRef.current) return;
    
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 20;
    const y = (clientY / window.innerHeight - 0.5) * 20;
    
    animationRef.current.style.transform = `translate(${x}px, ${y}px)`;
  }, []);

  // Clean up animation frame
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div className={`home-container ${loaded ? 'loaded' : ''}`}>
      {/* Optimized background - minimal elements for performance */}
      <div className="gradient-bg"></div>
      <div className="floating-dots" ref={animationRef}>
        {[...Array(15)].map((_, i) => (
          <div key={i} className="dot" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}></div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text-wrapper">
            <h1 className="hero-title">
              <span className="title-line">Fresh Food</span>
              <span className="title-line">Fast Delivery</span>
              <span className="title-line">Every Day</span>
            </h1>
            <p className="hero-subtitle">
              Order from top restaurants with video previews and get it delivered in minutes.
            </p>
          </div>
          
          <div className="hero-actions">
            <Link to="/dishes" className="cta-button primary">
              <span className="button-text">Order Now</span>
              <span className="button-icon">→</span>
            </Link>
            <Link to="/register" className="cta-button secondary">
              <span className="button-text">Sign Up Free</span>
            </Link>
          </div>

          <div className="hero-stats" ref={statsRef}>
            <div className="stat-item">
              <div className="stat-number animate-number" id="stat1">10K+</div>
              <div className="stat-label">Orders Delivered</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number animate-number" id="stat2">4.8</div>
              <div className="stat-label">Average Rating</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number animate-number" id="stat3">15</div>
              <div className="stat-label">Avg. Minutes</div>
            </div>
          </div>
        </div>
        
        <div className="hero-scroll-hint">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-highlight">🔥 Trending Now</span>
          </h2>
          <div className="section-nav">
            <button className="nav-button" onClick={() => handleScroll('left')} aria-label="Scroll left">
              ←
            </button>
            <button className="nav-button" onClick={() => handleScroll('right')} aria-label="Scroll right">
              →
            </button>
          </div>
        </div>

        <div className="cards-container">
          <div className="cards-scroll" ref={scrollRef}>
            {featuredItems.map((item) => (
              <div 
                key={item.id}
                className={`food-card ${activeCard === item.id ? 'active' : ''}`}
                onMouseEnter={() => setActiveCard(item.id)}
                onMouseLeave={() => setActiveCard(null)}
                style={{ '--card-color': item.color }}
              >
                <div className="card-ribbon">Popular</div>
                <div className="card-emoji">{item.emoji}</div>
                <div className="card-content">
                  <h3 className="card-title">{item.name}</h3>
                  <div className="card-restaurant">{item.restaurant}</div>
                  <div className="card-price">${item.price.toFixed(2)}</div>
                  <div className="card-meta">
                    <span className="meta-item">⭐ {item.rating}</span>
                    <span className="meta-item">⏱️ {item.time}</span>
                  </div>
                </div>
                <button className="card-order-btn">Add to Cart</button>
                <div className="card-glow"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2 className="section-title">
          <span className="title-highlight">📁 Browse Categories</span>
        </h2>
        <p className="section-subtitle">Explore our wide variety of food categories</p>
        
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div 
              key={category.name}
              className="category-card"
              style={{ 
                '--category-color': category.color,
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="category-icon">{category.emoji}</div>
              <div className="category-content">
                <h3 className="category-name">{category.name}</h3>
                <div className="category-count">{category.items} items</div>
              </div>
              <div className="category-hint">View All →</div>
              <div className="category-overlay"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Restaurants Section */}
      <section className="restaurants-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-highlight">🏆 Top Restaurants</span>
          </h2>
          <Link to="/restaurants" className="view-all-link">
            View All <span>→</span>
          </Link>
        </div>
        
        <div className="restaurants-grid">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="restaurant-card">
              <div className="restaurant-badge">⭐ {restaurant.rating}</div>
              <div className="restaurant-emoji">{restaurant.emoji}</div>
              <div className="restaurant-content">
                <h3 className="restaurant-name">{restaurant.name}</h3>
                <div className="restaurant-category">{restaurant.category}</div>
                <div className="restaurant-meta">
                  <span className="meta-item">⏱️ {restaurant.deliveryTime}</span>
                  <span className="meta-item">📦 Free delivery</span>
                </div>
              </div>
              <button className="restaurant-view-btn">View Menu</button>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2 className="section-title center">
          <span className="title-highlight">🎯 How It Works</span>
        </h2>
        <p className="section-subtitle center">Get your favorite food in 3 easy steps</p>
        
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-icon">📱</div>
            <h3 className="step-title">Browse & Choose</h3>
            <p className="step-description">Explore restaurants and dishes with video previews</p>
          </div>
          
          <div className="step-connector"></div>
          
          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-icon">💳</div>
            <h3 className="step-title">Order & Pay</h3>
            <p className="step-description">Secure checkout with multiple payment options</p>
          </div>
          
          <div className="step-connector"></div>
          
          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-icon">🚚</div>
            <h3 className="step-title">Track & Enjoy</h3>
            <p className="step-description">Real-time tracking and hot delivery to your door</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title center">
          <span className="title-highlight">💬 What Our Customers Say</span>
        </h2>
        
        <div className="testimonials-container">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-rating">
                {"⭐".repeat(testimonial.rating)}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{testimonial.avatar}</div>
                <div className="author-info">
                  <h4 className="author-name">{testimonial.name}</h4>
                  <p className="author-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Experience Food Delivery Like Never Before?</h2>
          <p className="cta-subtitle">Join thousands of happy customers enjoying premium food delivery</p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-button primary large">
              <span className="button-text">Get Started Free</span>
              <span className="button-icon">🚀</span>
            </Link>
            <Link to="/dishes" className="cta-button secondary large">
              <span className="button-text">Browse Menu</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">🍔</span>
              <div className="logo-text">
                <h3>LOE Delivery</h3>
                <p>Fresh. Fast. Delivered.</p>
              </div>
            </div>
            <p className="footer-description">
              Experience the future of food delivery with premium restaurants, video previews, and lightning-fast service.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Facebook">📘</a>
              <a href="#" className="social-link" aria-label="Twitter">🐦</a>
              <a href="#" className="social-link" aria-label="Instagram">📸</a>
              <a href="#" className="social-link" aria-label="LinkedIn">💼</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/dishes">Order Food</Link></li>
              <li><Link to="/restaurants">Restaurants</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/careers">Careers</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-title">Categories</h4>
            <ul className="footer-links">
              <li><Link to="/category/burgers">Burgers</Link></li>
              <li><Link to="/category/pizza">Pizza</Link></li>
              <li><Link to="/category/pasta">Pasta</Link></li>
              <li><Link to="/category/salads">Salads</Link></li>
              <li><Link to="/category/desserts">Desserts</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-title">Legal</h4>
            <ul className="footer-links">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/cookies">Cookie Policy</Link></li>
              <li><Link to="/refund">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-info">
            <p>© 2024 LOE Delivery. All rights reserved.</p>
            <div className="footer-badges">
              <span className="badge">🔒 Secure Payments</span>
              <span className="badge">🚚 Fast Delivery</span>
              <span className="badge">⭐ Top Rated</span>
            </div>
          </div>
          <div className="footer-apps">
            <button className="app-btn ios">Download on iOS</button>
            <button className="app-btn android">Get it on Android</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;