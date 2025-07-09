import React from "react";
import Home from "./pages/home";
import Signup from "./pages/signup";
import Login from "./pages/login";
import NavBar from "./elements/NavBar";
import ProductsPage from "./pages/Prdoucts";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CartPage from "./pages/CartPage";
import OrderHistoryPage from "./pages/OrderHistory";
import OrderStatusPage from './pages/OrderStatus';
import ProductDetailPage from "./pages/ProductDetails";
import WishlistPage from "./pages/Wishlist";
import ViewProfile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Footer from "./elements/Footer";
import CustomerServicePage from "./pages/Help";
import { Routes, Route } from "react-router-dom";
import { useCart } from "./CartContext";
import ScrollToTop from "./elements/ScrollToTop";

const App = () => {
  const { cartItems } = useCart();
  const cartItemCount = Object.keys(cartItems).length;

  return (
    <div>
      <NavBar cartItemCount={cartItemCount} />
        <ScrollToTop />
      <div className="container-fluid px-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order/history" element={<OrderHistoryPage />} />
          <Route path="/orders/:orderId" element={<OrderStatusPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/profile" element={<ViewProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/help" element={<CustomerServicePage />} />
          <Route path="*" element={<h1 className="text-center">404 Not Found</h1>} />
        </Routes>
      </div>
      <Footer/>
    </div>
  );
};

export default App;