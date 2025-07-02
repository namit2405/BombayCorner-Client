import React from "react";

const overlayStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(0,0,0,0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalStyle = {
  background: "#fff",
  borderRadius: "16px",
  padding: "32px 24px",
  minWidth: "320px",
  maxWidth: "90vw",
  boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
  textAlign: "center",
};

const buttonStyle = {
  marginTop: "24px",
  padding: "10px 32px",
  borderRadius: "8px",
  border: "none",
  background: "linear-gradient(90deg, #007bff 0%, #0056b3 100%)",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "1.1rem",
  cursor: "pointer",
};

const PopupModal = ({ show, title, message, onClose }) => {
  if (!show) return null;
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h4 style={{ fontWeight: 700 }}>{title}</h4>
        <div style={{ marginTop: 12 }}>{message}</div>
        <button style={buttonStyle} onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default PopupModal;