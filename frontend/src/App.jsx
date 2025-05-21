import { useRef } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar'; 
import Toast from './components/Toast';
import PriceTicker from './components/PriceTicker';
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AddProductForm from './components/AddProductForm';
import Gold from './pages/Gold';
import AdminViewProducts from './components/AdminViewProducts';
import EditProductPage from './components/EditProductPage';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Silver from './pages/Silver';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import VerifyEmail from './components/VerifyEmail';
import LoginWithOtp from './components/LoginWithOtp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OrderHistory from './pages/OrderHistory';
import ManageOrders from './components/ManageOrders';

function App() {
  const toastRef = useRef();

  return (
    <BrowserRouter>
      <PriceTicker />
      <Navbar toastRef={toastRef} />  
      <Toast ref={toastRef} />
      <Routes>
        <Route path="/" element={<Home toastRef={toastRef} />} />
        <Route path="/gold" element={<Gold toastRef={toastRef} />} />
        <Route path="/silver" element={<Silver toastRef={toastRef} />} />
        <Route path="/product/:id" element={<ProductDetail toastRef={toastRef} />} />
        <Route path="/cart" element={<Cart toastRef={toastRef} />} />
        <Route path="/goldpage/:category" element={<Gold toastRef={toastRef} />} />
        <Route path="/checkout" element={<Checkout toastRef={toastRef} />} />
        <Route path="/order-success" element={<OrderSuccess toastRef={toastRef} />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/login" element={<Login toastRef={toastRef} />} />
        <Route path="/signup" element={<Signup toastRef={toastRef} />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login-otp" element={<LoginWithOtp toastRef={toastRef} />} />
        <Route path="/forgot-password" element={<ForgotPassword toastRef={toastRef} />} />
        <Route path="/reset-password" element={<ResetPassword toastRef={toastRef} />} />

        <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={["admin"]}> <ManageOrders  toastRef={toastRef} /></ProtectedRoute>}/>
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}> <AdminDashboard toastRef={toastRef} /></ProtectedRoute>}/>
        <Route path="/admin/add-product" element={<ProtectedRoute allowedRoles={["admin"]}><AddProductForm toastRef={toastRef} /></ProtectedRoute>}/>
        <Route path="/admin/view-products" element={<ProtectedRoute allowedRoles={["admin"]}> <AdminViewProducts toastRef={toastRef} /> </ProtectedRoute>}/>
        <Route path="/admin/products/edit/:id" element={<ProtectedRoute allowedRoles={["admin"]}> <EditProductPage toastRef={toastRef} /> </ProtectedRoute>}/>

        </Routes>
    </BrowserRouter>
  );
}

export default App;
