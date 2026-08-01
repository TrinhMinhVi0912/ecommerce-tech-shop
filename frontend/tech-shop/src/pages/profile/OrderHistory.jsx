// src/pages/profile/OrderHistory.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowLeft, Eye, Calendar } from 'lucide-react';
import useOrders from '@/features/order/hooks/useOrders';
import { getImageUrl } from '@/utils/imageUtils';
import { useAuth } from '@/context/AuthContext';
import LoginRequired from '@/components/cart/LoginRequired';

export default function OrderHistory() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [statusFilter, setStatusFilter] = useState('');
    const [pageNum, setPageNum] = useState(1);
    const pageSize = 10;

    const params = useMemo(() => ({
        pageNum,
        pageSize,
        status: statusFilter || undefined
    }), [pageNum, pageSize, statusFilter]);

    const { data, loading, error, refetch } = useOrders(params);

    // Debug log
    console.log('🔍 OrderHistory - loading:', loading);
    console.log('🔍 OrderHistory - data:', data);
    console.log('🔍 OrderHistory - error:', error);

    const orders = data?.items || [];
    const totalElements = data?.totalElements || 0;
    const totalPages = data?.totalPages || 1;

    console.log('🔍 OrderHistory - orders count:', orders.length);

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

    const getOrderStatusColor = (status) => {
        const colors = {
            'PENDING': 'bg-yellow-100 text-yellow-800',
            'CONFIRMED': 'bg-blue-100 text-blue-800',
            'SHIPPING': 'bg-purple-100 text-purple-800',
            'DELIVERED': 'bg-green-100 text-green-800',
            'CANCELLED': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-slate-100 text-slate-800';
    };

    const getPaymentStatusLabel = (status) => {
        const statuses = {
            'PENDING': 'Chờ thanh toán',
            'SUCCESS': 'Đã thanh toán',
            'FAILED': 'Thất bại'
        };
        return statuses[status] || status;
    };

    const getPaymentStatusColor = (status) => {
        const colors = {
            'PENDING': 'bg-yellow-100 text-yellow-800',
            'SUCCESS': 'bg-green-100 text-green-800',
            'FAILED': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-slate-100 text-slate-800';
    };

    // ✅ Kiểm tra nếu đang loading auth
    if (authLoading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <LoginRequired />;
    }

    // ✅ Nếu đang loading dữ liệu orders
    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // ✅ Nếu có lỗi
    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <p className="text-red-500">Có lỗi xảy ra khi tải đơn hàng</p>
                    <button
                        onClick={() => refetch()}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    const statusOptions = [
        { value: '', label: 'Tất cả' },
        { value: 'PENDING', label: 'Chờ xác nhận' },
        { value: 'CONFIRMED', label: 'Đã xác nhận' },
        { value: 'SHIPPING', label: 'Đang giao' },
        { value: 'DELIVERED', label: 'Đã giao' },
        { value: 'CANCELLED', label: 'Đã hủy' }
    ];

    return (
        <div className="container mx-auto px-4 py-6 max-w-5xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Link
                        to="/profile"
                        className="p-2 hover:bg-slate-100 rounded-full transition"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Đơn hàng của tôi
                    </h1>
                    <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        {totalElements} đơn hàng
                    </span>
                </div>
                <button
                    onClick={() => refetch()}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    Cập nhật
                </button>
            </div>

            {/* Filter by status */}
            <div className="flex flex-wrap gap-2 mb-6">
                {statusOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => {
                            setStatusFilter(option.value);
                            setPageNum(1);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${statusFilter === option.value
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Orders list */}
            {orders.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <Package size={48} className="text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">
                        Chưa có đơn hàng nào
                    </h3>
                    <p className="text-sm text-slate-500">
                        Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!
                    </p>
                    <Link
                        to="/products"
                        className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Mua sắm ngay
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.orderId}
                            className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition"
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                {/* Thumbnail */}
                                <Link
                                    to={`/orders/${order.orderId}`}
                                    className="flex-shrink-0"
                                >
                                    <img
                                        src={getImageUrl(order.thumbnail) || '/images/products/default.jpg'}
                                        alt={order.productName}
                                        className="w-20 h-20 object-cover rounded-lg bg-slate-50"
                                        onError={(e) => {
                                            e.target.src = '/images/products/default.jpg';
                                        }}
                                    />
                                </Link>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <Link
                                        to={`/orders/${order.orderId}`}
                                        className="font-medium text-slate-900 hover:text-blue-600 transition line-clamp-1"
                                    >
                                        {order.productName}
                                    </Link>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Package size={14} />
                                            {order.totalProduct} sản phẩm
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {formatDate(order.createdAt)}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getOrderStatusColor(order.orderStatus)}`}>
                                            {getOrderStatusLabel(order.orderStatus)}
                                        </span>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                                            {getPaymentStatusLabel(order.paymentStatus)}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            {order.paymentMethod === 'COD' ? 'COD' : order.paymentMethod}
                                        </span>
                                    </div>
                                </div>

                                {/* Price & Actions */}
                                <div className="flex flex-col items-end gap-2">
                                    <div className="text-lg font-bold text-blue-600">
                                        {formatPrice(order.finalPrice)}
                                    </div>
                                    <Link
                                        to={`/orders/${order.orderId}`}
                                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                    >
                                        <Eye size={16} />
                                        Xem chi tiết
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPageNum(prev => Math.max(1, prev - 1))}
                            disabled={pageNum === 1}
                            className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Trước
                        </button>
                        <span className="px-4 py-2 text-sm text-slate-600">
                            Trang {pageNum} / {totalPages}
                        </span>
                        <button
                            onClick={() => setPageNum(prev => Math.min(totalPages, prev + 1))}
                            disabled={pageNum === totalPages}
                            className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}