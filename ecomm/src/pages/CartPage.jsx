import React, { useEffect, useState } from "react";
import api, { myBaseUrl } from "../axios";
import { useNavigate } from "react-router-dom";
import "../styles/CartPage.css";
import Loader from "../elements/Loader"; // Adjust path if needed
import PopupModal from "../elements/PopUp"; // Adjust path if needed

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("Jalandhar");

  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, title: "", message: "" });
  const navigate = useNavigate();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Fetch the cart and calculate total
  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await api.get("/cart/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      const items = res.data.items || [];
      setCartItems(items);

      // Calculate total
      let total = 0;
      items.forEach((item) => {
        total += item.product.price * item.quantity;
      });
      setTotalAmount(total);
    } catch (error) {
      console.error("Error fetching cart:", error);
      if (error.response?.status === 401) {
        setPopup({
          show: true,
          title: "Login Required",
          message: "Please login to view your cart!",
        });
        setTimeout(() => {
          setPopup({ show: false, title: "", message: "" });
          navigate("/login");
        }, 1500);
        // return here to avoid navigating twice
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setLoading(true);
    try {
      await api.put(
        `/cart/update/${itemId}/`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );
      await fetchCart(); // refresh cart
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeItem = async (itemId) => {
    setLoading(true);
    try {
      await api.delete(`/cart/remove/${itemId}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      await fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setLoading(false);
    }
  };

  // Checkout
  const checkout = async (address) => {
    setLoading(true);
    const res = await loadRazorpayScript();
    if (!res) {
      setLoading(false);
      setPopup({
        show: true,
        title: "Payment Error",
        message: "Failed to load payment SDK. Check your connection.",
      });
      return;
    }

    const amount = cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

    const options = {
      key: "rzp_test_5N99QEcFwfdfDU",
      currency: "INR",
      amount: amount * 100,
      name: "My Store",
      description: "Test Transaction",
      handler: function (response) {
        // After successful payment
        api
          .post(
            "/checkout/",
            { address },
            {
              headers: {
                Authorization: `Token ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((res) => {
            setLoading(false);
            setPopup({
              show: true,
              title: "Order Confirmed!",
              message: (
                <span>
                  Payment Successful!<br />
                  Payment ID: <b>{response.razorpay_payment_id}</b>
                  <br />
                  Your order has been placed successfully!
                </span>
              ),
            });
            setTimeout(() => {
              setPopup({ show: false, title: "", message: "" });
              window.location.href = `/order/history/`;
            }, 2000);
          })
          .catch((error) => {
            setLoading(false);
            setPopup({
              show: true,
              title: "Order Error",
              message: "Failed to place order after payment. Please contact support.",
            });
          });
      },
      prefill: {
        name: localStorage.getItem("username") || "Customer",
        email: localStorage.getItem("email") || "customer@example.com",
      },
      theme: {
        color: "#7b2ff2",
      },
      modal: {
        ondismiss: () => setLoading(false),
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  // Checkout
 const handleCheckout = () => {
  if (!street.trim() || !landmark.trim()) {
    setPopup({
      show: true,
      title: "Incomplete Address",
      message: "Please fill in both street/house no and landmark.",
    });
    return;
  }

  // ✅ Force check for Jalandhar
  if (city.trim().toLowerCase() !== "jalandhar") {
    setPopup({
      show: true,
      title: "Delivery Not Available",
      message: "Sorry! We currently only deliver within Jalandhar city.",
    });
    return;
  }

  const fullAddress = `${street}, Landmark: ${landmark}, ${city}`;
  checkout(fullAddress);
};


  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, []);

  const deliveryCharge = totalAmount < 4000 && totalAmount > 0 ? 150 : 0;
  const grandTotal = totalAmount + deliveryCharge;

  return (
    <div className="container my-4 cart-page">
      {loading && <Loader />}
      <PopupModal
        show={popup.show}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup({ show: false, title: "", message: "" })}
      />
      <h2 className="cart-title">Your Cart</h2>
      {cartItems.length === 0 ? (
        <div className="alert alert-info">Your cart is empty.</div>
      ) : (
        <div className="row">
          {/* Cart items */}
          <div className="col-md-8">
            {cartItems.map((item) => (
              <div key={item.id} className="card mb-3 cart-item">
                <div className="card-body d-flex align-items-center">
                  <img
                    src={`${myBaseUrl}${item.product.image}`}
                    alt={item.product.title}
                    className="cart-item-img"
                  />
                  <div className="cart-item-details ms-3 flex-grow-1">
                    <h5>{item.product.title}</h5>
                    <p className="mb-1">₹{item.product.price}</p>
                    <div className="d-flex align-items-center">
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                      <button
                        className="btn btn-sm remove-btn ms-3"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bill Summary and Checkout */}
          <div className="col-md-4">
            <div className="card p-3 bill-summary">
              <h4 className="mb-3">Bill Summary</h4>
              {cartItems.map((item) => (
                <p
                  key={item.id}
                  className="d-flex justify-content-between small text-muted"
                >
                  <span>
                    {item.product.title} x {item.quantity}
                  </span>
                  <span>₹{item.product.price * item.quantity}</span>
                </p>
              ))}

              <hr />
              <p className="d-flex justify-content-between">
              <span>Subtotal:</span> <span>₹{totalAmount}</span>
            </p>
            <p className="d-flex justify-content-between">
              <span>Delivery:</span> <span>₹{deliveryCharge}</span>
            </p>
            <hr />
            <h5 className="d-flex justify-content-between">
              <span>Total:</span> <span>₹{grandTotal}</span>
            </h5>

              <div className="mt-3">
  <label className="form-label">Street / House No:</label>
  <input
    type="text"
    className="form-control mb-2"
    value={street}
    onChange={(e) => setStreet(e.target.value)}
    placeholder="e.g. 123, XYZ Lane"
  />

  <label className="form-label">Landmark:</label>
  <input
    type="text"
    className="form-control mb-2"
    value={landmark}
    onChange={(e) => setLandmark(e.target.value)}
    placeholder="e.g. Near Model Town Gurudwara"
  />

  <label className="form-label">City:</label>
  <input
    type="text"
    className="form-control"
    value={city}
    readOnly
    style={{ backgroundColor: "#f0f0f0", fontWeight: "600" }}
  />
</div>


              <button
                className="checkout-btn btn mt-3 w-100"
                onClick={handleCheckout}
                disabled={loading}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;