import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from 'axios';  // Make sure to install axios

function ProductTypeChart() {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [productCategories, setProductCategories] = useState([]);

  useEffect(() => {
    const fetchProductCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/product-categories`);
        setProductCategories(response.data);
      } catch (error) {
        console.error('Error fetching product categories:', error);
      }
    };

    fetchProductCategories();
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = productCategories.map(item => item.category);
    const data = productCategories.map(item => item.count);

    chartInstanceRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Product Types",
            data: data,
            backgroundColor: [ "#ffe9bd","#e0e0e0",],  // Colors for each category
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [productCategories]);

  return (
    <div className="card shadow p-3">
      <h5 className="mb-3">Product Category Distribution</h5>
      <div style={{ height: "300px" }}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default ProductTypeChart;
