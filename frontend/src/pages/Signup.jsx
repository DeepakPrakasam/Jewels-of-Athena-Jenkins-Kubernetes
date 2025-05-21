import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const Signup = ({ toastRef }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); 

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (form.password !== form.confirmPassword) {
      toastRef?.current?.show("Passwords do not match", "danger");
      setLoading(false);
      return;
    }
  
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          mobile: form.mobile,
          password: form.password,
        }),
      });
  
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
  
      if (res.ok) {
        toastRef?.current?.show("Signup successful!", "success");
        navigate("/login");
      } else {
        toastRef?.current?.show(data.message || "Signup failed", "danger");
      }
    } catch (err) {
      console.error("Signup error:", err);
      toastRef?.current?.show("Signup failed. Please try again.", "danger");
    }
    finally {
      setLoading(false);
    }
    
  };
  

  return (
    <>
      <div
        style={{
          maxWidth: "500px",
          margin: "50px auto",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "20px",
          backgroundColor: "#fff",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff3d3",
            padding: "15px",
            textAlign: "center",
            borderRadius: "10px 10px 0 0",
            marginBottom: "20px",
          }}
        >
          <h4 className="mb-3 rounded-3">Dhandapani Jewellery</h4>
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-warning" role="status"></div>
          </div>
        ) : (
        <form onSubmit={handleSubmit}>
          <h4 className="d-flex justify-content-center">Sign Up</h4>
          <p className="text-center">
            Sign up with your details to get exciting offers and coupons.
          </p>

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email address"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="mobile"
              placeholder="Enter your mobile number"
              value={form.mobile}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input type="checkbox" id="terms" required />{" "}
            <label htmlFor="terms">
              I agree to the{" "}
              <a href="#" style={{ color: "#7a2f00" }}>
                Terms and Conditions
              </a>
            </label>
          </div>

          <div className="mb-3">
            <button
              type="submit"
              className="btn w-100"
              style={{ backgroundColor: "#af846a", color: "#fff" }}
            >
              Sign Up
            </button>
          </div>

          <div className="text-center">
            <p>
              Already have an account?{" "}
              <a href="/login" style={{ color: "#7a2f00" }}>
                Login
              </a>
            </p>
          </div>
        </form>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Signup;
