import React, { createContext, useContext, useEffect, useState } from "react";
import api from "./axios";
import { useNavigate } from "react-router-dom";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch cart from backend
  const fetchCart = async () => {
   if (!token) {
      // navigate("/login");
      setCartItems({});
      return;
    }
    try {
      const res = await api.get("/cart/", {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      });
      const items = res.data.items || [];
      const newCartItems = {};
      items.forEach((item) => {
        newCartItems[item.product.id] = { id: item.id, quantity: item.quantity };
      });
      setCartItems(newCartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
    // Optionally, listen for cart updates globally
    const handler = () => fetchCart();
    window.addEventListener("cartUpdated", handler);
    return () => window.removeEventListener("cartUpdated", handler);
  }, []);

  // Add to cart
  const addToCart = async (productId) => {
   if (!token) {
      navigate("/login");
      return;
    }
    try {
      const res = await api.post(
        "/cart/add/",
        { product_id: productId, quantity: 1 },
        { headers: { Authorization: `Token ${localStorage.getItem("token")}` } }
      );
      const newCartItem = res.data.cart_item;
      setCartItems((prev) => ({
        ...prev,
        [productId]: { id: newCartItem.id, quantity: newCartItem.quantity },
      }));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  // Increment quantity
  const incrementQuantity = async (productId) => {
   if (!token) {
      navigate("/login");
      return;
    }
    const newQuantity = (cartItems[productId]?.quantity || 0) + 1;
    try {
      await api.post(
        "/cart/add/",
        { product_id: productId, quantity: 1 },
        { headers: { Authorization: `Token ${localStorage.getItem("token")}` } }
      );
      setCartItems((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], quantity: newQuantity },
      }));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error incrementing quantity:", error);
    }
  };

  // Decrement quantity
  const decrementQuantity = async (productId) => {
   if (!token) {
      navigate("/login");
      return;
    }
    const newQuantity = (cartItems[productId]?.quantity || 1) - 1;
    if (newQuantity === 0) {
      try {
        await api.delete(
          `/cart/remove/${cartItems[productId].id}/`,
          { headers: { Authorization: `Token ${localStorage.getItem("token")}` } }
        );
        setCartItems((prev) => {
          const updated = { ...prev };
          delete updated[productId];
          return updated;
        });
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (error) {
        console.error("Error removing item:", error);
      }
    } else {
      try {
        await api.put(
          `/cart/update/${cartItems[productId].id}/`,
          { quantity: newQuantity },
          { headers: { Authorization: `Token ${localStorage.getItem("token")}` } }
        );
        setCartItems((prev) => ({
          ...prev,
          [productId]: { ...prev[productId], quantity: newQuantity },
        }));
      } catch (error) {
        console.error("Error decrementing quantity:", error);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        incrementQuantity,
        decrementQuantity,
        fetchCart,
        setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};