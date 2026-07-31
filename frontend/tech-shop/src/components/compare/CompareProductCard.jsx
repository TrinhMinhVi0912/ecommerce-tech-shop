// src/components/compare/CompareProductCard.jsx
import React, { memo, useState } from 'react';
import { X, Package } from 'lucide-react';

const IMAGE_BASE_URL =
    import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:8080/api";

const CompareProductCard = memo(({ product, variant, side, onRemove, emptyText }) => {
    const [imageError, setImageError] = useState(false);

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[150px] text-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                <Package className="text-slate-300" size={32} />
                <p className="text-slate-400 text-sm mt-2">{emptyText}</p>
                <p className="text-xs text-slate-300">Tìm kiếm ở trên</p>
            </div>
        );
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getProductImage = () => {
        if (variant?.imagePath) {
            return variant.imagePath;
        }

        if (product.images && product.images.length > 0) {
            const thumbnail = product.images.find(img => img.thumbnail === true);
            return thumbnail?.imagePath || product.images[0]?.imagePath;
        }

        return product.thumbnailImagePath || null;
    };

    const imagePath = getProductImage();
    const imageUrl = imagePath && !imageError
        ? `${IMAGE_BASE_URL}${imagePath}`
        : "https://placehold.co/300x300?text=No+Image";

    const displayPrice = variant?.price || product.basePrice;
    const displayName = product.name || 'Sản phẩm';
    const brandName = product.brandResponse?.name || '';
    const categoryName = product.categoryResponse?.name || '';

    return (
        <div className="relative" style={{ position: 'relative', zIndex: 1 }}>
            {/* Nút X - đặt ở layer cao nhất */}
            <div
                className="absolute -top-2 -right-2"
                style={{ zIndex: 9999, position: 'absolute' }}
            >
                <button
                    onClick={onRemove}
                    className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-md flex items-center justify-center"
                    style={{ width: 24, height: 24 }}
                >
                    <X size={14} />
                </button>
            </div>

            <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-50 border border-slate-200">
                    <img
                        src={imageUrl}
                        alt={displayName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                            console.warn('⚠️ Image load error:', imagePath);
                            setImageError(true);
                            e.target.src = "https://placehold.co/300x300?text=No+Image";
                        }}
                    />
                </div>

                <div className="mt-2 w-full">
                    <p className="text-sm font-medium text-slate-900 line-clamp-2">
                        {displayName}
                    </p>
                    {brandName && (
                        <p className="text-xs text-slate-500 mt-0.5">
                            {brandName}
                        </p>
                    )}
                    <p className="text-sm font-bold text-blue-600 mt-1">
                        {formatPrice(displayPrice)}
                    </p>
                    {variant && variant.attributes && variant.attributes.length > 0 && (
                        <p className="text-xs text-slate-400 mt-0.5">
                            {variant.attributes.map(a => `${a.name}: ${a.value}`).join(', ')}
                        </p>
                    )}
                    {categoryName && (
                        <div className="mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                {categoryName}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    const prevProductId = prevProps.product?.productId;
    const nextProductId = nextProps.product?.productId;
    const prevVariantId = prevProps.variant?.variantId;
    const nextVariantId = nextProps.variant?.variantId;
    const prevSide = prevProps.side;
    const nextSide = nextProps.side;

    if (prevProductId !== nextProductId) return false;
    if (prevVariantId !== nextVariantId) return false;
    if (prevSide !== nextSide) return false;

    return true;
});

CompareProductCard.displayName = 'CompareProductCard';

export default CompareProductCard;