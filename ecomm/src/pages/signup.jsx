import React, { useState } from 'react';
import axios from '../axios';
import { Link, useNavigate } from 'react-router-dom';
import Loader from "../elements/Loader";
import PopupModal from '../elements/PopUp';

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [modal, setModal] = useState({ show: false, title: "", message: "", onClose: null });
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const navigate = useNavigate();

  const showModal = (title, message, onClose = () => setModal({ ...modal, show: false })) => {
    setModal({ show: true, title, message, onClose });
  };

  // Handle actual signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("signup/", { username, email, password });
      setModal({
        show: true,
        title: "Signup Successful!",
        message: "Your account has been created. Please login.",
        onClose: () => { setModal({ ...modal, show: false }); navigate("/login"); }
      });
    } catch (error) {
      let message = "Signup failed! Please check your details.";
      if (error.response) {
        const data = error.response.data;
        if (typeof data === "object") {
          const key = Object.keys(data)[0];
          message = `${key}: ${data[key]}`;
        } else message = data.detail || data;
      }
      setModal({ show: true, title: "Signup Failed", message, onClose: () => setModal({ ...modal, show: false }) });
    } finally {
      setLoading(false);
    }
  };

  // Send OTP to email
  const handleSendOtp = async () => {
    if (!email) {
      showModal("Invalid Email", "Please enter a valid email address.");
      return;
    }
    setSendingOtp(true);
    try {
      await axios.post("send-otp/", { email });
      setOtpSent(true);
      showModal("OTP Sent", "Please check your email for the verification code.");
    } catch {
      showModal("Error", error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setSendingOtp(false);
    }
  };

  // Verify entered OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      showModal("No OTP","Enter the OTP sent to your email.");
      return;
    }
    try {
      const res = await axios.post("verify-otp/", { email, otp });
      if (res.data.verified) {
        setEmailVerified(true);
        showModal("Verified", "Email verified successfully.");
      }
    } catch {
      showModal("Invalid OTP", "The OTP you entered is incorrect.");
    }
  };

  // Styles
  const cardStyle = { maxWidth: '420px', margin: '60px auto', padding: '36px 28px', borderRadius: '18px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(4px)' };
  const inputStyle = { borderRadius: '8px', fontSize: '1.1rem', padding: '10px 12px' };
  const btnStyle = { borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', padding: '10px 0', width: '100%', background: 'linear-gradient(90deg, #28a745 0%, #218838 100%)', border: 'none', boxShadow: '0 2px 8px rgba(40,167,69,0.15)' };
  const linkStyle = { display: 'block', marginTop: '18px', textAlign: 'center', color: '#28a745', textDecoration: 'none', fontWeight: '500' };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", background: "linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)" }}>
      <PopupModal {...modal} />
      <div style={cardStyle}>
        <h2 className="mb-4 text-center" style={{ fontWeight: 700, letterSpacing: 1 }}>Create Account</h2>
        {loading ? <Loader /> : (
          <form onSubmit={handleSignup}>
            <div className="mb-3">
              <label className="form-label" htmlFor="username">Username</label>
              <input id="username" type="text" className="form-control" style={inputStyle} value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="email">Email</label>
              <div className="d-flex gap-2">
                <input id="email" type="email" className="form-control" style={inputStyle} value={email} onChange={e => { setEmail(e.target.value); setEmailVerified(false); }} required disabled={emailVerified} />
                <button type="button" className="btn btn-outline-primary" onClick={handleSendOtp} disabled={sendingOtp || emailVerified}>
                  {emailVerified ? "Verified" : sendingOtp ? "Sending..." : "Verify"}
                </button>
              </div>
            </div>

            {otpSent && !emailVerified && (
              <div className="mb-3">
                <label className="form-label" htmlFor="otp">Enter OTP</label>
                <div className="d-flex gap-2">
                  <input id="otp" type="text" className="form-control" style={inputStyle} value={otp} onChange={e => setOtp(e.target.value)} placeholder="6-digit OTP" />
                  <button type="button" className="btn btn-outline-success" onClick={handleVerifyOtp}>Verify OTP</button>
                </div>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label" htmlFor="password">Password</label>
              <input id="password" type="password" className="form-control" style={inputStyle} value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <button type="submit" className="btn btn-success mt-2" style={btnStyle} disabled={!emailVerified}>
              Signup
            </button>
          </form>
        )}
        <Link to="/login" style={linkStyle}>
          Already have an account? <span style={{ textDecoration: "underline" }}>Login</span>
        </Link>
      </div>
    </div>
  );
};

export default Signup;
