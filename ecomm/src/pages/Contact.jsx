import React, { useRef, useState } from "react";
import emailjs from "emailjs-com";
import "../styles/Contact.css";

const Contact = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    message: "",
  });
  const [status, setStatus] = useState({ sent: false, error: false });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ sent: false, error: false });

    try {
      await emailjs.send(
        "service_49e75c4",       // ✅ Your Service ID
        "template_f49yu0a",      // ✅ Your Template ID
        {
          ...formData,
          to_email: "yourname@example.com", // ✅ Replace with your receiving email
        },
        "afGuRCEle4SPO2NEV"      // ✅ Your Public Key
      );

      setStatus({ sent: true, error: false });
      setFormData({ user_name: "", user_email: "", message: "" });
      setLoading(false);
    } catch (error) {
      console.error("FAILED TO SEND EMAIL:", error);
      setStatus({ sent: false, error: true });
      setLoading(false);
    }
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-card">
        <h2>Contact Us</h2>
        <p>We’d love to hear from you! Fill out the form below and we’ll get back to you shortly.</p>

        <form ref={form} onSubmit={sendEmail}>
          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label>Your Email</label>
            <input
              type="email"
              name="user_email"
              value={formData.user_email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Your Message</label>
            <textarea
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="What's on your mind?"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {status.sent && <p className="success-msg">✅ Your message has been sent successfully!</p>}
        {status.error && <p className="error-msg">❌ Something went wrong. Please try again.</p>}
      </div>
    </div>
  );
};

export default Contact;
