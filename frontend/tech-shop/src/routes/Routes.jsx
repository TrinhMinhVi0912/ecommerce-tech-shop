// src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserLayout from "../layouts/userlayouts/UserLayout";
import AuthLayout from "../layouts/authlayout/AuthLayout";
import AdminLayout from "../layouts/adminlayouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

// User Pages
import Home from "../pages/home/Home";
import ProductList from "../pages/product/ProductList";
import ProductDetail from "../pages/product/ProductDetail";
import Cart from "../pages/cart/Cart";
import Wishlist from "../pages/wishlist/Wishlist";
import Checkout from "../pages/checkout/Checkout";
import VnPayReturn from "../pages/checkout/VnPayReturn";
import Profile from "../pages/profile/Profile";
import OrderHistory from "../pages/profile/OrderHistory";
import OrderDetail from "../pages/profile/OrderDetail";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Admin Pages
import Dashboard from '../pages/admin/DashBoard';
import Products from '../pages/admin/Product';
import Orders from '../pages/admin/Orders';
import Users from '../pages/admin/Users';
import Coupons from '../pages/admin/Coupon';
import Banners from '../pages/admin/Banner';
import Settings from '../pages/admin/Settings';

// Common
import NotFound from "../pages/notfound/NotFound";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* ================= USER ================= */}
                <Route element={<UserLayout />}>
                    <Route path="/" element={<Home />} />

                    <Route
                        path="/products"
                        element={<ProductList key={window.location.search} />}
                    />

                    <Route path="/products/:id" element={<ProductDetail />} />

                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/checkout" element={<Checkout />} />

                    {/* ✅ Route VNPay return - KHÔNG cần ProtectedRoute */}
                    <Route path="/vnpay-return" element={<VnPayReturn />} />

                    {/* Private user routes protected by ProtectedRoute */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/orders" element={<OrderHistory />} />
                        <Route path="/orders/:id" element={<OrderDetail />} />
                    </Route>
                </Route>

                {/* ================= AUTH ================= */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                {/* ================= ADMIN ================= */}
                <Route element={<ProtectedRoute allowedRoles={["ADMIN", "Admin"]} />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/admin" element={<Dashboard />} />
                        <Route path="/admin/products" element={<Products />} />
                        <Route path="/admin/orders" element={<Orders />} />
                        <Route path="/admin/users" element={<Users />} />
                        <Route path="/admin/coupons" element={<Coupons />} />
                        <Route path="/admin/banners" element={<Banners />} />
                        <Route path="/admin/settings" element={<Settings />} />
                    </Route>
                </Route>

                {/* ================= 404 ================= */}
                <Route path="*" element={<NotFound />} />

            </Routes>
        </BrowserRouter>
    );
}