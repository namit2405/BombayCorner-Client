import React, { useState, useEffect } from 'react';
import api from '../axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import "../styles/ProductsByCategories.css";
import { useCart } from "../CartContext";

const CategoryProductShowcase = ({ selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, addToCart, incrementQuantity, decrementQuantity } = useCart();


  // Sync selectedCategory from props to state
  useEffect(() => {
  if (!selectedCategory || categories.length === 0) return;

  const matchedCategory = categories.find(
    (category) =>
      category.name.toLowerCase() === selectedCategory.toLowerCase()
  );

  if (matchedCategory && activeCategory !== matchedCategory.name) {
    // Update after slight delay to avoid race with rendering
    setTimeout(() => {
      setActiveCategory(matchedCategory.name);
    }, 100); // small delay to allow state syncing
  }
}, [selectedCategory, categories]);


  // Fetch categories
  useEffect(() => {
    api.get('/categories/')
      .then(res => setCategories(res.data.slice(0, 8)))
      .catch(err => console.error(err));
  }, []);

  // Fetch products based on active category
  useEffect(() => {
  const fetchProducts = async () => {
    setLoading(true);
    try {
      if (activeCategory === "All") {
        // fetch all categories
        let allProducts = [];
        for (const category of categories) {
          const res = await api.get(
            `/products/categories/${category.id}/`
          );
          allProducts = [...allProducts, ...res.data];
        }
        const shuffled = allProducts.sort(() => 0.5 - Math.random());
        setProducts(shuffled.slice(0, 8));
      } else {
        const category = categories.find((c) => c.name === activeCategory);
        if (category) {
          const res = await api.get(
            `/products/categories/${category.id}/`
          );
          setProducts(res.data.slice(0, 8));
        }
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // 💡 Only run if activeCategory is valid
  if (activeCategory && categories.length > 0) {
    fetchProducts();
  }
}, [activeCategory, categories]);

useEffect(() => {
  if (location.search.includes("category_id")) {
    window.scrollTo({ top: 200, behavior: "smooth" });
  }
}, [location.search]);

  return (
    <div className="container my-4 categories-section">
      <h2 className="categories-title">Shop by Category</h2>

      <div className="category-buttons">
        <button
          className={activeCategory === 'All' ? 'active' : ''}
          onClick={() => setActiveCategory('All')}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            className={activeCategory === category.name ? 'active' : ''}
            onClick={() => setActiveCategory(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>
      {loading ? (
  <div className="text-center my-4">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
) : (
      <div className="category-products">
        {products.map(product => (
          <div key={product.id} className="product-card">
           <div className="image-wrapper">
            <img src={product.image} alt={product.name} />
            </div>
            <div className="card-content">
            <h5 >{product.title}</h5>
            <p className='description'>{product.description}</p>
            <p className="price">₹{product.price - product.discount_price}</p>
            {product.original_price && (
              <p className="original-price">₹{product.original_price}</p>
            )}
            </div>
            <div className="card-buttons">
              <Link to={`/products/${product.id}`} style={{textDecoration:"none"}}>
              <button
                className="view-all-btn btn btn-primary btn-sm"
              >
                View Product
              </button>
              </Link>

              {cartItems[product.id] ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button
                    onClick={() => decrementQuantity(product.id)}
                    style={{ backgroundColor: " #263238", border: "none", padding: "4px 8px", color:"white" }}
                  >
                    -
                  </button>
                  <span style={{ margin: "0 10px" }}>
                    {cartItems[product.id].quantity}
                  </span>
                  <button
                    onClick={() => incrementQuantity(product.id)}
                    style={{ backgroundColor: " #263238", border: "none", padding: "4px 8px", color:"white" }}
                  >
                    +
                  </button>
                </div>
              ) : (
                <Link style={{textDecoration:"none"}}>
                <button
                className="view-all-btn btn"
                  onClick={() => addToCart(product.id)}
                >
                  Add cart
                </button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
      )}

      {activeCategory !== 'All' && (
        <div className="text-center mt-3">
          <button
            className="btn btn-sm view-all-btn"
            onClick={() =>
              navigate(`/products?category_id=${categories.find(c => c.name === activeCategory)?.id}`)
            }
          >
            View All Products
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryProductShowcase;
