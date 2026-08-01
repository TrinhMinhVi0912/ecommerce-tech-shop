// src/components/checkout/CheckoutSuccess.jsx
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '@/store/cartStore';

const CheckoutSuccess = ({ orderData }) => {
    const navigate = useNavigate();
    const { fetchCart } = useCartStore();

    // ✅ Refresh cart khi component mount
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPaymentMethodLabel = (method) => {
        const methods = {
            'COD': 'Thanh toán khi nhận hàng',
            'VNPAY': 'VNPay',
            'MOMO': 'MoMo'
        };
        return methods[method] || method;
    };

    const getOrderStatusLabel = (status) => {
        const statuses = {
            'PENDING': 'Chờ xác nhận',
            'CONFIRMED': 'Đã xác nhận',
            'SHIPPING': 'Đang giao hàng',
            'DELIVERED': 'Đã giao',
            'CANCELLED': 'Đã hủy'
        };
        return statuses[status] || status;
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="bg-white rounded-xl border border-slate-200 p-8">
                <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                        Đặt hàng thành công!
                    </h1>
                    <p className="text-slate-500 mb-6">
                        Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất.
                    </p>
                </div>

                {/* Order Info */}
                <div className="bg-slate-50 rounded-xl p-6 text-left space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Mã đơn hàng:</span>
                        <span className="text-slate-700">{orderData.orderId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Phương thức:</span>
                        <span className="text-slate-700">{getPaymentMethodLabel(orderData.paymentMethod)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Trạng thái:</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${orderData.orderStatus === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : orderData.orderStatus === 'CONFIRMED'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-slate-100 text-slate-800'
                            }`}>
                            {getOrderStatusLabel(orderData.orderStatus)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Thời gian:</span>
                        <span className="text-slate-700">{formatDate(orderData.createdAt)}</span>
                    </div>
                    <div className="pt-3 border-t border-slate-200">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Tổng tiền:</span>
                            <span className="text-2xl font-bold text-blue-600">
                                {formatPrice(orderData.finalPrice || orderData.totalPrice)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/orders"
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
                    >
                        Xem đơn hàng của tôi
                    </Link>
                    <Link
                        to="/"
                        className="px-6 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition text-center"
                    >
                        Tiếp tục mua sắm
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSuccess;