import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function OrderStatusChart() {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    // Destroy existing chart before creating a new one
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Pending", "Shipped", "Delivered", "Cancelled"],
        datasets: [
          {
            label: "Orders",
            data: [12, 19, 7, 3], // Replace with dynamic data if available
            backgroundColor: [
              "#fbc531", // Pending
              "#00a8ff", // Shipped
              "#4cd137", // Delivered
              "#e84118", // Cancelled
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Important for custom sizing
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });

    // Cleanup on component unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="card shadow p-3">
      <h5 className="mb-3">Order Status</h5>
      <div style={{ height: "300px" }}> {/* Match this to your line chart height */}
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default OrderStatusChart;
