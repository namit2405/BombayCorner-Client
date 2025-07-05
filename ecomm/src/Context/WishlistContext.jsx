import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../axios";
import { useNavigate } from "react-router-dom";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
   const navigate = useNavigate();
   const token = localStorage.getItem("token");

  // Define fetchWishlist at the top level
  const fetchWishlist = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const res = await api.get("/wishlist/", {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      });
      setWishlist(res.data);
      setWishlistIds(res.data.map(item => item.product.id));
    } catch {
      setWishlist([]);
      setWishlistIds([]);
    }
  };

  // Fetch wishlist on mount
  useEffect(() => {
    fetchWishlist();
  }, []);

  // Add to wishlist
  const addToWishlist = async (productId) => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await api.post(
        "/wishlist/",
        { product_id: productId },
        { headers: { Authorization: `Token ${localStorage.getItem("token")}` } }
      );
      fetchWishlist();
    } catch (error) {
      // handle error as needed
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const res = await api.get("/wishlist/", {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      });
      const item = res.data.find(item => item.product.id === productId);
      if (item) {
        await api.delete(
          `/wishlist/${item.id}/`,
          { headers: { Authorization: `Token ${localStorage.getItem("token")}` } }
        );
        fetchWishlist();
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  return (
  <WishlistContext.Provider value={{ wishlist, wishlistIds, addToWishlist, removeFromWishlist, fetchWishlist }}>
    {children}
  </WishlistContext.Provider>
);
};