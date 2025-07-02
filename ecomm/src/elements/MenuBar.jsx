// src/components/MenuBar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/MenuBar.css";

const MenuBar = ({ closeMenu }) => {
  return (
    <div className="menu-bar">
      <Link to="/" className="menu-item" onClick={closeMenu}>Home</Link>
      <Link to="/products" className="menu-item" onClick={closeMenu}>Products</Link>
      <Link to="/order/history" className="menu-item" onClick={closeMenu}>Your Orders</Link>
      <Link to="/about" className="menu-item" onClick={closeMenu}>About Us</Link>
      <Link to="/contact" className="menu-item" onClick={closeMenu}>Contact</Link>
    </div>
  );
};


export default MenuBar;
