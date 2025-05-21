import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/orders/history`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error("Failed to fetch orders", err.response || err);
      });
  }, []);

  return (
    <>
    <div className="container mt-4">
      <h2 className="mb-4">My Order History</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="list-group">
          {orders.map((order) => (
            <div
              key={order._id}
              className="list-group-item mb-4 p-3 border rounded shadow-sm"
            >
              {/*<h5 className="mb-2">Order #{order._id}</h5>*/}
              <p className="mb-1">
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              {/*<p className="mb-3">
                <strong>Status:</strong>{" "}
                <span
                  className={`badge bg-${
                    order.status === "Delivered" ? "success" : "warning"
                  }`}
                >
                  {order.status}
                </span>
              </p>*/}

              <h6 className="mb-2">Product:</h6>
              <div className="d-flex flex-column gap-3">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="d-flex gap-3 align-items-start border rounded p-2"
                  >
                    <img
                      src={
                        item.image && item.image.startsWith("http")
                          ? item.image
                          : item.image
                          ? `/${item.image}`
                          : "/default-product.jpg"
                      }
                      alt={item.title}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                      className="rounded card-img-top img-fluid rounded-3"
                    />

                    <div>
                      <h6 className="mb-1">{item.title}</h6>
                      <p className="mb-1">Qty: {item.quantity}</p>
                      <p className="mb-0">Price: ₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-3">
                <strong>Total:</strong> ₹{order.totalAmount}
              </p>

              <h6>Shipping Details:</h6>
              <p className="mb-0">
                {order.shippingDetails.fullName},{" "}
                {order.shippingDetails.address}, {order.shippingDetails.city},{" "}
                {order.shippingDetails.state} - {order.shippingDetails.zip},{" "}
                {order.shippingDetails.country}
                <br />
                📞 {order.shippingDetails.phone} | ✉️{" "}
                {order.shippingDetails.email}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
    <Footer />
    </>
  );
}

export default OrderHistory;
