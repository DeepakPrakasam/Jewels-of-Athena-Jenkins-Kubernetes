import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EditProductForm = ({
  product,
  handleEditSubmit,
  handleEditChange,
  previewImage,
  setPreviewImage,
}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubCategory] = useState("");
  const [metalPurity, setMetalPurity] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [stock, setStock] = useState("");

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

  useEffect(() => {
    if (product) {
      setTitle(product.title || "");
      setCategory(product.category || "");
      setSubCategory(product.subcategory || "");
      setMetalPurity(product.metalPurity || "");
      setWeight(product.weight || "");
      setDescription(product.description || "");
      setPrice(product.price || "");
      setImage(product.image || "");
      setStock(product.stock || "");
    }
  }, [product]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    setSubCategory("");
  };

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/admin/view-products");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      title,
      category,
      subcategory,
      metalPurity,
      weight,
      description,
      price,
      stock,
      image,
    };
    await handleEditSubmit(updatedProduct);
  };

  return (
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
        <h4 className="mb-3 rounded-3">Edit Product</h4>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select
          className="form-select mb-3"
          value={category}
          onChange={handleCategoryChange}
          required
        >
          <option value="">Select Category</option>
          {Object.keys(subCategoryOptions).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {category && (
          <select
            className="form-select mb-3"
            value={subcategory}
            onChange={(e) => setSubCategory(e.target.value)}
            required
          >
            <option value="">Select Subcategory</option>
            {subCategoryOptions[category].map((sub, idx) => (
              <option key={idx} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        )}

        <input
          className="form-control mb-3"
          type="text"
          placeholder="Metal & Purity (e.g. 22K Gold)"
          value={metalPurity}
          onChange={(e) => setMetalPurity(e.target.value)}
          required
        />

        <input
          className="form-control mb-3"
          type="number"
          placeholder="Weight (g)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          step="0.01"
          required
        />

        <input
          className="form-control mb-3"
          type="number"
          placeholder="Price (₹)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          step="0.01"
          required
        />

        <textarea
          className="form-control mb-3"
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        />

        <input
          className="form-control mb-3"
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => {
            setImage(e.target.value);
            setPreviewImage(e.target.value);
          }}
          name="image"
        />

        <input
          className="form-control mb-3"
          type="number"
          placeholder="Stock Quantity"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
          min="0"
        />

        {previewImage && (
          <div className="mb-3 text-center">
            <img
              src={previewImage}
              alt="Preview"
              className="img-fluid rounded"
              style={{ maxHeight: "200px", objectFit: "cover" }}
            />
          </div>
        )}

        <div className="mb-3 d-flex gap-3">
          <button className="btn btn-outline-secondary w-100" type="submit">
            Save Changes
          </button>
          <button
            className="btn btn-outline-danger w-100"
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductForm;
