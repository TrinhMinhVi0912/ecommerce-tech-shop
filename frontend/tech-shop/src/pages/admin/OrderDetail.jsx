// src/pages/admin/OrderDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    RefreshCw,
    User,
    Phone,
    MapPin,
    Calendar,
    CreditCard,
    Package,
    Clock,
    CheckCircle,
    Truck,
    XCircle,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Edit,
    Save,
    X
} from 'lucide-react';
import useAdminOrderDetail from '@/features/admin/order/hooks/useAdminOrderDetail';
import useUpdateOrderStatus from '@/features/admin/order/hooks/useUpdateOrderStatus';
import { getImageUrl } from '@/utils/imageUtils';
import { useToast } from '@/context/ToastContext';

export default function OrderDetail() {
    const toast = useToast();
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [isEditingStatus, setIsEditingStatus] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [localOrder, setLocalOrder] = useState(null);

    const { data: order, loading, refetch } = useAdminOrderDetail(orderId);
    const { updateOrderStatus } = useUpdateOrderStatus();

    // ✅ Cập nhật local state khi order thay đổi
    useEffect(() => {
        if (order) {
            setLocalOrder(order);
            setSelectedStatus(order.orderStatus || '');
        }
    }, [order]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value || 0);
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
            'PROCESSING': 'Đang xử lý',
            'SHIPPING': 'Đang giao hàng',
            'DELIVERED': 'Đã giao',
            'COMPLETED': 'Hoàn thành',
            'CANCELLED': 'Đã hủy'
        };
        return statuses[status] || status;
    };

    const getOrderStatusColor = (status) => {
        const colors = {
            'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'CONFIRMED': 'bg-blue-100 text-blue-800 border-blue-200',
            'PROCESSING': 'bg-purple-100 text-purple-800 border-purple-200',
            'SHIPPING': 'bg-indigo-100 text-indigo-800 border-indigo-200',
            'DELIVERED': 'bg-green-100 text-green-800 border-green-200',
            'COMPLETED': 'bg-emerald-100 text-emerald-800 border-emerald-200',
            'CANCELLED': 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[status] || 'bg-slate-100 text-slate-800 border-slate-200';
    };

    const getOrderStatusIcon = (status) => {
        const icons = {
            'PENDING': <Clock size={18} />,
            'CONFIRMED': <CheckCircle size={18} />,
            'PROCESSING': <Package size={18} />,
            'SHIPPING': <Truck size={18} />,
            'DELIVERED': <CheckCircle size={18} />,
            'COMPLETED': <CheckCircle size={18} />,
            'CANCELLED': <XCircle size={18} />
        };
        return icons[status] || <AlertCircle size={18} />;
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

    const statusOptions = [
        { value: 'PENDING', label: 'Chờ xác nhận' },
        { value: 'CONFIRMED', label: 'Đã xác nhận' },
        { value: 'PROCESSING', label: 'Đang xử lý' },
        { value: 'SHIPPING', label: 'Đang giao hàng' },
        { value: 'DELIVERED', label: 'Đã giao' },
        { value: 'COMPLETED', label: 'Hoàn thành' },
        { value: 'CANCELLED', label: 'Đã hủy' }
    ];

    const handleUpdateStatus = async () => {
        if (!selectedStatus || selectedStatus === localOrder?.orderStatus) {
            setIsEditingStatus(false);
            return;
        }

        try {
            setIsUpdating(true);

            // ✅ Gọi API cập nhật trạng thái
            await updateOrderStatus(orderId, { status: selectedStatus });

            // ✅ Cập nhật local state ngay lập tức
            setLocalOrder(prev => ({
                ...prev,
                orderStatus: selectedStatus
            }));

            // ✅ Refetch để lấy dữ liệu mới nhất từ server
            await refetch();

            setIsEditingStatus(false);
            toast.success('Cập nhật trạng thái đơn hàng thành công!');
        } catch (error) {
            console.error('Update status error:', error);
            toast.error('Không thể cập nhật trạng thái. Vui lòng thử lại.');

            // ✅ Rollback nếu có lỗi
            if (order) {
                setLocalOrder(order);
                setSelectedStatus(order.orderStatus || '');
            }
        } finally {
            setIsUpdating(false);
        }
    };

    // ✅ Xử lý khi refetch hoàn tất
    useEffect(() => {
        if (!loading && order) {
            setLocalOrder(order);
            setSelectedStatus(order.orderStatus || '');
        }
    }, [loading, order]);

    // ✅ Dùng localOrder để hiển thị thay vì order
    const displayOrder = localOrder || order;

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-6 max-w-6xl">
                <div className="animate-pulse">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-10 w-10 bg-slate-200 rounded-lg"></div>
                        <div className="h-8 bg-slate-200 rounded w-64"></div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                            <div className="h-64 bg-slate-200 rounded-xl"></div>
                            <div className="h-48 bg-slate-200 rounded-xl"></div>
                        </div>
                        <div className="space-y-4">
                            <div className="h-48 bg-slate-200 rounded-xl"></div>
                            <div className="h-32 bg-slate-200 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!displayOrder) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-6xl text-center">
                <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800">Không tìm thấy đơn hàng</h2>
                <p className="text-slate-500 mt-2">Đơn hàng không tồn tại hoặc đã bị xóa.</p>
                <Link
                    to="/admin/orders"
                    className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Quay lại danh sách
                </Link>
            </div>
        );
    }

    const items = displayOrder.items || [];
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="container mx-auto px-4 py-6 max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link
                        to="/admin/orders"
                        className="p-2 hover:bg-slate-100 rounded-lg transition"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Chi tiết đơn hàng</h1>
                        <p className="text-sm text-slate-500 mt-1">Mã đơn: #{displayOrder.orderId}</p>
                    </div>
                </div>
                <button
                    onClick={() => refetch()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <RefreshCw size={18} />
                    Cập nhật
                </button>
            </div>

            {/* Status Bar */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {/* ✅ Sử dụng displayOrder để hiển thị trạng thái mới nhất */}
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getOrderStatusColor(displayOrder.orderStatus)}`}>
                            {getOrderStatusIcon(displayOrder.orderStatus)}
                            <span className="font-medium">{getOrderStatusLabel(displayOrder.orderStatus)}</span>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${getPaymentStatusColor(displayOrder.paymentStatus)}`}>
                            <CreditCard size={18} />
                            <span className="font-medium">{getPaymentStatusLabel(displayOrder.paymentStatus)}</span>
                        </div>
                        <span className="text-sm text-slate-500">
                            {displayOrder.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : displayOrder.paymentMethod}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500">
                            <Calendar size={16} className="inline mr-1" />
                            {formatDate(displayOrder.createdAt)}
                        </span>
                        {!isEditingStatus ? (
                            <button
                                onClick={() => {
                                    setSelectedStatus(displayOrder.orderStatus);
                                    setIsEditingStatus(true);
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition text-sm"
                            >
                                <Edit size={16} />
                                Cập nhật trạng thái
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={isUpdating}
                                >
                                    {statusOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleUpdateStatus}
                                    disabled={isUpdating}
                                    className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                                >
                                    <Save size={16} />
                                </button>
                                <button
                                    onClick={() => setIsEditingStatus(false)}
                                    className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Package size={20} className="text-blue-600" />
                            Sản phẩm ({totalItems})
                        </h2>
                        <div className="space-y-4">
                            {items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex gap-4 py-3 border-b border-slate-100 last:border-0"
                                >
                                    <img
                                        src={getImageUrl(item.thumbnail) || '/images/products/default.jpg'}
                                        alt={item.productName}
                                        className="w-20 h-20 object-cover rounded-lg bg-slate-50 border border-slate-200 flex-shrink-0"
                                        onError={(e) => {
                                            e.target.src = '/images/products/default.jpg';
                                        }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            to={`/admin/products/${item.productId}`}
                                            className="font-medium text-slate-900 hover:text-blue-600 transition line-clamp-1"
                                        >
                                            {item.productName}
                                        </Link>
                                        {item.attributes && item.attributes.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-1">
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
                                        <div className="flex items-center gap-4 mt-2 text-sm">
                                            <span className="text-slate-500">SL: {item.quantity}</span>
                                            <span className="text-slate-500">SKU: {item.sku}</span>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <div className="font-medium text-slate-900">
                                            {formatCurrency(item.price)}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {formatCurrency(item.price * item.quantity)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Order Info */}
                <div className="space-y-4">
                    {/* Summary */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Tóm tắt</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Tạm tính</span>
                                <span className="font-medium">{formatCurrency(displayOrder.totalPrice)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Giảm giá</span>
                                <span className="font-medium text-green-600">
                                    -{formatCurrency(displayOrder.discountAmount || 0)}
                                </span>
                            </div>
                            <div className="border-t border-slate-200 pt-3">
                                <div className="flex justify-between text-base font-bold">
                                    <span>Tổng cộng</span>
                                    <span className="text-blue-600">{formatCurrency(displayOrder.finalPrice)}</span>
                                </div>
                            </div>
                            {displayOrder.couponCode && (
                                <div className="text-xs text-slate-500">
                                    Mã: <span className="font-medium">{displayOrder.couponCode}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <MapPin size={18} className="text-blue-600" />
                            Thông tin giao hàng
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-start gap-2 text-sm">
                                <User size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <div className="font-medium text-slate-900">{displayOrder.receiverName}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                                <Phone size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                                <div className="text-slate-600">{displayOrder.receiverPhone}</div>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                                <MapPin size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                                <div className="text-slate-600">
                                    {displayOrder.receiverAddress}
                                    <br />
                                    {displayOrder.receiverDistrict}, {displayOrder.receiverCity}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <CreditCard size={18} className="text-blue-600" />
                            Thanh toán
                        </h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Phương thức</span>
                                <span className="font-medium">
                                    {displayOrder.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : displayOrder.paymentMethod}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Trạng thái</span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(displayOrder.paymentStatus)}`}>
                                    {getPaymentStatusLabel(displayOrder.paymentStatus)}
                                </span>
                            </div>
                            {displayOrder.paymentProvider && (
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Nhà cung cấp</span>
                                    <span className="font-medium">{displayOrder.paymentProvider}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {displayOrder.note && (
                        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
                            <p className="text-sm text-yellow-800">
                                <span className="font-medium">Ghi chú:</span> {displayOrder.note}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}