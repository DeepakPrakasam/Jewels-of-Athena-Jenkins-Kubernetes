import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ title, image }) => {
  return (
    <div className="col">
      <Link
        to={`/goldpage/${title}`}
        className="text-decoration-none"
        style={{ color: "inherit" }}
      >
        <div
          className="card h-100 shadow-sm border-0 rounded-4"
          style={{
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.03)";
            e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)";
          }}
        >
          <img
            className="card-img-top img-fluid rounded-top"
            src={image}
            alt={title}
          />
          <div className="card-body d-flex align-items-center justify-content-center bg-light">
            <h5 className="card-title text-center fw-semibold m-0">{title}</h5>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CategoryCard;
