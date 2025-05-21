import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginWithOtp({ toastRef }) {
  const [step, setStep] = useState(1); // Step 1: enter email, Step 2: enter OTP
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const showToast = (message, type) => {
    toastRef?.current?.show(message, type);
  };

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
        setStep(2); // Move to OTP entry step
      } else {
        showToast(data.message || "Failed to send OTP", "danger");
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      showToast("Error sending OTP", "danger");
    } finally {
      setLoading(false);
    }
  };

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
          window.location.href =
            decoded.role === "admin" ? "/admin/dashboard" : "/";
        }, 1500);
      } else {
        showToast(data.message || "Invalid OTP", "danger");
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      showToast("Error verifying OTP", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
      <h4>Login with OTP</h4>
      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-warning" role="status"></div>
        </div>
      ) : step === 1 ? (
        <>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter your email or phone"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
          />
          <button className="btn btn-primary w-100" onClick={handleSendOtp}>
            Send OTP
          </button>
        </>
      ) : (
        <>
          <p>
            OTP has been sent to: <strong>{emailOrPhone}</strong>
          </p>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter the OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button className="btn btn-success w-100" onClick={handleVerifyOtp}>
            Verify OTP
          </button>
        </>
      )}
    </div>
  );
}

export default LoginWithOtp;
