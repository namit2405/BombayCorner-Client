import React, { useEffect, useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaTiktok,
  FaPinterest,
  FaYoutube,
} from "react-icons/fa6";
import "../styles/Footer.css";
import axios from "axios";
import { Link } from "react-router-dom";
import api from "../axios";

const Footer = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/categories/")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories", err));
  }, []);
  return (
    <footer className="footer">
      <div className="footer-container container">
        {/* About Us */}
        <div className="footer-section about">
          <h4>Bombay Corner</h4>
          <p>
            Beautifying Jalandhar since <strong>{new Date().getFullYear() - 1958} years</strong>.
          </p>
          <p>
            We bring trusted cosmetic & skincare products with <strong>authenticity and love</strong>.
          </p>
          <p>
            <i className="fas fa-map-marker-alt"></i> Attari Bazar, Jalandhar
          </p>
          <p>
            <i className="fas fa-phone"></i> +91 7717402874
          </p>
          <p
            style={{
              overflowWrap: "break-word",
              fontSize: "0.85rem",
            }}
          >
            <i className="fas fa-envelope"></i> shubhamjain24.2005@gmail.com
          </p>
        </div>

        {/* Shop Categories */}
        <div className="footer-section links">
          <h4>Shop</h4>
           <ul>
            {categories.slice(0, 8).map((cat) => (
              <li key={cat.id}>
                <Link to={`/products?category_id=${cat.id}`} style={{ textDecoration: "none", color: "#263238" }}>
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div className="footer-section links">
          <h4>Support</h4>
          <ul>
            <li><Link to="/help" style={{textDecoration:"none", color:"inherit"}}>Need Help?</Link></li>
            <li><Link to="/order/history" style={{textDecoration:"none", color:"inherit"}}>Track Your Order</Link></li>
            <li><Link to="/order/history" style={{textDecoration:"none", color:"inherit"}}>Shipping & Delivery</Link></li>
             <li><Link to="/help" style={{textDecoration:"none", color:"inherit"}}>Returns & Refunds</Link></li>
            <li><Link to="/help" style={{textDecoration:"none", color:"inherit"}}>FAQs</Link></li>
            <li><Link to="/contact" style={{textDecoration:"none", color:"inherit"}}>Contact Support</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div className="footer-section links">
          <h4>Explore</h4>
          <ul>
           <li><Link to="/about" style={{textDecoration:"none", color:"inherit"}}>Our Story</Link></li>
            <li><Link to="/products/2" style={{textDecoration:"none", color:"inherit"}}>Customer Reviews</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div className="footer-section download">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <Link to="https://www.instagram.com/namit.here24?igsh=MTNxb3lz20Oaz3ag==c"><FaInstagram /></Link>
            <Link to="https://www.facebook.com/namit.jain.73997"><FaFacebook /></Link>
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="footer-bottom">
        <p>
          Secure Payments: <span>Visa • Mastercard • UPI • Paytm • Cash on Delivery</span>
        </p>
        <p>
          © {new Date().getFullYear()} <strong>Bombay Corner</strong>. All rights reserved.
          Designed by <b><u>Namit Jain</u></b>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
