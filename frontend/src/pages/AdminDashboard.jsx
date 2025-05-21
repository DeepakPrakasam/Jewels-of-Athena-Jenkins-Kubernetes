import { useEffect, useState } from "react";
import axios from "axios";
import RevenueChart from "./RevenueChart";
import ProductTypeChart from "./ProductTypeChart";
import Footer from "../components/Footer";
function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    users: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const [prodRes, orderRes, userRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/products/count`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/orders/summary`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/count`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStats({
          products: prodRes.data.count,
          orders: orderRes.data.count,
          revenue: orderRes.data.revenue,
          users: userRes.data.count,
        });

        setRecentOrders(orderRes.data.recentOrders); // From backend
      } catch (err) {
        console.error("Error loading dashboard", err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="container mt-4">
        <div className="container-fluid bg-light p-3 mb-4 rounded shadow-sm">
          <div className="row align-items-center">
            <div className="col-12 col-md-6 text-center text-md-start mb-3 mb-md-0">
              <h2 className="m-0">Welcome to Admin Dashboard⚡</h2>
            </div>
            <div className="col-12 col-md-6 text-center text-md-end">
              <img
                src="https://sneat-vuetify-admin-template.vercel.app/assets/illustration-john-light-0061869a.png"
                className="img-fluid rounded"
                alt="admin"
                style={{ maxWidth: "150px" }}
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="row mb-4">
          <SummaryCard
            title="Products"
            count={stats.products}
            icon="fas fa-box"
          />
          <SummaryCard
            title="Orders"
            count={stats.orders}
            icon="fas fa-shopping-bag"
          />
          <SummaryCard
            title="Revenue"
            count={`₹${stats.revenue}`}
            icon="fas fa-rupee-sign"
          />
          <SummaryCard title="Users" count={stats.users} icon="fas fa-users" />
        </div>

        {/* Charts Section */}
        <div className="row mb-5">
          <div className="col-md-6 mb-4">
            <ProductTypeChart />
          </div>
          <div className="col-md-6 mb-4">
            <RevenueChart />
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="card shadow">
          <div className="card-header">
            <strong>Recent Orders</strong>
          </div>
          <div className="card-body p-0">
            <table className="table table-hover m-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order, idx) => (
                    <tr key={order._id}>
                      <td>{idx + 1}</td>
                      <td>{order.userName}</td>
                      <td>₹{order.totalAmount}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            order.status === "Delivered" ? "success" : "warning"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-3">
                      No recent orders available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function SummaryCard({ title, count, icon }) {
  return (
    <div className="col-md-3 mb-3">
      <div className="card shadow-sm text-center">
        <div className="card-body">
          <i className={`${icon} fa-2x mb-2 text-primary`}></i>
          <h5>{title}</h5>
          <p className="fw-bold fs-4">{count}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
