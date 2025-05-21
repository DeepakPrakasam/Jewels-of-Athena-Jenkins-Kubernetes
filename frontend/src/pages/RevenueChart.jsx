import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from 'axios';

function RevenueChart() {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/revenue-daily`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRevenueData(response.data);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };
  
    fetchRevenueData();
  }, []);
  
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = revenueData.map(item => item.date); // 👈 using "date" instead of "week"
    const data = revenueData.map(item => item.revenue);

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Daily Revenue (₹)",
            data: data,
            fill: true,
            borderColor: "#4bc0c0",
            tension: 0.4,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [revenueData]);

  return (
    <div className="card shadow p-3">
      <h5 className="mb-3">Daily Revenue</h5>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default RevenueChart;
