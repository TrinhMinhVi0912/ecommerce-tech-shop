// src/components/product/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { GitCompare, Heart } from 'lucide-react';
import { useCompare } from '@/features/product/hooks/useCompare';
import useWishlist from '@/features/wishlist/hooks/useWishlist';
import useAddToWishlist from '@/features/wishlist/hooks/useAddWishlist';
import useRemoveFromWishlist from '@/features/wishlist/hooks/useRemoveWishlist';
import { useAuth } from '@/context/AuthContext';
import useWishlistStore from '@/store/wishlistStore'; // ✅ Thêm import store

const IMAGE_BASE_URL =
  import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:8080/api";

const ProductCard = ({ product }) => {
  if (!product) return null;

  const {
    productId,
    name,
    basePrice,
    thumbnailImagePath,
  } = product;

  const { isAuthenticated } = useAuth();
  const { openPanel, addProductToCompare, isProductSelected } = useCompare();
  const { isInWishlist, refetch } = useWishlist();
  const { addToWishlist, loading: adding } = useAddToWishlist();
  const { removeFromWishlist, loading: removing } = useRemoveFromWishlist();
  const { fetchWishlistCount } = useWishlistStore(); // ✅ Lấy hàm fetch count

  const isInWishlistState = isInWishlist(productId);
  const isWishlistLoading = adding || removing;

  const imageUrl = thumbnailImagePath
    ? `${IMAGE_BASE_URL}${thumbnailImagePath}`
    : "https://placehold.co/300x300?text=No+Image";

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value ?? 0);

  const handleCompare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔄 Adding product to compare:', productId);

    try {
      openPanel();
      await addProductToCompare(productId);
    } catch (error) {
      console.error('❌ Error adding product to compare:', error);
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để sử dụng chức năng này');
      return;
    }

    try {
      if (isInWishlistState) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }

      // ✅ Refresh wishlist và cập nhật số lượng trên Navbar
      await refetch();
      await fetchWishlistCount(); // ✅ Cập nhật số lượng trên Navbar

    } catch (error) {
      console.error('Wishlist error:', error);
      alert('Không thể thực hiện thao tác. Vui lòng thử lại.');
    }
  };

  const isSelected = isProductSelected(productId);

  return (
    <div className="group bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      <Link to={`/products/${productId}`} className="flex flex-col flex-1">
        {/* Thanh icon trên cùng - chỉ hiện icon */}
        <div className="flex items-center justify-end gap-1 p-1.5 bg-slate-50/50 border-b border-slate-100">
          {/* Nút so sánh */}
          <button
            onClick={handleCompare}
            disabled={isSelected}
            className={`p-1.5 rounded-lg transition ${isSelected
              ? 'bg-blue-500 text-white cursor-not-allowed'
              : 'hover:bg-blue-500 hover:text-white text-slate-600'
              }`}
            title={isSelected ? 'Đã thêm vào so sánh' : 'Thêm vào so sánh'}
          >
            <GitCompare size={16} />
          </button>

          {/* Nút yêu thích */}
          <button
            onClick={handleWishlist}
            disabled={isWishlistLoading}
            className={`p-1.5 rounded-lg transition ${isInWishlistState
              ? 'bg-red-500 text-white'
              : 'hover:bg-red-500 hover:text-white text-slate-600'
              }`}
            title={isInWishlistState ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
          >
            <Heart size={16} className={isInWishlistState ? 'fill-white' : ''} />
          </button>
        </div>

        {/* Ảnh */}
        <div className="aspect-square bg-slate-50 overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Thông tin */}
        <div className="p-3 flex flex-col flex-1">
          <h3 className="text-sm font-medium text-slate-800 line-clamp-2 min-h-[40px] group-hover:text-blue-600 transition-colors">
            {name}
          </h3>

          <div className="mt-3">
            <span className="text-lg font-bold text-red-600">
              {formatCurrency(basePrice)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;