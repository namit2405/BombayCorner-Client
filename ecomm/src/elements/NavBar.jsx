import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import UserProfile from "./UserrProfile";
import SearchBar from "./SearchBar";
import "../styles/NavBar.css"; 
import MenuBar from "./MenuBar"; // Assuming you have a MenuBar component
import Hamburger from 'hamburger-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faShoppingCart } from '@fortawesome/free-solid-svg-icons'

const NavBar = ({ cartItemCount }) => {
  const [isOpen, setOpen] = useState(false)
  const navigate = useNavigate();

  const handleSearch = (query) => {
    if (!query || query.trim() === "") {
      navigate("/products");
    } else {
      navigate(`/products?search=${encodeURIComponent(query)}`);
    }
  };
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

useEffect(() => {
  const handleResize = () => setWindowWidth(window.innerWidth);
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

const [showHomeTip, setShowHomeTip] = useState(() => {
  return localStorage.getItem("homeTipShown") !== "true";
});



  return (
    <>
    <nav className="navbar navbar-dark bg-dark fixed-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/" title="Click to go Home">
        <span className="brand-text">Bombay Corner</span>
        </Link>

        <div className="searchbar-container">
          <SearchBar onSearch={handleSearch} />
        </div>

        {
        !localStorage.getItem("token") ? (
          <div className="d-lg-none">
            <Link to="/login" className="btn btn-outline-light ms-2 user-login-btn">
              Login
            </Link>
          </div>
        ) : (
          <div className="hamburger-container d-lg-none">
            <Hamburger toggled={isOpen} toggle={setOpen} />
          </div>
        )
      }

        <div className="align-items-center gap-3 userprofile">
          <UserProfile />

          <div className="cart position-relative">
            <Link className="button" to="/cart">
              <svg
                className="icon"
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {/* 🔴 Cart badge */}
              {cartItemCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.7rem" }}
                >
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>

          <Link to="/wishlist" className="btn" title="View Wishlist">
  <svg
    className="icon"
    xmlns="http://www.w3.org/2000/svg"
    width="20.503"
    height="20.625"
    viewBox="0 0 17.503 15.625"
  >
    <path
      id="Fill"
      d="M8.752,15.625h0L1.383,8.162a4.824,4.824,0,0,1,0-6.762,4.679,4.679,0,0,1,6.674,0l.694.7.694-.7a4.678,4.678,0,0,1,6.675,0,4.825,4.825,0,0,1,0,6.762L8.752,15.624ZM4.72,1.25A3.442,3.442,0,0,0,2.277,2.275a3.562,3.562,0,0,0,0,5l6.475,6.556,6.475-6.556a3.563,3.563,0,0,0,0-5A3.443,3.443,0,0,0,12.786,1.25h-.01a3.415,3.415,0,0,0-2.443,1.038L8.752,3.9,7.164,2.275A3.442,3.442,0,0,0,4.72,1.25Z"
      transform="translate(0 0)"
    ></path>
  </svg>
</Link>

          <Link to='/help' className="tooltip-container">
            <button aria-describedby="help-tooltip" className="help-button">
              Need Help?
            </button>
          </Link>
        </div>
      </div>
    </nav>
    <div>
{windowWidth > 991 ? (
  <MenuBar />
) : (
  <>
  <div className={`mobile-menu-overlay ${isOpen ? "active" : ""}`} onClick={() => setOpen(false)}></div>
  <div className={`mobile-menu-drawer ${isOpen ? "active" : ""}`}>
    <div className="mobile-menu-header">Menu</div>

    <div className="mobile-user">
      <i className="fas fa-user-circle"></i> <UserProfile />
    </div> <hr />

    <div className="mobile-icons">
      <Link to="/cart" className="menu-icon">
        <FontAwesomeIcon icon={faShoppingCart} />
        Cart {cartItemCount > 0 && <span>({cartItemCount})</span>}
      </Link>
      <Link to="/wishlist" className="menu-icon">
        <FontAwesomeIcon icon={faHeart} />
        Wishlist
      </Link>
    </div> <hr />

    <div style={{ marginBottom: "20px" }}>
      Need Help?
    </div>

    <MenuBar closeMenu={() => setOpen(false)} />
  </div>
</>
)}

    </div>

    {showHomeTip && (
  <div className="home-tip-banner">
    🏠 Tip: Click on <strong>Bombay Corner</strong> to go Home!
    <button 
      onClick={() => {
        setShowHomeTip(false);
        localStorage.setItem("homeTipShown", "true");
      }}
      style={{
        marginLeft: "10px",
        background: "#f0ad4e",
        border: "none",
        padding: "4px 10px",
        borderRadius: "5px",
        color: "white",
        fontSize: "0.9rem"
      }}
    >
      Got it
    </button>
  </div>
)}

    </>
  );
};

export default NavBar;
