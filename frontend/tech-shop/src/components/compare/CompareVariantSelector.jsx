// src/components/compare/CompareVariantSelector.jsx
import React, { useState, useCallback, memo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import useCompareStore from '@/store/compareStore';

const CompareVariantSelector = memo(({ product, side }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { setLeftProduct, setRightProduct, leftProduct, rightProduct } = useCompareStore();

    if (!product || !product.variants || product.variants.length === 0) {
        return null;
    }

    const handleSelectVariant = useCallback((variant) => {
        if (side === 'left') {
            setLeftProduct(product, variant);
        } else {
            setRightProduct(product, variant);
        }
        setIsOpen(false);
    }, [product, side, setLeftProduct, setRightProduct]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getCurrentVariant = () => {
        if (side === 'left') {
            return leftProduct?.leftVariant;
        }
        return rightProduct?.rightVariant;
    };

    const selectedVariant = getCurrentVariant();

    return (
        <div className="mt-3 border-t border-slate-100 pt-2 relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-xs text-slate-600 hover:text-blue-600 transition"
            >
                <span>Chọn biến thể</span>
                {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {isOpen && (
                <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                    {product.variants.map((variant) => {
                        const isSelected = selectedVariant?.variantId === variant.variantId;
                        const attrText = variant.attributes?.map(a => a.value).join(' - ') || `Variant ${variant.variantId}`;

                        return (
                            <button
                                key={variant.variantId}
                                onClick={() => handleSelectVariant(variant)}
                                className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition ${isSelected
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'hover:bg-slate-50 text-slate-600'
                                    }`}
                            >
                                <span className="truncate">{attrText}</span>
                                <span className="font-medium">{formatPrice(variant.price)}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
});

CompareVariantSelector.displayName = 'CompareVariantSelector';

export default CompareVariantSelector;