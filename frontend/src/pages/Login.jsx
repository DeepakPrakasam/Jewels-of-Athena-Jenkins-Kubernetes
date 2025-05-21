import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

function Login({ toastRef }) {
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const showToast = (message, type) => {
    toastRef.current?.show(message, type);
  };

  // 🔐 Handle login with password
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailOrPhone, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        const [, payload] = data.token.split(".");
        const decoded = JSON.parse(atob(payload));
        localStorage.setItem("role", decoded.role);

        showToast("Login successful!", "success");

        setTimeout(() => {
          navigate(decoded.role === "admin" ? "/admin/dashboard" : "/");
        }, 1500);
      } else {
        showToast(data.message || "Login failed", "danger");
      }
    } catch (err) {
      console.error("Login error:", err);
      showToast("Login failed. Try again.", "danger");
    } finally {
      setLoading(false);
    }
  };

  // ✉️ Send OTP to email/phone
  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrMobile: emailOrPhone }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("OTP sent to your email", "success");
      } else {
        showToast(data.message || "Failed to send OTP", "danger");
      }
    } catch (err) {
      console.error("OTP send error:", err);
      showToast("Error sending OTP", "danger");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP and log in
  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrMobile: emailOrPhone, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        const [, payload] = data.token.split(".");
        const decoded = JSON.parse(atob(payload));
        localStorage.setItem("role", decoded.role);

        showToast("Login successful!", "success");

        setTimeout(() => {
          navigate(decoded.role === "admin" ? "/admin/dashboard" : "/");
        }, 1500);
      } else {
        showToast(data.message || "Invalid OTP", "danger");
      }
    } catch (err) {
      console.error("OTP verify error:", err);
      showToast("Error verifying OTP", "danger");
    } finally {
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
          <form onSubmit={handleLogin}>
            <p className="text-center">
              Welcome back! Please login to your account.
            </p>

            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                id="emailOrPhone"
                placeholder="Enter your email or phone"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
              />
            </div>

            {/* OTP Flow */}
            <div className="mb-3">
              <button
                type="button"
                className="btn btn-outline-primary w-100"
                onClick={() => setShowOtpInput(true)}
              >
                Login with OTP
              </button>
            </div>

            {showOtpInput && (
              <>
                <div className="mb-2">
                  <button
                    type="button"
                    className="btn btn-warning w-100"
                    onClick={handleSendOtp}
                  >
                    Send OTP
                  </button>
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <button
                    type="button"
                    className="btn btn-success w-100"
                    onClick={handleVerifyOtp}
                  >
                    Verify OTP & Login
                  </button>
                </div>
              </>
            )}

            {/* Divider */}
            <div style={{ textAlign: "center" }}>
              <span
                style={{
                  padding: "0 10px",
                  fontWeight: 600,
                  display: "inline-block",
                  borderTop: "1px solid #ccc",
                  width: "100%",
                }}
              >
                or
              </span>
            </div>

            {/* Password Login */}
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
                required={!showOtpInput}
                disabled={showOtpInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <button
                type="submit"
                className="btn btn-outline-secondary w-100"
                disabled={showOtpInput}
              >
                Login with Password
              </button>
            </div>

            <div className="mb-3 text-center">
              <p>Login with</p>
              <button
                type="button"
                className="btn btn-outline-danger w-100 mb-2"
              >
                <i className="fab fa-google me-2"></i> Google
              </button>
            </div>

            <div className="text-center">
              <a href="/signup" style={{ color: "#7a2f00" }}>
                New User? Sign Up
              </a>{" "}
              |{" "}
              <a href="/forgot-password" style={{ color: "#7a2f00" }}>
                Forgot Password?
              </a>
            </div>
          </form>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Login;
