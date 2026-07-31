// src/components/layout/UserMenuDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, Heart, ShoppingBag, UserCircle, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import useLogout from '@/features/auth/hooks/useLogout';
import { getImageUrl } from '@/utils/imageUtils';

const UserMenuDropdown = ({ size = 'md' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshUser } = useAuth();
  const { logout } = useLogout();

  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  // ✅ Refresh user khi component mount (để đảm bảo avatar mới nhất)
  useEffect(() => {
    if (isAuthenticated) {
      refreshUser();
    }
  }, [isAuthenticated, refreshUser]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsOpen(false);
  };

  const avatarSize = size === 'sm' ? 'w-8 h-8' : 'w-9 h-9';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  console.log('🔍 UserMenuDropdown - isAuthenticated:', isAuthenticated);
  console.log('🔍 UserMenuDropdown - user:', user);

  // Nếu chưa đăng nhập
  if (!isAuthenticated) {
    return (
      <div className="relative">
        <Link
          to="/login"
          className={`flex items-center gap-1.5 ${textSize} text-gray-600 hover:text-blue-600 transition font-medium`}
        >
          <UserCircle size={size === 'sm' ? 18 : 20} />
          <span className="hidden sm:inline">Đăng nhập</span>
        </Link>
      </div>
    );
  }

  const avatarUrl = getImageUrl(user?.avatarUrl);
  const displayName = user?.fullName || user?.userName || 'User';
  const firstLetter = displayName.charAt(0).toUpperCase();
  const userRole = user?.role || 'USER';

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`${avatarSize} rounded-full overflow-hidden border-2 border-transparent hover:border-blue-500 transition flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&size=40`;
            }}
          />
        ) : (
          <span className={`${size === 'sm' ? 'text-sm' : 'text-base'}`}>
            {firstLetter}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="font-medium text-slate-900 truncate">
              {displayName}
            </div>
            <div className="text-xs text-slate-500 truncate">
              {user?.email}
            </div>
            <div className="mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {userRole}
              </span>
            </div>
          </div>

          <div className="py-1">
            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
              onClick={() => setIsOpen(false)}
            >
              <User size={16} />
              <span>Thông tin cá nhân</span>
            </Link>

            <Link
              to="/orders"
              className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingBag size={16} />
              <span>Đơn hàng của tôi</span>
            </Link>

            <Link
              to="/wishlist"
              className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
              onClick={() => setIsOpen(false)}
            >
              <Heart size={16} />
              <span>Danh sách yêu thích</span>
            </Link>

            {userRole === 'ADMIN' && (
              <Link
                to="/admin"
                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition border-t border-slate-100 mt-1 pt-1"
                onClick={() => setIsOpen(false)}
              >
                <Shield size={16} />
                <span>Quản trị</span>
              </Link>
            )}
          </div>

          <div className="border-t border-slate-100 pt-1">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition w-full text-left"
            >
              <LogOut size={16} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenuDropdown;