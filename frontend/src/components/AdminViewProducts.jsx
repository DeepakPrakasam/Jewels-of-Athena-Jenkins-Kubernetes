import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

const categoryMap = {
  Gold: [
    "Bangles",
    "Bracelets",
    "Earrings",
    "Gold Chains",
    "Pendants",
    "Rings",
  ],
  Silver: ["Anklets", "Bracelets", "Earrings", "Chains", "Rings", "Toe Rings"],
  Platinum: ["Rings", "Bands"],
  Diamond: ["Rings", "Earrings", "Necklace", "Bracelet"],
  Custom: ["Custom Design"],
};

const AdminViewProducts = ({ toastRef }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const showToast = (message, type) => {
    toastRef.current?.show(message, type);
  };

  const navigate = useNavigate();

  // Fetch products from the API
  const fetchProducts = () => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle the delete action
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            setProducts(products.filter((product) => product._id !== id));
            showToast("Product deleted successfully!", "success");
          } else {
            showToast("Failed to delete product.","danger");
          }
        })
        .catch((err) => {
          console.error("Error deleting product:", err);
          showToast("Failed to delete product.");
        });
    }
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.category === selectedCategory
      : true;
    const matchesSubcategory = selectedSubcategory
      ? product.subcategory === selectedSubcategory
      : true;
    return matchesCategory && matchesSubcategory;
  });

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-start">Manage Products</h2>

      {/* Category and Subcategory Filters */}
      <div className="mb-4">
        <div className="d-flex gap-3 align-items-center">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubcategory("");
            }}
          >
            <option value="">All Categories</option>
            {Object.keys(categoryMap).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {selectedCategory && (
            <select
              className="form-select"
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
            >
              <option value="">All Subcategories</option>
              {categoryMap[selectedCategory].map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Product Cards */}
      <div className="row justify-content-center g-4">
        {filteredProducts.map((item) => (
          <div className="col-auto" key={item._id}>
            <div
              className="card rounded-3 h-100 shadow-sm"
              style={{ width: "18rem" }}
            >
              <img
                className="card-img-top img-fluid rounded-3"
                src={
                  typeof item.image === "string" &&
                  item.image.startsWith("http")
                    ? item.image
                    : `/${item.image}`
                }
                alt={item.title}
              />
              <div className="card-body text-center">
                <h5 className="card-title">{item.title}</h5>
                <h6 className="text-muted">₹{item.price}</h6>
              </div>
              <div className="card-footer mb-3 d-flex gap-3">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => navigate(`/admin/products/edit/${item._id}`)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-outline-danger w-100"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show message if no products match filter */}
      {filteredProducts.length === 0 && (
        <div className="text-center mt-4">No products match your filter.</div>
      )}
    </div>
  );
};

export default AdminViewProducts;
