import React, { useState } from 'react';
import { Laptop, Search, Heart, ShoppingCart, X } from 'lucide-react';
import useCategories from '../../features/category/hooks/useCategories';
import useBrands from '../../features/brand/hook/useBrands';
import useBanners from '../../features/banner/hook/useBanners';


const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { categories } = useCategories();
  const { brands } = useBrands();
  const { banners } = useBanners();

  console.log("====================");
  
  console.log(categories);
  console.log(brands);
  console.log(banners);
  
  console.log("====================");


  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* ==================== 1. GIAO DIỆN DESKTOP (Màn hình ≥ 768px) ==================== */}
        <div className="hidden md:flex items-center justify-between h-13 gap-3">
          {/* Logo */}
          <div className="flex items-center gap-1.5 flex-shrink-0 cursor-pointer">
            <Laptop className="w-5 h-5 text-blue-600" />
            <span className="text-base font-bold text-blue-600 tracking-tight">Tech Shop</span>
          </div>

          {/* Ô Tìm Kiếm */}
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

          {/* Menu Links */}
          <nav className="flex items-center space-x-4 text-xs font-medium">
            <a href="#" className="text-blue-600 font-semibold">Trang chủ</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition">Sản phẩm</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition">Danh mục</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition">Thương hiệu</a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2 pl-1">
            <div className="h-4 w-px bg-gray-200 mr-1" />
            <button className="p-1 text-gray-600 hover:text-blue-600 rounded-full">
              <Heart className="w-4 h-4" />
            </button>
            <button className="p-1 text-gray-600 hover:text-blue-600 rounded-full">
              <ShoppingCart className="w-4 h-4" />
            </button>
            <button className="flex-shrink-0 ml-1 rounded-full border border-gray-200">
              <img
                className="w-7 h-7 rounded-full object-cover"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                alt="Avatar"
              />
            </button>
          </div>
        </div>

        {/* ==================== 2. GIAO DIỆN MOBILE (Màn hình < 768px) ==================== */}
        <div className="flex md:hidden items-center justify-between h-13 gap-2">
          {/* Logo Mobile */}
          <a href="/" className="flex items-center gap-1 flex-shrink-0">
            <Laptop className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-bold text-blue-600">TechShop</span>
          </a>

          {/* Search Bar Mobile */}
          <div className={`flex-1 transition-all ${isSearchOpen ? 'absolute inset-x-2 z-10 bg-white p-1' : 'max-w-[150px]'}`}>
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

          {/* Icons Mobile */}
          <div className="flex items-center gap-1.5">
            <a href="/wishlist" className="p-1 text-gray-600">
              <Heart className="w-4 h-4" />
            </a>
            <a href="/cart" className="p-1 text-gray-600">
              <ShoppingCart className="w-4 h-4" />
            </a>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
              alt="Avatar"
              className="w-6 h-6 rounded-full object-cover border border-gray-200"
            />
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;