import { Link, useNavigate } from "react-router-dom";
import { User, Package, Heart, LogOut, Shield } from "lucide-react";
import useLogout from "../../features/auth/hooks/useLogout";
import { getToken, removeToken } from "../../utils/token";
import { useMemo, useState } from "react";

export default function UserMenuDropdown() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useLogout();

  const token = getToken();
  const isLoggedIn = !!token;

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error(e);
    } finally {
      removeToken();
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Link
          to="/login"
          className="text-slate-600 hover:text-blue-600 transition"
        >
          Đăng nhập
        </Link>

        <Link
          to="/register"
          className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Đăng ký
        </Link>
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold shadow-sm hover:bg-blue-700 transition">
        {user?.userName?.charAt(0)?.toUpperCase() || "U"}
      </button>

      {open && (
        <div className="absolute right-0 top-full pt-3 z-50">
          <div className="w-64 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">

            <div className="px-5 py-4 border-b border-slate-100">
              <p className="font-semibold text-slate-900 truncate">
                {user?.userName}
              </p>

              <p className="text-sm text-slate-500 truncate mt-1">
                {user?.email}
              </p>

              <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                <Shield className="w-3 h-3" />
                {user?.role}
              </div>
            </div>

            <div className="py-2">

              <Link
                to="/profile"
                className="flex items-center gap-3 px-5 py-3 text-sm text-slate-700 hover:bg-slate-50 transition"
              >
                <User className="w-4 h-4" />
                Hồ sơ của tôi
              </Link>

              <Link
                to="/orders"
                className="flex items-center gap-3 px-5 py-3 text-sm text-slate-700 hover:bg-slate-50 transition"
              >
                <Package className="w-4 h-4" />
                Đơn hàng của tôi
              </Link>

              <Link
                to="/wishlist"
                className="flex items-center gap-3 px-5 py-3 text-sm text-slate-700 hover:bg-slate-50 transition"
              >
                <Heart className="w-4 h-4" />
                Danh sách yêu thích
              </Link>

            </div>

            <div className="border-t border-slate-100 p-2">

              <button
                onClick={handleLogout}
                className="w-full rounded-xl flex items-center gap-3 px-3 py-3 text-sm text-red-600 hover:bg-red-50 transition"
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}