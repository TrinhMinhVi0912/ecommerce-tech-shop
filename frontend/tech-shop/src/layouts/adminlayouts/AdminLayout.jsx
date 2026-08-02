// src/layouts/adminlayouts/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Image as ImageIcon,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Home,
  Laptop
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import useLogout from '@/features/auth/hooks/useLogout';

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { logout } = useLogout();

  const menuItems = [
    { path: '/admin', label: 'Tổng quan', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Quản lý sản phẩm', icon: Package },
    { path: '/admin/orders', label: 'Quản lý đơn hàng', icon: ShoppingBag },
    { path: '/admin/users', label: 'Quản lý người dùng', icon: Users },
    { path: '/admin/coupons', label: 'Quản lý mã khuyến mãi', icon: Tag },
    { path: '/admin/banners', label: 'Quản lý Banner', icon: ImageIcon },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    return location.pathname.startsWith(path) && path !== '/admin';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ===== SIDEBAR - FIXED ===== */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-slate-900 text-white transition-all duration-300 flex flex-col z-50
          ${isCollapsed ? 'w-[72px]' : 'w-[260px]'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center gap-2 px-4 py-4 border-b border-slate-700/50 ${isCollapsed ? 'justify-center' : ''}`}>
          <Laptop className="w-6 h-6 text-blue-400 flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-lg font-bold text-white tracking-tight">
              TechShop Admin
            </span>
          )}
        </div>

        {/* Nút quay về trang user */}
        <div className="px-3 py-3 border-b border-slate-700/50">
          <Link
            to="/"
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm
              ${isCollapsed ? 'justify-center' : ''}
            `}
            title={isCollapsed ? 'Về trang chủ' : ''}
          >
            <Home size={20} className="flex-shrink-0" />
            {!isCollapsed && <span>Về trang chủ</span>}
          </Link>
        </div>

        {/* Menu Items - Scrollable */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm
                  ${active
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title={isCollapsed ? item.label : ''}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
                {active && !isCollapsed && (
                  <span className="ml-auto w-1.5 h-8 bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout - Fixed at bottom */}
        <div className="border-t border-slate-700/50 p-3 space-y-2 flex-shrink-0">
          {!isCollapsed && (
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-slate-800/50">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                {user?.fullName?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.fullName || 'Admin'}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user?.role || 'Administrator'}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm
              ${isCollapsed ? 'justify-center' : ''}
            `}
            title={isCollapsed ? 'Đăng xuất' : ''}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {!isCollapsed && <span>Đăng xuất</span>}
          </button>

          {/* Toggle Collapse Button */}
          <button
            onClick={toggleSidebar}
            className="hidden md:flex w-full items-center justify-center p-2 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? 'ml-[72px]' : 'ml-[260px]'}`}>
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <Menu size={24} className="text-slate-600" />
          </button>
          <span className="font-bold text-slate-800">TechShop Admin</span>
          <Link
            to="/"
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
            title="Về trang chủ"
          >
            <Home size={20} />
          </Link>
        </header>

        {/* Overlay for mobile */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;