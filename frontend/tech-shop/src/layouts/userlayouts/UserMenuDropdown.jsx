// src/components/layout/UserMenuDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, Heart, ShoppingBag, UserCircle, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import useLogout from '@/features/auth/hooks/useLogout';
import { getImageUrl } from '@/utils/imageUtils';

const UserMenuDropdown = ({ size = 'md' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshUser } = useAuth();
  const { logout } = useLogout();

  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);
  const fetchTimeoutRef = useRef(null);
  const hasFetchedRef = useRef(false); // ✅ Đánh dấu đã fetch

  // ✅ Lắng nghe thay đổi của user để cập nhật avatar - CHỈ GỌI 1 LẦN
  useEffect(() => {
    // Nếu đã fetch rồi hoặc không có avatar, không làm gì
    if (!user?.avatarUrl || hasFetchedRef.current) {
      return;
    }

    // Nếu đang fetch, không làm gì
    if (isFetching) {
      return;
    }

    // Clear timeout cũ
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    // ✅ Đợi 0.5s rồi fetch 1 lần duy nhất
    fetchTimeoutRef.current = setTimeout(async () => {
      if (hasFetchedRef.current) {
        return;
      }

      try {
        setIsFetching(true);
        console.log('🔄 Fetching navbar avatar...');

        const refreshedUser = await refreshUser();
        const avatarPath = refreshedUser?.avatarUrl || user?.avatarUrl;

        if (avatarPath) {
          const url = getImageUrl(avatarPath);
          console.log('🖼️ Navbar avatar set:', url);
          setAvatarUrl(url);
          hasFetchedRef.current = true; // ✅ Đánh dấu đã fetch
        }
      } catch (error) {
        console.error('Error fetching avatar:', error);
      } finally {
        setIsFetching(false);
      }
    }, 500);

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [user?.avatarUrl, refreshUser, isFetching]);

  // ✅ Lắng nghe sự kiện refresh avatar từ ProfileAvatar
  useEffect(() => {
    const handleAvatarUpdate = (event) => {
      console.log('🔄 Avatar update event received in Navbar');

      // Reset flag để cho phép fetch lại
      hasFetchedRef.current = false;

      // Nếu có avatar URL trong event, cập nhật ngay
      if (event?.detail?.avatarUrl) {
        const url = getImageUrl(event.detail.avatarUrl);
        setAvatarUrl(url);
        hasFetchedRef.current = true;
      } else if (user?.avatarUrl) {
        // Nếu không có trong event, fetch lại sau 0.5s
        if (fetchTimeoutRef.current) {
          clearTimeout(fetchTimeoutRef.current);
        }

        fetchTimeoutRef.current = setTimeout(async () => {
          if (hasFetchedRef.current) return;

          try {
            const refreshedUser = await refreshUser();
            if (refreshedUser?.avatarUrl) {
              const url = getImageUrl(refreshedUser.avatarUrl);
              setAvatarUrl(url);
              hasFetchedRef.current = true;
            }
          } catch (error) {
            console.error('Error refreshing avatar:', error);
          }
        }, 500);
      }
    };

    window.addEventListener('avatar-updated', handleAvatarUpdate);
    return () => {
      window.removeEventListener('avatar-updated', handleAvatarUpdate);
    };
  }, [user?.avatarUrl, refreshUser]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
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
              console.error('❌ Avatar load error:', avatarUrl);
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
          {/* User Info */}
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

          {/* Menu Items */}
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

          {/* Logout */}
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