import React, { useState, useEffect } from "react";
import api, { myBaseUrl } from "../axios";
import { FaStar } from "react-icons/fa";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "../styles/Products.css";
import { useCart } from "../CartContext";
import { useSearch } from "../SearchContext";
import { useWishlist } from "../Context/WishlistContext";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [filters, setFilters] = useState({
    category_id: "",
    min_price: "",
    max_price: "",
    min_rating: "",
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [currentPageUrl, setCurrentPageUrl] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // Use CartContext
  const { cartItems, addToCart, incrementQuantity, decrementQuantity } = useCart();
  // Use SearchContext
  const { searchQuery, setSearchQuery } = useSearch();
  const { wishlistIds, addToWishlist, removeFromWishlist } = useWishlist();

  const buildApiUrl = (baseUrl, filterSet, search = "") => {
    const params = new URLSearchParams();
    if (filterSet.category_id) params.append("category_id", filterSet.category_id);
    if (filterSet.min_price) params.append("min_price", filterSet.min_price);
    if (filterSet.max_price) params.append("max_price", filterSet.max_price);
    if (filterSet.min_rating) params.append("min_rating", filterSet.min_rating);
    if (search && search.trim() !== "") params.append("search", search);
    return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
  };

  // Read filters and search query from URL on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const updatedFilters = {
      category_id: params.get("category_id") || "",
      min_price: "",
      max_price: "",
      min_rating: "",
    };
    const search = params.get("search") || "";

    setFilters(updatedFilters);
    setAppliedFilters(updatedFilters);
    setSearchQuery(search);

    const url = buildApiUrl(`${myBaseUrl}products/`, updatedFilters, search);
    setCurrentPageUrl(url);
  }, [location.search, setSearchQuery]);

  // Update product list whenever filters or searchQuery change
  useEffect(() => {
    const url = buildApiUrl(`${myBaseUrl}products/`, appliedFilters, searchQuery);
    setCurrentPageUrl(url);
  }, [appliedFilters, searchQuery]);

  useEffect(() => {
    if (!currentPageUrl) return;
    const fetchProducts = async () => {
      try {
        const res = await api.get(currentPageUrl.replace(myBaseUrl, ""));
        setProducts(res.data.results);
        setNextPage(res.data.next);
        setPrevPage(res.data.previous);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [currentPageUrl]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories/");
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (location.search.includes("category_id")) {
      window.scrollTo({ top: 200, behavior: "smooth" });
    }
  }, [location.search]);

  // Filter handlers
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    const url = buildApiUrl(`${myBaseUrl}products/`, filters, searchQuery);
    setCurrentPageUrl(url);
  };

  const clearFilters = () => {
    const cleared = {
      category_id: "",
      min_price: "",
      max_price: "",
      min_rating: "",
    };
    setFilters(cleared);
    setAppliedFilters(cleared);
    const url = buildApiUrl(`${myBaseUrl}products/`, cleared, searchQuery);
    setCurrentPageUrl(url);
  };

  const handleNextPage = () => {
    if (nextPage) setCurrentPageUrl(nextPage);
  };

  const handlePrevPage = () => {
    if (prevPage) setCurrentPageUrl(prevPage);
  };

 return (
  <div className="container-fluid my-4">
    <div className="row" style={{ marginBottom: "2%" }}>
      
      {/* DESKTOP FILTER SIDEBAR */}
      <div className="col-md-3 d-none d-md-block">
        <div className="card p-3 mb-4">
          <h4>Filters</h4>

          <div className="mb-2">
            <label>Category</label>
            <select
              name="category_id"
              className="form-control category-select"
              value={filters.category_id}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label>Min Price</label>
            <input
              type="number"
              name="min_price"
              className="form-control"
              value={filters.min_price}
              onChange={handleFilterChange}
            />
          </div>

          <div className="mb-2">
            <label>Max Price</label>
            <input
              type="number"
              name="max_price"
              className="form-control"
              value={filters.max_price}
              onChange={handleFilterChange}
            />
          </div>

          <div className="mb-2">
            <label>Min Rating</label>
            <input
              type="number"
              min="1"
              max="5"
              name="min_rating"
              className="form-control"
              value={filters.min_rating}
              onChange={handleFilterChange}
            />
          </div>

          <button className="btn animated-btn filter-btn" onClick={applyFilters}>
            Apply Filters
          </button>
          <button
            className="btn animated-btn clear-btn"
            onClick={clearFilters}
            style={{ marginLeft: "5px" }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* MOBILE INLINE FILTER BAR */}
      <div className="mobile-filter-bar d-md-none d-flex justify-content-between align-items-center px-2 mb-3">
        <select
          name="category_id"
          className="form-control category-select"
          value={filters.category_id}
          onChange={handleFilterChange}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <button className="btn btn-sm mx-1" onClick={applyFilters} style={{ backgroundColor: "#f0ad4e", color: "white" }}>
          Apply
        </button>

        <button
          className="btn btn-sm btn-outline-dark"
          onClick={() =>
            document.getElementById("mobileFilterPanel").classList.toggle("show")
          } 
          style={{ backgroundColor: "#f0ad4e", color: "white" }}
        >
          More
        </button>
      </div>

      {/* MOBILE DROPDOWN FILTER PANEL */}
      <div id="mobileFilterPanel" className="offcanvas-filter d-md-none">
        <div className="card p-3 mb-4 position-relative">
          <div className="d-flex justify-content-between align-items-center mb-3">
  <h4 className="mb-0">More Filters</h4>
  <button
    className="btn btn-sm btn-outline-danger"
    style={{ lineHeight: "1", padding: "0 8px", border: "none", fontWeight: "bold", fontSize: "1.5rem" }}
    onClick={() =>
      document.getElementById("mobileFilterPanel").classList.remove("show")
    }
  >
    &times;
  </button>
</div>

          <div className="mb-2">
            <label>Min Price</label>
            <input
              type="number"
              name="min_price"
              className="form-control"
              value={filters.min_price}
              onChange={handleFilterChange}
            />
          </div>

          <div className="mb-2">
            <label>Max Price</label>
            <input
              type="number"
              name="max_price"
              className="form-control"
              value={filters.max_price}
              onChange={handleFilterChange}
            />
          </div>

          <div className="mb-2">
            <label>Min Rating</label>
            <input
              type="number"
              min="1"
              max="5"
              name="min_rating"
              className="form-control"
              value={filters.min_rating}
              onChange={handleFilterChange}
            />
          </div>

          <button
            className="btn filter-btn mb-2"
            onClick={() => {
              applyFilters();
              document.getElementById("mobileFilterPanel").classList.remove("show");
            }}
          >
            Apply Filters
          </button>
          <button
            className="btn clear-btn"
            onClick={() => {
              clearFilters();
              document.getElementById("mobileFilterPanel").classList.remove("show");
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* PRODUCT LIST COLUMN */}
      <div className="col-md-9">
        {searchQuery && (
          <h4 className="mb-3">
            Results for: <strong>{searchQuery}</strong>
          </h4>
        )}

        {products.length === 0 && (
          <div className="alert alert-warning">No products found.</div>
        )}

        <div className="product-grid">
          {products.map((product) => (
            <div className="card" key={product.id}>
              <div style={{ position: "relative", width: "100%" }}>
                <img src={product.image} alt={product.title} />

                {product.stock === 0 && (
                  <div className="card-badge out-of-stock">Out of Stock</div>
                )}
                {product.discount_price > 0 && (
                  <div className="card-badge sale">Sale</div>
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

              <div className="card-body">
                <Link to={`/products/${product.id}`} className="product-title">
                  {product.title}
                </Link>
                <h6>{product.description}</h6>

                <div className="product-rating">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      color={
                        index < Math.round(product.avg_rating || 0)
                          ? "#FFD700"
                          : "#e4e5e9"
                      }
                    />
                  ))}
                  <span style={{ marginLeft: "8px" }}>
                    {product.avg_rating
                      ? product.avg_rating.toFixed(1)
                      : "No rating"}
                  </span>
                </div>

                <p className="mt-2" style={{ fontSize: "18px", fontWeight: "bold" }}>
                  ₹{product.price - (product.discount_price || 0)}
                  {product.discount_price && (
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "red",
                        marginLeft: "10px",
                        fontSize: "14px",
                      }}
                    >
                      ₹{product.price}
                    </span>
                  )}
                </p>

                {cartItems[product.id] ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      onClick={() => decrementQuantity(product.id)}
                      style={{
                        backgroundColor: "rgb(235, 211, 52)",
                        border: "none",
                        padding: "4px 8px",
                      }}
                    >
                      -
                    </button>
                    <span style={{ margin: "0 10px" }}>
                      {cartItems[product.id].quantity}
                    </span>
                    <button
                      onClick={() => incrementQuantity(product.id)}
                      style={{
                        backgroundColor: "rgb(235, 211, 52)",
                        border: "none",
                        padding: "4px 8px",
                      }}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    className="addtocart btn animated-btn"
                    style={{
                      backgroundColor: "rgb(235, 211, 52)",
                      padding: "10px 4%",
                    }}
                    onClick={() => addToCart(product.id)}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="d-flex justify-content-between mt-3">
          <button
            className="btn prev-next-btn animated-btn"
            onClick={handlePrevPage}
            disabled={!prevPage}
          >
            Previous
          </button>
          <button
            className="btn prev-next-btn animated-btn"
            onClick={handleNextPage}
            disabled={!nextPage}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
);
};

export default ProductsPage;