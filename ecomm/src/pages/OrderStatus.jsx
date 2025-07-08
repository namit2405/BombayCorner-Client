import React, { useEffect, useState } from 'react';
import api from '../axios';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from "../elements/Loader";
import PopupModal from "../elements/PopUp";
import '../styles/OrderStatus.css'; // Optional: for custom styles

const OrderStatusPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, title: "", message: "" });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/order/status/${orderId}/`);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };
    fetchOrder();
  }, [orderId]);

  // ...existing code...
const handleCancelOrder = async () => {
  if (order.status === 'Pending' || order.status === 'Confirmed') {
    setLoading(true);
    try {
      await api.patch(`/order/${order.id}/cancel/`);
      setOrder({ ...order, status: 'Cancelled' });
      setPopup({
        show: true,
        title: "Order Cancelled",
        message: "Your order has been cancelled successfully.",
      });
    } catch (error) {
      setPopup({
        show: true,
        title: "Error",
        message: "Failed to cancel order. Please try again.",
      });
      console.error('Error cancelling order:', error);
    }
    setLoading(false);
  }
};

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="badge bg-secondary">{status}</span>;
      case 'Confirmed':
        return <span className="badge bg-primary">{status}</span>;
      case 'Shipped':
        return <span className="badge bg-info text-dark">{status}</span>;
      case 'Delivered':
        return <span className="badge bg-success">{status}</span>;
      case 'Cancelled':
        return <span className="badge bg-danger">{status}</span>;
      default:
        return <span className="badge bg-warning">{status}</span>;
    }
  };

  const getProgressPercentage = (status) => {
    switch (status) {
      case 'Pending':
        return 10;
      case 'Confirmed':
        return 30;
      case 'Shipped':
        return 70;
      case 'Delivered':
        return 100;
      case 'Cancelled':
        return 100;
      default:
        return 0;
    }
  };

  if (!order) return <div className="container text-center mt-5">Loading order details...</div>;

  return (
    <div className="container my-5">
      {loading && <Loader />}
      <PopupModal
        show={popup.show}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup({ ...popup, show: false })}
      />
      <div className="card shadow">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Order ID: #{order.id}</h4>
          {getStatusBadge(order.status)}
        </div>

        <div className="card-body">
          {/* Progress bar */}
          <div className="mb-4">
            <label className="form-label fw-bold">Order Progress</label>
            <div className="progress">
              <div
                className={`progress-bar ${
                  order.status === 'Cancelled' ? 'bg-danger' : 'bg-success'
                }`}
                role="progressbar"
                style={{ width: `${getProgressPercentage(order.status)}%` }}
              >
                {order.status === 'Cancelled' ? 'Cancelled' : `${getProgressPercentage(order.status)}%`}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <h5 className="fw-bold">Items:</h5>
          <ul className="list-group mb-3">
            {order.items.map((item) => (
              <li key={item.id} className="list-group-item d-flex justify-content-between">
                <span>{item.product.title}</span>&nbsp;&nbsp;&nbsp;
                <span>Qty: {item.quantity}</span>
              </li>
            ))}
          </ul>

          <p><strong>Total:</strong> ₹{order.total_amount}</p>
<p><strong>Shipping Address:</strong> {order.address}</p>

{order.status === 'Cancelled' && (
  <p>
    <strong>Refund Status:</strong>{" "}
    <span className={`badge ${
      order.refund_status === 'Refunded' ? 'bg-success' :
      order.refund_status === 'Pending' ? 'bg-danger' :
      'bg-warning text-dark'
    }`}>
      {order.refund_status}
    </span>
  </p>
)}

          {/* Tracking link */}
          {order.status === 'Shipped' && order.tracking_url && (
            <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-info mb-3">
              Track Your Package
            </a>
          )}

<div className="button-group">
  {(order.status === 'Pending' || order.status === 'Confirmed') && (
    <button className="custom-btn cancel-btn" onClick={handleCancelOrder}>
      Cancel Order
    </button>
  )}
  <button className="custom-btn back-btn" onClick={() => navigate('/order/history')}>
    Back to Order History
  </button>
</div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusPage;
