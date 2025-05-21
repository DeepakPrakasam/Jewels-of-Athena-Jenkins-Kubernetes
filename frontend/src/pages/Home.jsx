import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Carousel from "../components/Carousel";
import CategoryCard from "../components/CategoryCard";
import FeaturedJewelry from "../components/FeaturedJewelry";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <Carousel />

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-warning" role="status" aria-hidden="true"></div>
          <div className="mt-2">Loading...</div>
        </div>
      ) : (
        <div className="container mt-5">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.id || cat.title} title={cat.title} image={cat.image} />
            ))}
          </div>
        </div>
      )}

      <FeaturedJewelry />
      <Footer />
    </div>
  );
};

export default Home;
