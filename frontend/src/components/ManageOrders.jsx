import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ManageOrders.css"; // We'll add minor CSS here too
import Footer from "../components/Footer";
function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch orders");

        const data = await response.json();
        console.log(data); // Log the fetched data to inspect its structure
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const filtered = orders.filter(
        (order) =>
          new Date(order.createdAt).toDateString() ===
          selectedDate.toDateString()
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  }, [selectedDate, orders]);

  return (
    <>
      <div className="container mt-4">
        <h2 className="mb-4 text-center text-md-start">Manage Orders</h2>

        <div className="row mb-3">
          <div className="col-12 col-md-6">
            <label htmlFor="dateFilter" className="form-label">
              Filter by Date:
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              isClearable
              placeholderText="Select a date"
              className="form-control"
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped align-middle text-nowrap">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Total (₹)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  console.log(order); // Log the full order object
                  const customerName =
                    (order.shippingDetails && order.shippingDetails.fullName) ||
                    order.user?.name ||
                    order.user?.email ||
                    "Unknown"; // Default to "Unknown" if no data is found
                  console.log(customerName); // Log the value of customerName for debugging
                  return (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>{customerName}</td>
                      <td>{order.totalAmount}</td>
                      <td>{order.status}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No orders found for selected date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default ManageOrders;
