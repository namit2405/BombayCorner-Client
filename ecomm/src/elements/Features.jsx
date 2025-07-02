import React from "react";
import "../styles/Features.css";
import { Link } from "react-router-dom";

const Features = () => {
  return (
    <section className="features-section">
      <h2 className="features-title">Why Choose Us?</h2>
      <div className="features-container">
        <div className="features-row">
          <Link to={"/cart"} className="feature-item">
            <span className="feature-icon">
              <i className="fas fa-shipping-fast"></i>
            </span>
            <h5 className="feature-title">Free Shipping</h5>
            <p className="feature-desc">
              Free Shipping on Orders above ₹4000 else ₹150 will be charged on per order.
            </p>
          </Link>
          <Link to={"/Products"} className="feature-item">
            <span className="feature-icon">
              <i className="fas fa-star"></i>
            </span>
            <h5 className="feature-title">Quality Products</h5>
            <p className="feature-desc">
              We provide you the guarantee of Top-quality products with no side-effects.
            </p>
          </Link>
          <Link to={"/Products"} className="feature-item">
            <span className="feature-icon">
              <i className="fas fa-percent"></i>
            </span>
            <h5 className="feature-title">Discount Offers</h5>
            <p className="feature-desc">
              We allow you to enjoy budget-friendly shopping by providing exciting offers and discounts.
            </p>
          </Link>
          <Link to={"/contact"} className="feature-item">
            <span className="feature-icon">
              <i className="fas fa-headset"></i>
            </span>
            <h5 className="feature-title">24/7 Support</h5>
            <p className="feature-desc">
              We are here to listen to your queries and provide you with the best support at any time.
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;