import React from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CartProvider } from "./CartContext";
import { SearchProvider } from "./SearchContext";
import { WishlistProvider } from "./Context/WishlistContext";


import './index.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <CartProvider>
    <SearchProvider>
      <WishlistProvider>
        <App />
      </WishlistProvider>
    </SearchProvider>
  </CartProvider>
  </BrowserRouter>
)