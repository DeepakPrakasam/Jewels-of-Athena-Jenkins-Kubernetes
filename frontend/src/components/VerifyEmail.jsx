import { useEffect, useState } from "react";

function VerifyEmail() {
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const verify = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-email?token=${token}`);
        const text = await res.text();
        setMessage(text);
      } catch (err) {
        setMessage("Verification failed. Please try again.");
      }
    };

    verify();
  }, []);

  return (
    <div style={{ maxWidth: 500, margin: "50px auto", textAlign: "center" }}>
      <h3>{message}</h3>
    </div>
  );
}

export default VerifyEmail;
