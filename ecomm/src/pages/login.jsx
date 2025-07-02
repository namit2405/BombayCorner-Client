import React, { useState } from 'react';
import axios from "../axios"
import { Link, useNavigate } from 'react-router-dom';
import Loader from "../elements/Loader";
import PopupModal from '../elements/PopUp';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({ show: false, title: "", message: "", onClose: null });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("login/", {
                username,
                password,
            });
            const token = response.data.token
            localStorage.setItem("token", token)
            localStorage.setItem("username", username)
            console.log("Token saved:", token)
            setUsername("")
            setPassword("")
            setModal({
                show: true,
                title: "Login Successful!",
                message: "Welcome back!",
                onClose: () => {
                    setModal({ ...modal, show: false });
            navigate("/")
        } 
            });
        } catch (error) {
      let message = "Signup failed! Please check your details.";
      if (error.response) {
        // Backend returned an error response
        if (error.response.data) {
          if (typeof error.response.data === "string") {
            message = error.response.data;
          } else if (error.response.data.detail) {
            message = error.response.data.detail;
          } else if (typeof error.response.data === "object") {
            // Show first error from validation errors
            const firstKey = Object.keys(error.response.data)[0];
            if (firstKey) {
              message = `${firstKey}: ${error.response.data[firstKey]}`;
            }
          }
        }
      } else if (error.request) {
        // No response from server
        message = "No response from server. Please try again later.";
      } else {
        // Other errors
        message = error.message;
      }
      setModal({
        show: true,
        title: "Signup Failed",
        message,
        onClose: () => setModal({ ...modal, show: false })
      });
      console.error("Signup error: ", error.response?.data || error.message)   
    } finally {
            setLoading(false); // Stop loading
        }
    };

    // Custom styles for the login card
    const cardStyle = {
        maxWidth: '400px',
        margin: '60px auto',
        padding: '32px 24px',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(4px)',
    };

    const inputStyle = {
        borderRadius: '8px',
        fontSize: '1.1rem',
        padding: '10px 12px',
    };

    const btnStyle = {
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        padding: '10px 0',
        width: '100%',
        background: 'linear-gradient(90deg, #007bff 0%, #0056b3 100%)',
        border: 'none',
        boxShadow: '0 2px 8px rgba(0,123,255,0.15)',
    };

    const linkStyle = {
        display: 'block',
        marginTop: '18px',
        textAlign: 'center',
        color: '#007bff',
        textDecoration: 'none',
        fontWeight: '500',
    };

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", background: "linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)" }}>
             <PopupModal {...modal} />
            <div style={cardStyle}>
                <h2 className="mb-4 text-center" style={{ fontWeight: 700, letterSpacing: 1 }}>Login</h2>
                 {loading ? (
                    <Loader />
                ) : (
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            className="form-control"
                            style={inputStyle}
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="form-control"
                            style={inputStyle}
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-2" style={btnStyle}>
                        Login
                    </button>
                </form>
                )}
                {/* <Link to="/forgot-password" style={linkStyle}> */}
                <Link to="/signup" style={linkStyle}>
                    Don't have an account? <span style={{ textDecoration: "underline" }}>Create a new one</span>
                </Link>
            </div>
        </div>
    );
};

export default Login;