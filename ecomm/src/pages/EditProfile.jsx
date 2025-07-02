import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/EditProfile.css";

const EditProfile = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    dob: "",
    image: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [imagePreview, setimagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:8000/user/profile/", {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await res.json();
        setForm({
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          dob: data.dob || "",
          image: "http://127.0.0.1:8000" + data.image || "",
          street: data.street || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
        });
        console.log(data);
        setimagePreview("http://127.0.0.1:8000" + data.image || "");
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile photo change
 const handlePhotoChange = (e) => {
  const file = e.target.files[0];
  setForm((prev) => ({ ...prev, image: file }));
  if (file) {
    setimagePreview(URL.createObjectURL(file));
  }
};

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("phone", form.phone);
    formData.append("dob", form.dob);
    if (form.image instanceof File) {
      formData.append("image", form.image);
    }
formData.append("street", form.street);
formData.append("city", form.city);
formData.append("state", form.state);
formData.append("pincode", form.pincode);

    try {
      await fetch("http://127.0.0.1:8000/user/profile/", {
        method: "PUT",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      });
      navigate("/profile");
    } catch (err) {
      // handle error
    }
  };

  if (loading) return <div className="edit-profile-container"><div className="edit-profile-card">Loading...</div></div>;

  return (
    <div className="edit-profile-container">
      <form className="edit-profile-card" onSubmit={handleSubmit} encType="multipart/form-data">
        <h2>Edit Profile</h2>
        <div className="edit-profile-columns">
          <div className="edit-profile-col">
            <div className="form-group">
              <label>Username</label>
              <input type="text" value={form.username} disabled />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} disabled />
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
                required
              />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
            <label>Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="profile-photo-preview"
              />
            ) : (
              form.image && typeof form.image === "string" && (
                <img
                  src={form.image}
                  alt="Profile"
                  className="profile-photo-preview"
                />
              )
            )}
          </div>
          </div>
          <div className="edit-profile-col">
            <div className="form-group">
              <label>Street / House No.</label>
              <input
                type="text"
                name="street"
                value={form.street}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Pincode</label>
              <input
                type="text"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                maxLength={6}
                required
              />
            </div>
          </div>
        </div>
        <button className="save-profile-btn" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;