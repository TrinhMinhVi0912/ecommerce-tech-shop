// src/components/layout/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Laptop, Search, Heart, ShoppingCart, X } from 'lucide-react';
import useCartStore from '@/store/cartStore';
import useWishlistStore from '@/store/wishlistStore';
import { useAuth } from '@/context/AuthContext';

import useCategories from '../../features/category/hooks/useCategories';
import useBrands from '../../features/brand/hooks/useBrands';

import MegaNavDropdown from './MegaNavDropdown';
import UserMenuDropdown from './UserMenuDropdown';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands();

  const { totalItems, fetchCart } = useCartStore();
  const { wishlistCount, fetchWishlistCount } = useWishlistStore();
  const { isAuthenticated } = useAuth();

  // Fetch cart và wishlist khi đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlistCount();
    }
  }, [isAuthenticated, fetchCart, fetchWishlistCount]);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  // Xử lý phím Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  // Click outside để đóng search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const categoryItems = categoriesData?.data?.items ?? [];
  const brandItems = brandsData?.data?.items ?? [];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">

        {/* ==================== DESKTOP (≥ 768px) ==================== */}
        <div className="hidden md:flex items-center justify-between h-12 gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 flex-shrink-0">
            <Laptop className="w-5 h-5 text-blue-600" />
            <span className="text-base font-bold text-blue-600 tracking-tight">
              Tech Shop
            </span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-sm mx-2" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative flex items-center">
              <Search className="absolute left-3 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={handleKeyDown}
                placeholder="Tìm kiếm theo tên sản phẩm..."
                className="w-full pl-8 pr-10 py-1.5 text-xs bg-slate-100 text-gray-800 rounded-full focus:outline-none focus:border-blue-500 focus:bg-white border border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </form>
          </div>

          {/* Menu Links + Hover Dropdowns */}
          <nav className="flex items-center space-x-4 text-xs font-medium">
            <Link to="/" className="text-blue-600 font-semibold hover:text-blue-700">
              Trang chủ
            </Link>
            <Link to="/products" className="text-blue-600 font-semibold hover:text-blue-700">
              Sản phẩm
            </Link>
            <MegaNavDropdown
              label="Danh mục"
              items={categoryItems}
              linkPrefix="/products"
              queryParam="categoryId"
            />
            <MegaNavDropdown
              label="Thương hiệu"
              items={brandItems}
              linkPrefix="/products"
              queryParam="brandId"
            />
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2 pl-1">
            <div className="h-4 w-px bg-gray-200 mr-1" />

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-1 text-gray-600 hover:text-blue-600 rounded-full transition"
              title="Danh sách yêu thích"
            >
              <Heart className="w-4 h-4" />
              {isAuthenticated && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-1 text-gray-600 hover:text-blue-600 rounded-full transition"
              title="Giỏ hàng"
            >
              <ShoppingCart className="w-4 h-4" />
              {isAuthenticated && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <UserMenuDropdown />
          </div>
        </div>

        {/* ==================== MOBILE (< 768px) ==================== */}
        <div className="flex md:hidden items-center justify-between h-13 gap-2">
          <Link to="/" className="flex items-center gap-1 flex-shrink-0">
            <Laptop className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-bold text-blue-600">TechShop</span>
          </Link>

          <div
            className={`flex-1 transition-all ${isSearchOpen ? 'absolute inset-x-2 z-10 bg-white p-1' : 'max-w-[150px]'
              }`}
          >
            <form
              onSubmit={handleSearch}
              className="relative flex items-center"
            >
              <Search className="w-3.5 h-3.5 absolute left-2.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => {
                  setTimeout(() => {
                    if (!searchQuery) setIsSearchOpen(false);
                  }, 200);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Tìm kiếm..."
                className="w-full pl-7 pr-8 py-1.5 bg-slate-100 text-gray-800 text-xs rounded-full border border-transparent focus:outline-none focus:bg-white focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </form>
          </div>

          <div className="flex items-center gap-1.5">
            <Link to="/wishlist" className="relative p-1 text-gray-600">
              <Heart className="w-4 h-4" />
              {isAuthenticated && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative p-1 text-gray-600">
              <ShoppingCart className="w-4 h-4" />
              {isAuthenticated && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <UserMenuDropdown size="sm" />
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;