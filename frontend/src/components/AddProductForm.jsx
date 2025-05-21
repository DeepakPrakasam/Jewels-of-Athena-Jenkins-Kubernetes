import { useState } from "react";
import Footer from "../components/Footer";

const AddProductForm = ({ toastRef }) => {
  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [metalPurity, setMetalPurity] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);

  const showToast = (message, type) => {
    toastRef.current?.show(message, type);
  };

  // Subcategory options based on selected category
  const subCategoryOptions = {
    Gold: [
      "Bangles",
      "Bracelets",
      "Earrings",
      "Gold Chains",
      "Pendants",
      "Rings",
    ],
    Silver: [
      "Anklets",
      "Bracelets",
      "Earrings",
      "Chains",
      "Rings",
      "Toe Rings",
    ],
    Platinum: ["Rings", "Bands"],
    Diamond: ["Rings", "Earrings", "Necklace", "Bracelet"],
    Custom: ["Custom Design"],
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    setSubCategory(""); // Reset subcategory when category changes
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("🔥 Form submitted");

    // Prepare product data to send to backend
    const productData = {
      title,
      category,
      subcategory: subCategory,
      metalPurity,
      weight,
      description,
      price,
      stock,
      image,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/add-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Product added successfully:", "success");
        // Handle success (e.g., redirect or show success message)
        // Clear the form after submission
        setTitle("");
        setCategory("");
        setSubCategory("");
        setMetalPurity("");
        setWeight("");
        setDescription("");
        setPrice("");
        setImage("");
      } else {
        showToast("Error adding product:", "danger");
        console.error("Error adding product:", data);
        // Handle error (show error message, etc.)
      }
    } catch (err) {
      console.error("Request failed:", err);
      // Handle error in case of network failure
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          maxWidth: "600px",
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
          <h4 className="mb-3 rounded-3">Add New Product</h4>
        </div>
          {/* Loading Indicator */}
        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-warning" role="status"></div>
          </div>
        ) : (
        <form onSubmit={handleSubmit}>
          <h4 className="d-flex justify-content-center">
            Add a New Product to Your Store
          </h4>

          {/* Product Title */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="title"
              placeholder="Product Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="mb-3">
            <select
              id="category"
              className="form-select"
              value={category}
              onChange={handleCategoryChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Platinum">Platinum</option>
              <option value="Diamond">Diamond</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          {/* Subcategory (conditionally rendered based on Category selection) */}
          {category && subCategoryOptions[category] && (
            <div className="mb-3">
              <select
                id="subCategory"
                className="form-select"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                required
              >
                <option value="">Select Subcategory</option>
                {subCategoryOptions[category].map((sub, index) => (
                  <option key={index} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Metal and Purity */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="metalPurity"
              placeholder="Metal & Purity (22K Gold)"
              required
              value={metalPurity}
              onChange={(e) => setMetalPurity(e.target.value)}
            />
          </div>

          {/* Weight */}
          <div className="mb-3">
            <input
              type="number"
              className="form-control"
              id="weight"
              placeholder="Weight (grams)"
              required
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              step="0.01"
            />
          </div>

          {/* Price */}
          <div className="mb-3">
            <input
              type="number"
              className="form-control"
              id="price"
              placeholder="Price (₹)"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
            />
          </div>

          {/* Product Description */}
          <div className="mb-3">
            <textarea
              className="form-control"
              id="description"
              placeholder="Product Description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
            ></textarea>
          </div>

           {/* Stock */}
          <div className="mb-3">
            <input
              type="number"
              className="form-control"
              id="stock"
              placeholder="Stock Quantity"
              required
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              min="0"
            />
          </div>

          {/* Image URL */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="image"
              placeholder="Image URL"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="mb-3">
            <button type="submit" className="btn btn-outline-secondary w-100">
              Add Product
            </button>
          </div>
        </form>
        )}
      </div>

      <Footer />
    </>
  );
};

export default AddProductForm;
