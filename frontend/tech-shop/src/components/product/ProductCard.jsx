import React from "react";
import { Link } from "react-router-dom";

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

  const imageUrl = thumbnailImagePath
    ? `${IMAGE_BASE_URL}${thumbnailImagePath}`
    : "https://placehold.co/300x300?text=No+Image";

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value ?? 0);

  return (
    <Link
      to={`/products/${productId}`}
      className="
                group
                bg-white
                rounded-xl
                border
                border-slate-200
                hover:border-blue-500
                hover:shadow-lg
                transition-all
                duration-300
                overflow-hidden
                flex
                flex-col
            "
    >
      {/* Ảnh */}
      <div className="aspect-square bg-slate-50 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="
                        w-full
                        h-full
                        object-contain
                        p-4
                        group-hover:scale-105
                        transition-transform
                        duration-300
                    "
          loading="lazy"
        />
      </div>

      {/* Thông tin */}
      <div className="p-3 flex flex-col flex-1">

        <h3
          className="
                        text-sm
                        font-medium
                        text-slate-800
                        line-clamp-2
                        min-h-[40px]
                        group-hover:text-blue-600
                        transition-colors
                    "
        >
          {name}
        </h3>

        <div className="mt-3">

          <span className="text-lg font-bold text-red-600">
            {formatCurrency(basePrice)}
          </span>

        </div>

      </div>
    </Link>
  );
};

export default ProductCard;