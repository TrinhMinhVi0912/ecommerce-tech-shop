// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    if (allowedRoles && allowedRoles.length > 0) {
        const userRole = user?.role || user?.authorities?.[0]?.authority;
        if (!userRole || !allowedRoles.includes(userRole)) {
            return <Navigate to="/" replace />;
        }
    }

    return <Outlet />;
}