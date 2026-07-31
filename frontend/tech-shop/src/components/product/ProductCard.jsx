// src/components/product/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { GitCompare } from 'lucide-react';
import { useCompare } from '@/features/product/hooks/useCompare';

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

  // ✅ Lấy các hàm từ useCompare
  const { openPanel, addProductToCompare, isProductSelected } = useCompare();

  const imageUrl = thumbnailImagePath
    ? `${IMAGE_BASE_URL}${thumbnailImagePath}`
    : "https://placehold.co/300x300?text=No+Image";

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value ?? 0);

  const handleCompare = async (e) => {
    e.preventDefault(); // Ngăn chặn navigation
    e.stopPropagation(); // Ngăn chặn sự kiện lan truyền
    console.log('🔄 Adding product to compare:', productId);

    try {
      openPanel();
      const result = await addProductToCompare(productId);
      console.log('✅ Add product result:', result);
    } catch (error) {
      console.error('❌ Error adding product to compare:', error);
    }
  };

  const isSelected = isProductSelected(productId);

  return (
    <div className="group bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col relative">
      {/* Nút so sánh */}
      <button
        onClick={handleCompare}
        disabled={isSelected}
        className={`absolute top-2 right-2 p-1.5 rounded-lg transition z-10 ${isSelected
          ? 'bg-blue-500 text-white cursor-not-allowed'
          : 'bg-white/80 hover:bg-blue-500 hover:text-white text-slate-600 hover:shadow-md'
          }`}
        title={isSelected ? 'Đã thêm vào so sánh' : 'Thêm vào so sánh'}
      >
        <GitCompare size={16} />
      </button>

      <Link to={`/products/${productId}`} className="flex flex-col flex-1">
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