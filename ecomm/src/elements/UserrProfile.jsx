import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/UserrProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!token) {
    return (
      <Link
        to="/login"
        className="btn btn-outline-light ms-3 user-login-btn"
      >
        Login
      </Link>
    );
  }

  return (
    <div className="dropdown ms-lg-3 user-dropdown">
      <button
        className="btn btn-outline-light dropdown-toggle user-dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <span className="user-name">
          {username
            ? (() => {
                const atIdx = username.indexOf("@");
                const namePart = atIdx !== -1 ? username.slice(0, atIdx) : username;
                return namePart.length > 8 ? namePart.slice(0, 8) + "..." : namePart;
              })()
            : "Profile"}
        </span>
      </button>
      <ul className="dropdown-menu dropdown-menu-end animate__animated animate__fadeIn user-dropdown-menu">
        <li>
          <Link className="dropdown-item" to="/profile">
            <i className="fas fa-user-circle me-2"></i> View Profile
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" to="/edit-profile">
            <i className="fas fa-edit me-2"></i> Edit Profile
          </Link>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <button className="dropdown-item text-danger" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt me-2"></i> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserProfile;