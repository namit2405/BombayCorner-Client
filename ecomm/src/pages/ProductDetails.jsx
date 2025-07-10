import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import Footer from '../elements/Footer';
import '../styles/ProductDetails.css';
import { useCart } from "../CartContext";
import { useWishlist } from "../Context/WishlistContext";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { wishlistIds, addToWishlist, removeFromWishlist } = useWishlist();
  

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  // Use CartContext
  const { cartItems, addToCart, incrementQuantity, decrementQuantity } = useCart();

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}/`);
        setProduct(res.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch related products
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await api.get('/products/');
        const related = res.data.results.filter(
          (p) => p.category.id === product?.category.id && p.id !== product.id
        );
        setRelatedProducts(related);
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };
    if (product) fetchRelated();
  }, [product]);

  // Fetch reviews for the product
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get(`/reviews/?product=${id}`);
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, [id]);

  const submitReview = async () => {
    if (!newRating || !newComment) {
      alert("Please enter both rating and comment!");
      return;
    }
    try {
      await api.post(
        "/reviews/",
        { product_id: id, rating: newRating, comment: newComment },
        { headers: { Authorization: `Token ${localStorage.getItem("token")}` } }
      );
      setNewRating(0);
      setNewComment("");
      // Refresh reviews
      const res = await api.get(`/reviews/?product=${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Error submitting review:", err);
      if (err.response?.status === 401) {
        alert("Please login to post a review!");
        navigate("/login");
      }
    }
  };

  if (!product) return <p>Loading product details...</p>;

  return (
    <div className="product-container">
      <div className="product-details">
        <div className="product-image">
  <img src={product.image} alt={product.title} />
  
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
        <div className="product-info">
          <h2 className="product-title">{product.title}</h2>
          <p className="product-desc">{product.description}</p>
          <div className="price-row">
            {product.discount_price ? (
              <>
                <span className="price-strikethrough">₹{product.price}</span>
                <span className="discounted-price">₹{product.price - product.discount_price}</span>
                <span className="discount-badge">
                  {Math.round((product.discount_price / product.price) * 100)}% OFF
                </span>
              </>
            ) : (
              <span className="discounted-price">₹{product.price}</span>
            )}
          </div>
          <div className={`stock-status${product.quantity > 0 ? '' : ' out'}`}>
            {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
          </div>
          <div className="product-meta">
            <span>Category: {product.category.name}</span>
          </div>
          {cartItems[product.id] ? (
            <div className="quantity-controls">
              <button onClick={() => decrementQuantity(product.id)}>-</button>
              <span>{cartItems[product.id].quantity}</span>
              <button onClick={() => incrementQuantity(product.id)}>+</button>
            </div>
          ) : (
            <button className="add-to-cart-btn" disabled={product.quantity <= 0} onClick={() => addToCart(product.id)}>
              {product.quantity <= 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          )}
        </div>
      </div>

      {/* You May Also Like */}
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h3>You May Also Like</h3>
          <Swiper
            slidesPerView={1}
            spaceBetween={10}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 10 },
              768: { slidesPerView: 3, spaceBetween: 15 },
              1024: { slidesPerView: 4, spaceBetween: 20 },
            }}
            modules={[Pagination]}
            className="related-swiper"
          >
            {relatedProducts.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="related-card related-item">
                  <Link to={`/products/${item.id}`} className="related-link">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="related-item-img"
                    />
                    <div className="related-item-title">{item.title}</div>
                    <div className="related-item-price">
                      {item.discount_price
                        ? <>
                            <span className="price-strikethrough">₹{item.price}</span>
                            <span className="discounted-price">₹{item.price - item.discount_price}</span>
                          </>
                        : <span className="discounted-price">₹{item.price}</span>
                      }
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Customer Reviews */}
      <div className="review-section">
        <h3>Customer Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <ul className="review-list">
            {reviews.map((review) => (
              <li className="review-item" key={review.id}>
                <div className="review-avatar">
                  {review.user.username.charAt(0).toUpperCase()}
                </div>
                <div className="review-content">
                  <div className="review-rating">
                    Rating: {review.rating}
                    <span className="review-stars">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </span>
                  </div>
                  <div className="review-comment">{review.comment}</div>
                  <div className="review-user">
                    By: {review.user.username}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Submit New Review */}
        {localStorage.getItem("token") && (
          <form className="review-form" onSubmit={e => { e.preventDefault(); submitReview(); }}>
            <h4>Leave a Review</h4>
            <div className="review-form-group">
              <label>
                Rating:
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(parseInt(e.target.value))}
                >
                  <option value={0}>Select</option>
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="review-form-group">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                placeholder="Write your review here..."
              ></textarea>
            </div>
            <button className="submit-review-btn" type="submit">
              Submit Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
export default ProductDetailPage;