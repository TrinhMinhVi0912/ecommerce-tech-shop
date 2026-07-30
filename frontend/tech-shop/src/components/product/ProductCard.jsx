import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart } from 'lucide-react';

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:8080/api';

const ProductCard = ({ product }) => {
  if (!product) return null;

  // Trích xuất các trường dữ liệu an toàn
  const {
    productId,
    id,
    name,
    basePrice,   // tên field đúng từ API
    price,       // fallback nếu có dùng tên khác
    originalPrice,
    discountPercent,
    thumbnailImagePath, // tên field đúng từ API
    imagePath,          // fallback
    thumbnail,
    rating = 5,
    brandName,
  } = product;

  const actualId = productId || id;
  // ưu tiên thumbnailImagePath (từ API), rồi fallback
  const rawImage = thumbnailImagePath || imagePath || thumbnail;
  const displayImage = rawImage
    ? (rawImage.startsWith('http') ? rawImage : `${IMAGE_BASE_URL}${rawImage}`)
    : 'https://placehold.co/300x300?text=No+Image';
  const displayPrice = basePrice || price;

  // Format tiền tệ VND
  const formatCurrency = (amount) => {
    if (!amount) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div className="group relative bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 flex flex-col justify-between overflow-hidden">

      {/* 1. Phần hình ảnh & Badges */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden flex items-center justify-center p-4">
        {/* Badge giảm giá (nếu có) */}
        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{discountPercent}%
          </span>
        )}

        {/* Nút Yêu thích (Wishlist) */}
        <button
          type="button"
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-red-500 transition-colors shadow-sm"
          title="Thêm vào yêu thích"
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Ảnh sản phẩm */}
        <Link to={`/products/${actualId}`} className="w-full h-full flex items-center justify-center">
          <img
            src={displayImage}
            alt={name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>
      </div>

      {/* 2. Thông tin sản phẩm */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Brand Name (nếu có) */}
          {brandName && (
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              {brandName}
            </span>
          )}

          {/* Tên sản phẩm */}
          <Link to={`/products/${actualId}`}>
            <h3 className="text-xs sm:text-sm font-medium text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[2.5rem] mt-0.5">
              {name}
            </h3>
          </Link>
        </div>

        {/* Đánh giá Sao */}
        <div className="flex items-center space-x-1">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-amber-400' : 'text-slate-200'
                  }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">({rating})</span>
        </div>

        {/* Giá cả & Nút thêm giỏ hàng */}
        <div className="flex items-end justify-between pt-2 border-t border-slate-50">
          <div>
            {/* Giá khuyến mãi / Giá bán */}
            <p className="text-sm sm:text-base font-bold text-blue-600">
              {formatCurrency(displayPrice)}
            </p>
            {/* Giá gốc (nếu có giảm giá) */}
            {originalPrice && originalPrice > displayPrice && (
              <p className="text-[11px] text-slate-400 line-through">
                {formatCurrency(originalPrice)}
              </p>
            )}
          </div>

          {/* Button Thêm vào giỏ */}
          <button
            type="button"
            className="p-2 rounded-lg bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white transition-all active:scale-95"
            title="Thêm vào giỏ hàng"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProductCard;