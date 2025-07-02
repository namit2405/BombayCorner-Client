import React from "react";
import bannerImg from "../assets/bannerImg.jpg";
import "../styles/Banner.css";

const Banner = () => {
  return (
    <section className="banner-section">
      <div className="banner-row">
        {/* Text Section */}
        <div className="banner-text-col">
          <span className="banner-badge">Latest Trends 2025</span>
          <h1 className="banner-title">
            Discover latest <span className="highlight">Botanical Products</span> trending in the market
          </h1>
          <p className="banner-desc">
            The botanical products market is experiencing a surge in popularity and innovation, driven by increasing consumer demand for natural and health-supporting ingredients.
          </p>
          <div className="banner-buttons">
            <a href="/Products" className="banner-btn">
              Shop Now
            </a>
            <a href="/collection" className="banner-btn secondary">
              View Collection
            </a>
          </div>
        </div>
        {/* Image Section */}
        <div className="banner-image-col">
          <img src={bannerImg} alt="Model" className="banner-img-main" />
          {/* Overlay Labels */}
          <div className="banner-overlay-label">
            <div>True Botanicals</div>
            <strong>₹5,294.00</strong>
          </div>
          {/* Discount Circle */}
          <div className="discount-circle">
            30% OFF
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;