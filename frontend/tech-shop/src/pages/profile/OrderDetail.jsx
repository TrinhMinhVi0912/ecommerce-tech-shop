// src/pages/profile/OrderDetail.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Calendar, CreditCard, MapPin, User, Phone, AlertCircle, XCircle, Truck, CheckCircle, Clock, Mail, Building } from 'lucide-react';
import useOrderDetail from '@/features/order/hooks/useOrderDetail';
import useCancelOrder from '@/features/order/hooks/useCancelOrder';
import { getImageUrl } from '@/utils/imageUtils';

export default function OrderDetail() {
    const { id } = useParams();
    const { data: order, loading, refetch } = useOrderDetail(id);
    const { cancelOrder, loading: cancelling } = useCancelOrder();
    const [isCancelling, setIsCancelling] = useState(false);

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

    const getOrderStatusIcon = (status) => {
        const icons = {
            'PENDING': <Clock size={16} />,
            'CONFIRMED': <CheckCircle size={16} />,
            'SHIPPING': <Truck size={16} />,
            'DELIVERED': <CheckCircle size={16} />,
            'CANCELLED': <XCircle size={16} />
        };
        return icons[status] || <Package size={16} />;
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

    const handleCancelOrder = async () => {
        if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;

        try {
            setIsCancelling(true);
            await cancelOrder(id);
            await refetch();
            alert('Đã hủy đơn hàng thành công!');
        } catch (error) {
            console.error('Cancel order error:', error);
            alert(error.response?.data?.message || 'Không thể hủy đơn hàng. Vui lòng thử lại.');
        } finally {
            setIsCancelling(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
                    <div className="space-y-4">
                        <div className="h-64 bg-slate-200 rounded-xl"></div>
                        <div className="h-48 bg-slate-200 rounded-xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">
                        Không tìm thấy đơn hàng
                    </h3>
                    <p className="text-sm text-slate-500">
                        Đơn hàng không tồn tại hoặc bạn không có quyền truy cập.
                    </p>
                    <Link
                        to="/orders"
                        className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Quay lại danh sách đơn hàng
                    </Link>
                </div>
            </div>
        );
    }

    const canCancel = order.orderStatus === 'PENDING';

    return (
        <div className="container mx-auto px-4 py-6 max-w-5xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Link
                        to="/orders"
                        className="p-2 hover:bg-slate-100 rounded-full transition"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Chi tiết đơn hàng
                    </h1>
                    <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        #{order.orderId?.substring(0, 8)}
                    </span>
                </div>
                <button
                    onClick={() => refetch()}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    Cập nhật
                </button>
            </div>

            {/* Order Status Bar */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getOrderStatusColor(order.orderStatus)}`}>
                            {getOrderStatusIcon(order.orderStatus)}
                            <span className="text-sm font-medium">{getOrderStatusLabel(order.orderStatus)}</span>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getPaymentStatusColor(order.paymentStatus)}`}>
                            <CreditCard size={16} />
                            <span className="text-sm font-medium">{getPaymentStatusLabel(order.paymentStatus)}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500">
                            <Calendar size={16} className="inline mr-1" />
                            {formatDate(order.createdAt)}
                        </span>
                        {canCancel ? (
                            <button
                                onClick={handleCancelOrder}
                                disabled={isCancelling || cancelling}
                                className="px-4 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm disabled:opacity-50"
                            >
                                {isCancelling || cancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
                            </button>
                        ) : order.orderStatus !== 'CANCELLED' && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <XCircle size={14} className="text-yellow-600" />
                                <span className="text-xs text-yellow-700">
                                    Không thể hủy
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Order Items */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Package size={18} className="text-blue-600" />
                            Sản phẩm ({order.items?.length || 0})
                        </h2>
                        <div className="space-y-3">
                            {order.items?.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex gap-3 py-2 border-b border-slate-100 last:border-0"
                                >
                                    <Link
                                        to={`/products/${item.productId}`}
                                        className="flex-shrink-0"
                                    >
                                        <img
                                            src={getImageUrl(item.thumbnail) || '/images/products/default.jpg'}
                                            alt={item.productName}
                                            className="w-16 h-16 object-cover rounded-lg bg-slate-50"
                                            onError={(e) => {
                                                e.target.src = '/images/products/default.jpg';
                                            }}
                                        />
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            to={`/products/${item.productId}`}
                                            className="font-medium text-slate-900 hover:text-blue-600 transition line-clamp-1 text-sm"
                                        >
                                            {item.productName}
                                        </Link>
                                        {item.attributes && item.attributes.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-0.5">
                                                {item.attributes.map((attr, i) => (
                                                    <span
                                                        key={i}
                                                        className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded"
                                                    >
                                                        {attr.attributeName}: {attr.value}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                            <span>SL: {item.quantity}</span>
                                            <span>SKU: {item.sku}</span>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <div className="text-sm font-medium text-slate-900">
                                            {formatPrice(item.price)}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {formatPrice(item.price * item.quantity)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ✅ Contact Support - Chuyển xuống dưới ô sản phẩm */}
                    {!canCancel && order.orderStatus !== 'CANCELLED' && (
                        <div className="bg-blue-50 rounded-xl border border-blue-200 p-5">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <AlertCircle size={20} className="text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-blue-800 mb-1">
                                        Không thể hủy đơn hàng
                                    </h4>
                                    <p className="text-sm text-blue-600/80 mb-3">
                                        Đơn hàng đã được xác nhận và đang được xử lý.
                                        Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi.
                                    </p>
                                    <div className="space-y-1.5 text-sm">
                                        <div className="flex items-center gap-2 text-blue-700">
                                            <Building size={16} className="flex-shrink-0" />
                                            <span>Trường Đại học Cần Thơ</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-blue-700">
                                            <Phone size={16} className="flex-shrink-0" />
                                            <span>0123456789</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-blue-700">
                                            <Mail size={16} className="flex-shrink-0" />
                                            <span>support@techshop.vn</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Order Info */}
                <div className="lg:col-span-1 space-y-4">
                    {/* Summary */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <h2 className="text-sm font-bold text-slate-900 mb-3">Tóm tắt</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Tạm tính</span>
                                <span className="font-medium">{formatPrice(order.totalPrice)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Giảm giá</span>
                                <span className="font-medium text-green-600">
                                    -{formatPrice(order.discountAmount || 0)}
                                </span>
                            </div>
                            <div className="border-t border-slate-200 pt-2">
                                <div className="flex justify-between text-base font-bold">
                                    <span>Tổng cộng</span>
                                    <span className="text-blue-600">{formatPrice(order.finalPrice)}</span>
                                </div>
                            </div>
                            {order.couponCode && (
                                <div className="text-xs text-slate-500">
                                    Mã: <span className="font-medium">{order.couponCode}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <MapPin size={16} className="text-blue-600" />
                            Giao hàng
                        </h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                                <User size={14} className="text-slate-400 mt-0.5" />
                                <span className="text-slate-700">{order.receiverName}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Phone size={14} className="text-slate-400 mt-0.5" />
                                <span className="text-slate-700">{order.receiverPhone}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin size={14} className="text-slate-400 mt-0.5" />
                                <span className="text-slate-700">
                                    {order.receiverAddress}, {order.receiverDistrict}, {order.receiverCity}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <CreditCard size={16} className="text-blue-600" />
                            Thanh toán
                        </h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Phương thức</span>
                                <span className="font-medium">
                                    {order.paymentMethod === 'COD' ? 'COD' : order.paymentMethod}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Trạng thái</span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                                    {getPaymentStatusLabel(order.paymentStatus)}
                                </span>
                            </div>
                            {order.paymentProvider && (
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Nhà cung cấp</span>
                                    <span className="font-medium">{order.paymentProvider}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Note */}
                    {order.note && (
                        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-3">
                            <p className="text-xs text-yellow-800">
                                <span className="font-medium">Ghi chú:</span> {order.note}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}