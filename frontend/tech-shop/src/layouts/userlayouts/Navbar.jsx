import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Laptop, Search, Heart, ShoppingCart } from 'lucide-react';

import useCategories from '../../features/category/hooks/useCategories';
import useBrands from '../../features/brand/hooks/useBrands';
import useCart from '../../features/cart/hooks/useCart';

import MegaNavDropdown from './MegaNavDropdown';
import UserMenuDropdown from './UserMenuDropdown';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands();
  const { data: cartData } = useCart();

  // API trả về ApiResponse → data.items
  const categoryItems = (categoriesData?.data?.items ?? []).map((c) => ({
    id: c.categoryId,
    name: c.name,
  }));

  const brandItems = (brandsData?.data?.items ?? []).map((b) => ({
    id: b.brandId,
    name: b.name,
  }));

  const totalCartItems = cartData?.data?.totalItems ?? 0;

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">

        {/* ==================== DESKTOP (≥ 768px) ==================== */}
        <div className="hidden md:flex items-center justify-between h-13 gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 flex-shrink-0">
            <Laptop className="w-5 h-5 text-blue-600" />
            <span className="text-base font-bold text-blue-600 tracking-tight">
              Tech Shop
            </span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-sm mx-2">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm laptop, bàn phím..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 text-gray-800 rounded-full focus:outline-none focus:border-blue-500 focus:bg-white border border-transparent transition-all"
              />
            </div>
          </div>

          {/* Menu Links + Hover Dropdowns */}
          {/* Thêm class "static" vào thẻ nav */}
          <nav className="flex items-center space-x-4 text-xs font-medium">
            <Link to="/" className="text-blue-600 font-semibold hover:text-blue-700">
              Trang chủ
            </Link>
            <Link to="/product" className="text-blue-600 font-semibold hover:text-blue-700">
              Sản phẩm
            </Link>
            <MegaNavDropdown
              label="Danh mục"
              items={categoryItems}
              linkPrefix="/products"
              queryParam="category"
            />
            <MegaNavDropdown
              label="Thương hiệu"
              items={brandItems}
              linkPrefix="/products"
              queryParam="brand"
            />
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2 pl-1">
            <div className="h-4 w-px bg-gray-200 mr-1" />

            <Link
              to="/wishlist"
              className="p-1 text-gray-600 hover:text-blue-600 rounded-full transition"
              title="Danh sách yêu thích"
            >
              <Heart className="w-4 h-4" />
            </Link>

            <Link
              to="/cart"
              className="relative p-1 text-gray-600 hover:text-blue-600 rounded-full transition"
              title="Giỏ hàng"
            >
              <ShoppingCart className="w-4 h-4" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </Link>

            {/* Avatar → hover hiện menu user */}
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
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => setIsSearchOpen(false)}
                className="w-full pl-7 pr-6 py-1.5 bg-slate-100 text-gray-800 text-xs rounded-full border border-transparent focus:outline-none focus:bg-white focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Link to="/wishlist" className="p-1 text-gray-600">
              <Heart className="w-4 h-4" />
            </Link>
            <Link to="/cart" className="relative p-1 text-gray-600">
              <ShoppingCart className="w-4 h-4" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </Link>

            {/* Mobile: dùng lại UserMenuDropdown (nên thêm click thay hover) */}
            <UserMenuDropdown size="sm" />
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;