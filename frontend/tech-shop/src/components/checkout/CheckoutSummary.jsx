// src/components/checkout/CheckoutSummary.jsx
import React, { useState, useEffect } from 'react';
import useCart from '@/features/cart/hooks/useCart';

const CheckoutSummary = ({ cartItemIds = [], couponCode = '' }) => {
    const { data, loading } = useCart();
    const [summary, setSummary] = useState({
        subtotal: 0,
        discount: 0,
        shipping: 0,
        total: 0
    });

    useEffect(() => {
        if (data?.data?.items) {
            const selectedItems = data.data.items.filter(
                item => cartItemIds.includes(item.cartItemId)
            );

            const subtotal = selectedItems.reduce((sum, item) => sum + (item.subTotal || 0), 0);
            const shipping = subtotal >= 500000 ? 0 : 30000;
            const discount = couponCode ? 0 : 0; // Tạm tính chưa có coupon
            const total = subtotal - discount + shipping;

            setSummary({ subtotal, discount, shipping, total });
        }
    }, [data, cartItemIds, couponCode]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-20">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
                Tóm tắt đơn hàng
            </h2>

            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tạm tính</span>
                    <span className="font-medium">{formatPrice(summary.subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Giảm giá</span>
                    <span className="font-medium text-green-600">-{formatPrice(summary.discount)}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Phí vận chuyển</span>
                    <span className="font-medium">
                        {summary.shipping === 0 ? 'Miễn phí' : formatPrice(summary.shipping)}
                    </span>
                </div>

                <div className="border-t border-slate-200 pt-3">
                    <div className="flex justify-between text-base font-bold">
                        <span>Tổng cộng</span>
                        <span className="text-blue-600">{formatPrice(summary.total)}</span>
                    </div>
                    {summary.shipping > 0 && (
                        <p className="text-xs text-slate-500 mt-1">
                            * Miễn phí vận chuyển cho đơn hàng từ 500.000đ
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckoutSummary;