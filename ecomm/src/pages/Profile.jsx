import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Profile.css";
import api, { myBaseUrl } from "../axios";

const ViewProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from API on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Replace with your actual API endpoint and auth if needed
        const token = localStorage.getItem("token");
        const res = await api.get("/user/profile/", {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div className="profile-view-container"><div className="profile-card">Loading...</div></div>;
  }

  if (!user) {
    return <div className="profile-view-container"><div className="profile-card">Could not load profile.</div></div>;
  }

  return (
    <div className="profile-view-container">
      <div className="profile-card">
        <div className="profile-photo-section">
          {user.image ? (
            <img src={`${myBaseUrl}${user.image}`} alt="Profile" className="profile-photo" />
          ) : (
            <div className="profile-photo-placeholder">
              <i className="fas fa-user"></i>
            </div>
          )}
        </div>
        <div className="profile-info-section">
          <h2>{user.username || <span className="missing">Not set</span>}</h2>
          <div className="profile-info-row">
            <span className="label">Contact Number:</span>
            <span>
              {user.phone ? (
                user.phone
              ) : (
                <Link to="/edit-profile" className="fill-link">Fill Now</Link>
              )}
            </span>
          </div>
          <div className="profile-info-row">
            <span className="label">Date of Birth:</span>
            <span>
              {user.dob ? (
                user.dob
              ) : (
                <Link to="/edit-profile" className="fill-link">Fill Now</Link>
              )}
            </span>
          </div>
          <div className="profile-info-row">
            <span className="label">Address:</span>
            <span>
              {user.street ? (
                user.street + ", " + user.city + ", " + user.state + ", " + user.pincode
              ) : (
                <Link to="/edit-profile" className="fill-link">Fill Now</Link>
              )}
            </span>
          </div>
          <div className="profile-info-row">
            <span className="label">Email:</span>
            <span>
              {user.email ? (
                user.email
              ) : (
                <Link to="/edit-profile" className="fill-link">Fill Now</Link>
              )}
            </span>
          </div>
          <div className="edit-profile-btn-row">
            <Link to="/edit-profile" className="edit-profile-btn">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;