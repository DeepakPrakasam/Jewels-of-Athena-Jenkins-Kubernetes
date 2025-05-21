import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Review from "../components/Review"; // Import the Review component

const ProductDetail = ({ toastRef }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [reviewsToShow, setReviewsToShow] = useState(5); // Number of reviews to display initially
  const isLoggedIn = !!localStorage.getItem("token");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  const showToast = (message, type) => {
    toastRef.current?.show(message, type);
  };

  // Function to render stars based on the rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push("⭐");
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push("☆");
    }

    return stars.join(" ");
  };

  // Calculate the average rating
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setPageLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setPageLoading(false);
      });
  }, [id]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) return alert("Please login first.");
    setCartLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const msg =
          product.stock <= 0
            ? "⚠️ Product is out of stock and added for backorder."
            : "✅ Product added to cart.";
        showToast(msg, product.stock <= 0 ? "warning" : "success");
      } else {
        showToast("❌ " + data.message);
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Something went wrong.");
    } finally {
      setCartLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      showToast("Please login to proceed with the purchase.", "danger");
      return;
    }

    if (!product || product.stock <= 0) return;

    navigate("/checkout", {
      state: {
        product,
        quantity: 1,
      },
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewLoading(true);

    if (!rating || !comment) {
      return alert("Please fill out all fields.");
    }

    const token = localStorage.getItem("token");

    if (!token) {
      return alert("You must be logged in to submit a review.");
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${product._id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Attach the JWT token here
        },
        body: JSON.stringify({
          rating,
          comment,
          name: name, // Add the username or other required fields
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
      } else {
        alert(result.message || "Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("An error occurred while submitting your review.");
    } finally {
      setReviewLoading(false);
    }
  };

  // Function to load more reviews
  const handleLoadMoreReviews = () => {
    setReviewsToShow(reviewsToShow + 5); // Load 5 more reviews
  };

  if (pageLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center mt-5">Product not found.</div>;
  }

  const averageRating = calculateAverageRating(product.reviews);

  return (
    <>
      <div className="container mt-5">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="product-image">
              <img
                src={
                  product.image?.startsWith("http")
                    ? product.image
                    : `/${product.image}`
                }
                alt={product.title}
                className="img-fluid rounded shadow-lg"
                style={{
                  maxHeight: "500px",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div
              className="product-details card p-4 shadow-sm"
              style={{ borderRadius: "10px" }}
            >
              <h2
                className="product-title"
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#333",
                  marginBottom: "15px",
                }}
              >
                {product.title}
              </h2>
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#666",
                  marginBottom: "10px",
                }}
              >
                <strong>Category:</strong> {product.category}
              </p>
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#666",
                  marginBottom: "10px",
                }}
              >
                <strong>Subcategory:</strong> {product.subcategory}
              </p>
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#666",
                  marginBottom: "10px",
                }}
              >
                <strong>Metal & Purity:</strong> {product.metalPurity}
              </p>
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#666",
                  marginBottom: "10px",
                }}
              >
                <strong>Weight:</strong> {product.weight} grams
              </p>
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#666",
                  marginBottom: "10px",
                }}
              >
                <strong>Price:</strong> ₹{product.price}
              </p>

              <p
                style={{
                  fontSize: "1.1rem",
                  color: product.stock > 0 ? "#28a745" : "#dc3545",
                  marginBottom: "10px",
                }}
              >
                <strong>Stock:</strong>{" "}
                {product.stock > 0
                  ? `${product.stock} available`
                  : "Out of Stock"}
              </p>

              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#666",
                  marginBottom: "10px",
                  textAlign: "justify",
                  lineHeight: "1.4",
                }}
              >
                <strong>Description:</strong> {product.description}
              </p>

              {/* Display the average rating */}
              <div className="mt-3">
                <h5>Average Rating: {renderStars(averageRating)}</h5>
              </div>

              <div className="mt-4 d-flex justify-content-start gap-3">
                <button
                  className="btn btn-warning custom-btn"
                  disabled={!isLoggedIn || cartLoading}
                  onClick={handleAddToCart}
                  style={{
                    padding: "10px 20px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    transition: "transform 0.3s ease",
                    borderRadius: "5px",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                >
                  {cartLoading ? (
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Adding...</span>
                    </div>
                  ) : (
                    "Add to Cart"
                  )}
                </button>
                <button
                  className="btn btn-success custom-btn"
                  disabled={!isLoggedIn || product.stock <= 0}
                  onClick={handleBuyNow}
                  style={{
                    padding: "10px 20px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    transition: "transform 0.3s ease",
                    borderRadius: "5px",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                >
                  Buy Now
                </button>
              </div>
              {product.stock <= 0 && (
                <p
                  className="text-danger mt-2"
                  style={{ fontSize: "1rem", fontWeight: "bold" }}
                >
                  This product is currently out of stock.
                </p>
              )}

              {!isLoggedIn && (
                <p
                  className="text-danger mt-2"
                  style={{ fontSize: "1rem", fontWeight: "bold" }}
                >
                  Please login to make a purchase.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-5">
          <h4>Customer Reviews</h4>
          <div className="d-flex overflow-auto gap-3">
            {product.reviews?.slice(0, reviewsToShow).map((rev, index) => (
              <Review key={index} review={rev} renderStars={renderStars} />
            ))}
          </div>
          {product.reviews?.length > reviewsToShow && (
            <div className="mt-3">
              <button
                className="btn btn-primary"
                onClick={handleLoadMoreReviews}
              >
                Load More
              </button>
            </div>
          )}

          {/* Review Form */}
          {isLoggedIn && (
            <form onSubmit={handleSubmitReview} className="mt-4">
              <div className="form-group mt-3">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group mt-2">
                <label>Rating (1-5)</label>
                <input
                  type="number"
                  value={rating}
                  min="1"
                  max="5"
                  onChange={(e) => setRating(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group mt-2">
                <label>Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <button className="btn btn-primary mt-3" disabled={reviewLoading}>
                {reviewLoading ? (
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  >
                    <span className="visually-hidden">Submitting...</span>
                  </div>
                ) : (
                  "Submit Review"
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetail;
