import React from "react";

function Home() {
  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <h1>Fresh. Fast. Delivered.</h1>
          <p>Discover trending dishes with short video previews and order in seconds.</p>
          <div className="hero-actions">
            <a className="btn" href="/login">Login</a>
            <a className="btn btn-outline" href="/register">Create Account</a>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Featured This Week</h2>
        <div className="scroll-row">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="scroll-card">
              <div className="thumb" />
              <h4>Chef Special #{i}</h4>
              <p>From $ {(8 + i).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Top Categories</h2>
        <div className="grid-cats">
          {["Burgers","Pizza","Pasta","Bowls","Salads","Desserts"].map((c) => (
            <div key={c} className="cat-card">{c}</div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
