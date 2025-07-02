import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../styles/TopProductCard.css";
import { useCart } from "../CartContext";
import { useWishlist } from "../Context/WishlistContext";
import { Link } from "react-router-dom";

const TopProductCard = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { cartItems, addToCart, incrementQuantity, decrementQuantity } = useCart();
  const { wishlistIds, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://api.namits.shop/products/top-rated/");
        const data = await res.json();
        setProducts(data.slice(0, 12));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="top-products-section">
      <h2 className="top-products-title">Top Products</h2>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          480: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
      >
        {(isLoading ? Array.from({ length: 4 }) : products).map((product, index) => (
          <SwiperSlide key={index}>
            <div className="top-product-card">
              {isLoading ? (
                <>
                  <div className="top-product-image skeleton"></div>
                  <h3 className="top-product-name skeleton-text">Loading...</h3>
                  <p className="top-product-price skeleton-text">Loading...</p>
                  <button className="top-product-button skeleton-button" disabled>
                    Loading...
                  </button>
                </>
              ) : (
                <>
                  <div className="top-product-image-wrapper">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="top-product-image"
                      />
                    ) : (
                      <div className="top-product-image no-image">No Image</div>
                    )}
                    <button
                      className="wishlist-btn"
                      onClick={() =>
                        wishlistIds.includes(product.id)
                          ? removeFromWishlist(product.id)
                          : addToWishlist(product.id)
                      }
                    >
                      <svg
                        width="24"
                        height="24"
                        fill={wishlistIds.includes(product.id) ? "red" : "white"}
                        stroke="red"
                        strokeWidth="2"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 18l-1.45-1.32C4.4 12.36 2 9.28 2 6.5 2 4.42 3.92 3 6 3c1.54 0 3.04.99 3.57 2.36h.87C10.96 3.99 12.46 3 14 3c2.08 0 4 1.42 4 3.5 0 2.78-2.4 5.86-6.55 10.18L10 18z" />
                      </svg>
                    </button>
                  </div>

                  <Link to={`/products/${product.id}`} style={{ textDecoration: "none" }}>
                    <h3 className="top-product-name">{product.title}</h3>
                  </Link>

                   <p className="top-product-price" style={{color:"green"}}>
                    ₹{product.price - (product.discount_price || 0)}
                  </p>
                  {product.discount_price && (
                    <p className="top-product-original-price" style={{color:"red"}}>₹{product.price}</p>
                  )}

                  {cartItems[product.id] ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "0.5rem" }}>
                      <button
                        onClick={() => decrementQuantity(product.id)}
                        style={{
                          backgroundColor: "rgb(52, 95, 235)",
                          border: "none",
                          padding: "4px 8px",
                          color: "white",
                          borderRadius: "4px"
                        }}
                      >
                        -
                      </button>
                      <span>{cartItems[product.id].quantity}</span>
                      <button
                        onClick={() => incrementQuantity(product.id)}
                        style={{
                          backgroundColor: "rgb(52, 95, 235)",
                          border: "none",
                          padding: "4px 8px",
                          color: "white",
                          borderRadius: "4px"
                        }}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "0.5rem" }}>
                      <button
                        className="btn animated-btn"
                        style={{
                          backgroundColor: "rgb(52, 95, 235)",
                          color: "white",
                          padding: "10px 4%",
                          width: "8rem",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                        onClick={() => addToCart(product.id)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default TopProductCard;
