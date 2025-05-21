import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import EditProductForm from "./EditProductForm";
import Footer from "./Footer";

const EditProductPage = ({ toastRef }) => {
  const { id } = useParams();
  const [editProduct, setEditProduct] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);

  const showToast = (message, type) => {
    toastRef.current?.show(message, type);
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch product");
        }
        return res.json();
      })
      .then((data) => {
        // Handle image
        const image =
          typeof data.image === "string"
            ? data.image.split(",")[0] // in case it was saved as a comma-separated string
            : data.image?.path || "";

        const imagePath = image.startsWith("http") ? image : `/${image}`;
        setPreviewImage(imagePath);

        // Clean the image field to be a single string
        setEditProduct({ ...data, image });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch product:", err);
        setLoading(false);
      });
  }, [id]);

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files?.[0]) {
      setPreviewImage(URL.createObjectURL(files[0]));
      setEditProduct({ ...editProduct, image: files[0] });
    } else {
      setEditProduct({ ...editProduct, [name]: value });
    }
  };

  const handleEditSubmit = async (updatedData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      for (let key in updatedData) {
        formData.append(key, updatedData[key]);
      }

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();

        console.error("Failed to update product:", errorText);
        throw new Error("Failed to update product");
      }

      await res.json();
      showToast("Product updated successfully!","success");
      navigate("/admin/view-products");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    finally {
      setLoading(false);
    }
  };

  if (loading || !editProduct) return <div>Loading...</div>;

  return (
    <>
      <div className="container mt-4">
        <h2>Edit Product</h2>
        {/* Loading Indicator */}
        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-warning" role="status"></div>
          </div>
        ) : (
        <EditProductForm
          product={editProduct}
          handleEditChange={handleEditChange}
          handleEditSubmit={handleEditSubmit}
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
        />
        )}
      </div>
      <Footer />
    </>
  );
};

export default EditProductPage;
