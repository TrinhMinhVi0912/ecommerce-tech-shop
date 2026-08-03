// src/components/product/productdetails/ProductVariants.jsx
import { useState, useEffect } from "react";

export default function ProductVariants({
    variants = [],
    selectedVariant = null,
    onVariantChange
}) {
    const [selectedId, setSelectedId] = useState(selectedVariant?.variantId || variants[0]?.variantId || null);

    useEffect(() => {
        if (selectedVariant) {
            setSelectedId(selectedVariant.variantId);
        }
    }, [selectedVariant]);

    const handleSelectVariant = (variant) => {
        setSelectedId(variant.variantId);
        if (onVariantChange) {
            onVariantChange(variant);
        }
    };

    if (variants.length === 0) return null;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Lấy text ngắn cho badge
    const getShortLabel = (variant) => {
        if (!variant.attributes || variant.attributes.length === 0) {
            return `Variant ${variant.variantId}`;
        }
        const importantAttrs = ['RAM', 'SSD', 'Storage', 'CPU'];
        const attrs = variant.attributes
            .filter(attr => importantAttrs.includes(attr.name))
            .map(attr => attr.value)
            .join(' - ');
        return attrs || variant.attributes.map(attr => attr.value).join(' - ');
    };

    return (
        <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700 block">
                Chọn phiên bản ({variants.length}):
            </label>

            <div className="space-y-2">
                {variants.map((variant) => {
                    const isSelected = selectedId === variant.variantId;
                    const isOutOfStock = variant.stock === 0;
                    const shortLabel = getShortLabel(variant);

                    return (
                        <button
                            key={variant.variantId}
                            onClick={() => {
                                if (!isOutOfStock) {
                                    handleSelectVariant(variant);
                                }
                            }}
                            disabled={isOutOfStock}
                            className={`
                                w-full text-left p-4 rounded-xl border-2 transition-all
                                ${isSelected
                                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                                    : isOutOfStock
                                        ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                }
                            `}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    {/* Tên ngắn gọn */}
                                    <p className={`text-sm font-medium ${isSelected ? 'text-blue-600' : 'text-slate-700'}`}>
                                        {shortLabel}
                                    </p>

                                    {/* ✅ Nội dung attributes có thể cuộn - Ẩn thanh cuộn */}
                                    {variant.attributes && variant.attributes.length > 0 && (
                                        <div
                                            className="mt-1.5 max-h-16 overflow-y-auto pr-1 scrollbar-hide"
                                            style={{
                                                scrollbarWidth: 'none', /* Firefox */
                                                msOverflowStyle: 'none', /* IE and Edge */
                                            }}
                                        >
                                            <style>{`
                                                .scrollbar-hide::-webkit-scrollbar {
                                                    display: none;
                                                }
                                            `}</style>
                                            <div className="space-y-0.5">
                                                {variant.attributes.map((attr, index) => (
                                                    <p key={index} className="text-xs text-slate-500">
                                                        <span className="font-medium">{attr.name}:</span> {attr.value}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <p className="text-xs text-slate-400 mt-1">
                                        SKU: {variant.sku}
                                    </p>
                                </div>

                                <div className="text-right flex-shrink-0">
                                    <p className="text-sm font-bold text-slate-900">
                                        {formatPrice(variant.price)}
                                    </p>
                                    {isOutOfStock ? (
                                        <span className="text-xs font-medium text-red-500">Hết hàng</span>
                                    ) : (
                                        <span className="text-xs text-slate-400">Còn {variant.stock}</span>
                                    )}
                                    {isSelected && (
                                        <div className="mt-1">
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                Đã chọn
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}