import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const Cart = ({ toastRef }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const showToast = (message, type) => {
    toastRef.current?.show(message, type);
  };
  useEffect(() => {
    fetchCart();
  }, []);
  
  const fetchCart = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload?.id;
  
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Server Error");
        const data = await res.json();
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Cart fetch error:", err);
        setLoading(false);
      });
  };
  

  const handleRemove = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast("🗑️ " + data.message, "success");
        fetchCart();
      } else {
        showToast("❌ " + data.message, "danger");
      }
    } catch (err) {
      console.error("Remove item error:", err);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout", {
      state: { cartItems: items },
    });
  };

  const getTotal = () => {
    return items.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0
    );
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <>
      <div className="container mt-4 mb-5">
        <h2 className="text-center mb-4">Your Cart</h2>
        {items.length === 0 ? (
          <p className="text-center">Your cart is empty.</p>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th className="text-center">Qty</th>
                    <th className="text-center">Price</th>
                    <th className="text-center">Subtotal</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    if (!item.product) {
                      return (
                        <tr key={item._id}>
                          <td colSpan="5" className="text-muted text-center">
                            This product is no longer available.
                            <button
                              className="btn btn-sm btn-outline-danger ms-3"
                              onClick={() =>
                                handleRemove(
                                  item.productId || item.product?._id
                                )
                              }
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    }

                    const imageSrc = item.product.image?.startsWith("http")
                      ? item.product.image
                      : `/${item.product.image}`;

                    return (
                      <tr key={item._id}>
                        <td>
                          <div className="d-flex align-items-center flex-wrap gap-3">
                            <img
                              src={imageSrc}
                              alt={item.product.title}
                              className="img-fluid"
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                            <div>
                              <span className="fw-semibold">
                                {item.product.title}
                              </span>
                              {item.restocked === true ? (
                                <span className="badge bg-success text-light ms-2">
                                  Now Available
                                </span>
                              ) : item.backorder === true ? (
                                <span className="badge bg-warning text-dark ms-2">
                                  Backorder
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-center">₹{item.product.price}</td>
                        <td className="text-center">
                          ₹{item.quantity * item.product.price}
                        </td>
                        <td className="text-center">
                          <div className="d-flex flex-column flex-md-row justify-content-center gap-2">
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleRemove(item.product._id)}
                            >
                              Remove
                            </button>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() =>
                                navigate("/checkout", {
                                  state: {
                                    product: item.product,
                                    quantity: item.quantity,
                                  },
                                })
                              }
                            >
                              Checkout This
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="text-end mt-4">
              <h4>Total: ₹{getTotal()}</h4>
              <button className="btn btn-success mt-2" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
