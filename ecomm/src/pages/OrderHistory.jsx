import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/OrderHistory.css'; // custom CSS
import PopupModal from "../elements/PopUp";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [popup, setPopup] = useState({ show: false, title: "", message: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      // Check for token before fetching
      const token = localStorage.getItem("token");
      if (!token) {
        setPopup({
          show: true,
          title: "Login Required",
          message: "Please login to view your orders!",
        });
        setTimeout(() => {
          setPopup({ show: false, title: "", message: "" });
          navigate("/login");
        }, 1500);
        setLoading(false);
        return;
      }
      try {
        const response = await axiosInstance.get('/order/history/');
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          setError('Unexpected response format.');
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setPopup({
            show: true,
            title: "Login Required",
            message: "Please login to view your orders!",
          });
          setTimeout(() => {
            setPopup({ show: false, title: "", message: "" });
            navigate("/login");
          }, 1500);
        } else {
          setError('Failed to load orders.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) return <div className="status-msg">Loading your orders...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div className="order-history-container">
      <PopupModal
        show={popup.show}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup({ show: false, title: "", message: "" })}
      />
      <h2 className="page-title">Your Orders</h2>
      {orders.length === 0 ? (
        <p className="no-orders">You have not placed any orders yet.</p>
      ) : (
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order.id} className="order-card">
              <div className="order-header">
                <span className="order-id">
  Order #{`${new Date(order.ordered_at).getFullYear()}${String(new Date(order.ordered_at).getMonth() + 1).padStart(2, '0')}${String(new Date(order.ordered_at).getDate()).padStart(2, '0')}${order.id}`}
</span>

                <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
              </div>
              <p><strong>Total:</strong> ₹{Number(order?.total_amount || 0).toFixed(2)}</p>
              <p><strong>Ordered on:</strong> {new Date(order.ordered_at).toLocaleString()}</p>
              <Link to={`/orders/${order.id}`} className="order-link">View Order Details</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderHistoryPage;