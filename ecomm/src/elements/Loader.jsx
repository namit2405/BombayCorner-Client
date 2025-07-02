import React from "react";

const loaderStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "60px",
};

const spinnerStyle = {
  width: "48px",
  height: "48px",
  border: "6px solid #e0eafc",
  borderTop: "6px solid #007bff",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

const keyframes = `
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
`;

const Loader = () => (
  <div style={loaderStyle}>
    <style>{keyframes}</style>
    <div style={spinnerStyle}></div>
  </div>
);

export default Loader;