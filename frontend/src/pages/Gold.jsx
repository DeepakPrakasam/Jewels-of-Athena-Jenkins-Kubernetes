import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const GoldPage = () => {
  const [goldItems, setGoldItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const navigate = useNavigate();

  const categories = [
    "All",
    "Bangles",
    "Bracelets",
    "Earrings",
    "Gold Chains",
    "Pendants",
    "Rings",
  ];

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/gold`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched goldItems =", data);
        setGoldItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching gold items:", err);
        setLoading(false);
      });
  }, []);

  // Filter items based on search and subcategory
  const filteredItems = goldItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.subcategory === selectedCategory;
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div>
        {/* Header Image */}
        <div>
          <img
            src="/goldheader.webp"
            alt="Gold Collection"
            className="img-fluid mt-3"
          />
        </div>

        {/* Heading */}
        <h1
          style={{ fontFamily: "Merriweather, serif" }}
          className="d-flex justify-content-center mt-4"
        >
          <i>
            Designed For <strong>Everyday Moments</strong>
          </i>
        </h1>

        {/* Search and Filter */}
        <div className="container mt-4">
          <div className="row mb-4">
            <div className="col-md-6 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Search for gold items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-2">
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-warning" role="status"></div>
          </div>
        ) : (
          <div className="container mt-3 mb-5">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 g-4">
              {filteredItems.map((item, index) => (
                <div className="col" key={index}>
                  <div
                    className="card rounded-3 h-100"
                    onClick={() => navigate(`/product/${item._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      className="card-img-top img-fluid rounded-3"
                      src={
                        item.image.startsWith("http")
                          ? item.image
                          : `/${item.image}`
                      }
                      alt={item.title}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{item.title}</h5>
                      <h4
                        className="card-title"
                        style={{ fontFamily: "Verdana, sans-serif" }}
                      >
                        ₹{item.price}
                      </h4>
                    </div>
                  </div>
                </div>
              ))}
              {filteredItems.length === 0 && (
                <div className="text-center col-12 mt-5">
                  <p>No matching products found.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default GoldPage;
