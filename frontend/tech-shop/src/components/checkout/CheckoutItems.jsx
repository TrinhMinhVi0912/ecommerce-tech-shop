// src/components/checkout/CheckoutItems.jsx
import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import useCart from '@/features/cart/hooks/useCart';
import { getImageUrl } from '@/utils/imageUtils';

const CheckoutItems = ({ cartItemIds = [] }) => {
    const { data, loading } = useCart();
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (data?.data?.items) {
            const allItems = data.data.items;
            const filtered = allItems.filter(item => cartItemIds.includes(item.cartItemId));
            setItems(filtered);
        }
    }, [data, cartItemIds]);

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="h-16 bg-slate-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return null;
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                <ShoppingBag size={18} className="text-blue-600" />
                Sản phẩm đặt hàng ({items.length})
            </h3>
            <div className="space-y-3">
                {items.map((item) => (
                    <div key={item.cartItemId} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                        <img
                            src={getImageUrl(item.thumbnail) || '/images/products/default.jpg'}
                            alt={item.productName}
                            className="w-12 h-12 object-cover rounded-lg bg-slate-50"
                            onError={(e) => {
                                e.target.src = '/images/products/default.jpg';
                            }}
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">
                                {item.productName}
                            </p>
                            {item.variantAttributes && item.variantAttributes.length > 0 && (
                                <p className="text-xs text-slate-500">
                                    {item.variantAttributes.map(attr => `${attr.attributeName}: ${attr.value}`).join(' | ')}
                                </p>
                            )}
                            <div className="flex items-center gap-4 mt-0.5 text-sm">
                                <span className="text-slate-500">SL: {item.quantity}</span>
                                <span className="text-blue-600 font-medium">{formatPrice(item.unitPrice)}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="font-bold text-red-600">{formatPrice(item.subTotal)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CheckoutItems;