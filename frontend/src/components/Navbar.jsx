import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar({ toastRef }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    setIsLoggedIn(!!token);
    setRole(userRole);

    if (userRole === "admin" && window.location.pathname === "/admin") {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const showToast = (message, type = "primary") => {
    toastRef?.current?.show(message, type);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
    showToast("Logged out successfully", "info");
    navigate("/");
  };

  return (
    <nav
      className="navbar navbar-expand-sm navbar-light rounded-2"
      style={{ backgroundColor: "#ffd0d0" }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <strong>DJ</strong>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-lg-center"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            {role === "admin" ? (
              <>
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <strong>Manage Products</strong>
                  </Link>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/admin/view-products">
                        View All Products
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/admin/add-product">
                        Add Product
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/orders">
                    <strong>Manage Orders</strong>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/dashboard">
                    <strong>Admin Dashboard</strong>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    <strong>All Jewellery</strong>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/gold">
                    <strong>Gold</strong>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/silver">
                    <strong>Silver</strong>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="#">
                    <strong>Platinum</strong>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="#">
                    <strong>Collections</strong>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Profile/Logout Dropdown */}
        <div className="d-flex align-items-center" id="auth-buttons">
          {isLoggedIn ? (
            <div className="dropdown">
              <button
                className="btn dropdown-toggle d-flex align-items-center text-dark"
                type="button"
                id="profileDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-user-circle fa-lg me-2"></i>
                {role === "admin" ? "Admin" : "Profile"}
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="profileDropdown"
              >
                {role !== "admin" && (
                  <>
                    <li>
                      <Link to="/orders" className="dropdown-item">
                        <i className="fas fa-box-open me-2"></i>
                        Order History
                      </Link>
                    </li>
                    <li>
                      <Link to="/cart" className="dropdown-item">
                        <i className="fas fa-shopping-cart me-2"></i>
                        Cart
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                  </>
                )}
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Log Out
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="btn btn-link text-dark me-3">
              <i className="fas fa-user me-2"></i> LOG IN
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
