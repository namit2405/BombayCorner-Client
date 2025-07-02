import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../Context/WishlistContext";
import "../styles/Wishlist.css";
import Loader from "../elements/Loader"; 
import PopupModal from "../elements/PopUp";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, fetchWishlist } = useWishlist();
  const [popup, setPopup] = useState({ show: false, title: "", message: "" });
  const navigate = useNavigate();

  useEffect(() => {
  const fetchData = async () => {
    // Check for token before fetching
    const token = localStorage.getItem("token");
    if (!token) {
      setPopup({
        show: true,
        title: "Login Required",
        message: "Please login to view your wishlist!",
      });
      setTimeout(() => {
        setPopup({ show: false, title: "", message: "" });
        navigate("/login");
      }, 1500);
      return;
    }
    try {
      await fetchWishlist();
    } catch (error) {
      if (error.response?.status === 401) {
        setPopup({
          show: true,
          title: "Login Required",
          message: "Please login to view your wishlist!",
        });
        setTimeout(() => {
          setPopup({ show: false, title: "", message: "" });
          navigate("/login");
        }, 1500);
      }
    }
  };
  fetchData();
}, [fetchWishlist, navigate]);

  return (
    <div className="wishlist-container">
      <PopupModal
        show={popup.show}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup({ show: false, title: "", message: "" })}
      />
      <h2 className="wishlist-title">Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888", fontSize: "1.1rem" }}>No items in wishlist.</p>
      ) : (
        <div className="wishlist-row">
          {wishlist.map((item) => (
            <div key={item.id} className="wishlist-card">
              <div className="wishlist-card-header">
                <span className="wishlist-category">{item.product.category?.name}</span>
                <button
                  className="wishlist-remove-btn"
                  title="Remove from Wishlist"
                  onClick={() => removeFromWishlist(item.product.id)}
                >
                  <svg width="22" height="22" fill="#fff" stroke="#f72585" strokeWidth="2" viewBox="0 0 20 20">
                    <path d="M10 18l-1.45-1.32C4.4 12.36 2 9.28 2 6.5 2 4.42 3.92 3 6 3c1.54 0 3.04.99 3.57 2.36h.87C10.96 3.99 12.46 3 14 3c2.08 0 4 1.42 4 3.5 0 2.78-2.4 5.86-6.55 10.18L10 18z"/>
                  </svg>
                </button>
              </div>
              <img
                src={`http://api.namits.shop${item.product.image}`}
                alt={item.product.title}
                className="wishlist-card-img"
              />
              <Link to={`/products/${item.product.id}`} className="wishlist-card-title">
                {item.product.title}
              </Link>
              <div className="wishlist-card-desc">{item.product.description?.slice(0, 60)}...</div>
              <div className="wishlist-card-price">
                ₹{item.product.price - (item.product.discount_price || 0)}
                {item.product.discount_price && (
                  <span className="wishlist-card-oldprice">₹{item.product.price}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;