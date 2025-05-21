import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const OrderSuccess = () => {
  return (
    <>
      <div className="container text-center mt-5">
        <h2 className="text-success">🎉 Thank you for your order!</h2>
        <p>
          Your order has been placed successfully. You’ll receive a confirmation
          email shortly.
        </p>
        <Link to="/" className="btn btn-primary mt-4">
          Back to Home
        </Link>
      </div>
      <Footer />
    </>
  );
};

export default OrderSuccess;
