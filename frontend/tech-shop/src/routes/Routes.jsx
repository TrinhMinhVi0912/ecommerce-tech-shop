import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserLayout from "../layouts/UserLayout/UserLayout";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";

// User Pages
import Home from "../pages/Home/Home";
import ProductList from "../pages/Product/ProductList";
import ProductDetail from "../pages/Product/ProductDetail";
import Cart from "../pages/Cart/Cart";
import Wishlist from "../pages/Wishlist/Wishlist";
import Profile from "../pages/Profile/Profile";
import OrderHistory from "../pages/Profile/OrderHistory";
import OrderDetail from "../pages/Profile/OrderDetail";

// Auth Pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

// Admin Pages
import Dashboard from "../pages/Admin/Dashboard";

// Common
import NotFound from "../pages/NotFound/NotFound";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* ================= USER ================= */}
                <Route element={<UserLayout />}>
                    <Route path="/" element={<Home />} />

                    <Route path="/products" element={<ProductList />} />
                    <Route path="/products/:id" element={<ProductDetail />} />

                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />

                    <Route path="/profile" element={<Profile />} />
                    <Route path="/orders" element={<OrderHistory />} />
                    <Route path="/orders/:id" element={<OrderDetail />} />
                </Route>

                {/* ================= AUTH ================= */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                {/* ================= ADMIN ================= */}
                <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<Dashboard />} />
                </Route>

                {/* ================= 404 ================= */}
                <Route path="*" element={<NotFound />} />

            </Routes>
        </BrowserRouter>
    );
}
