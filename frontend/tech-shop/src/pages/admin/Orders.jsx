// src/pages/admin/Orders.jsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    Eye,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Filter,
    X,
    Search,
    Clock,
    CheckCircle,
    Truck,
    Package,
    XCircle,
    AlertCircle,
    User,
    Phone,
    Calendar,
    DollarSign,
    ChevronDown,
    ChevronUp,
    Edit,
    Save,
    X as XIcon
} from 'lucide-react';
import useAdminOrders from '@/features/admin/order/hooks/useAdminOrders';
import useAdminPendingOrders from '@/features/admin/order/hooks/useAdminPendingOrders';
import useUpdateOrderStatus from '@/features/admin/order/hooks/useUpdateOrderStatus';

export default function Orders() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDir, setSortDir] = useState('DESC');
    const [statusFilter, setStatusFilter] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [editingStatusId, setEditingStatusId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [localOrders, setLocalOrders] = useState([]);
    const [localPendingOrders, setLocalPendingOrders] = useState([]);
    const [carouselIndex, setCarouselIndex] = useState(0);

    // ✅ Hook cho bảng (tất cả đơn hàng) - Thêm search vào params
    const params = useMemo(() => ({
        pageNum,
        pageSize,
        sortBy,
        sortDir,
        status: statusFilter || undefined,
        search: searchTerm || undefined  // ✅ Thêm search vào params
    }), [pageNum, pageSize, sortBy, sortDir, statusFilter, searchTerm]);

    const { data, loading, refetch } = useAdminOrders(params);

    // ✅ Hook riêng cho carousel (chỉ lấy đơn hàng PENDING) - Không cần search
    const {
        data: pendingData,
        loading: pendingLoading,
        refetch: refetchPending
    } = useAdminPendingOrders();

    const { updateOrderStatus, loading: updating } = useUpdateOrderStatus();

    // Cập nhật local orders khi data thay đổi
    useMemo(() => {
        if (data?.items) {
            setLocalOrders(data.items);
        }
    }, [data]);

    // Cập nhật local pending orders khi pendingData thay đổi
    useMemo(() => {
        if (pendingData?.items) {
            setLocalPendingOrders(pendingData.items);
        }
    }, [pendingData]);

    const orders = localOrders;
    const pendingOrders = localPendingOrders;
    const totalElements = data?.totalElements || 0;
    const totalPages = data?.totalPages || 1;

    // Lọc đơn hàng không phải PENDING cho bảng
    const otherOrders = orders.filter(order => order.status !== 'PENDING' && order.status !== 'pending');

    // Carousel settings - 4 items per page
    const ITEMS_PER_PAGE = 4;
    const totalPending = pendingOrders.length;
    const totalCarouselPages = Math.ceil(totalPending / ITEMS_PER_PAGE);

    const getCurrentPageOrders = () => {
        const start = carouselIndex * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return pendingOrders.slice(start, end);
    };

    const currentPageOrders = getCurrentPageOrders();

    const nextSlide = () => {
        setCarouselIndex((prev) => (prev + 1) % totalCarouselPages);
    };

    const prevSlide = () => {
        setCarouselIndex((prev) => (prev - 1 + totalCarouselPages) % totalCarouselPages);
    };

    const goToSlide = (index) => {
        setCarouselIndex(index);
    };

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

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchTerm(searchInput);
        setPageNum(1);
    };

    const handleClearSearch = () => {
        setSearchInput('');
        setSearchTerm('');
        setPageNum(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPageNum(newPage);
        }
    };

    // Cập nhật trạng thái đơn hàng
    const handleUpdateStatus = async (orderId, newStatus) => {
        if (!newStatus) return;

        try {
            setUpdatingId(orderId);

            // Cập nhật local state ngay lập tức cho cả 2 danh sách
            setLocalOrders(prev =>
                prev.map(order =>
                    order.orderId === orderId
                        ? { ...order, status: newStatus }
                        : order
                )
            );

            setLocalPendingOrders(prev =>
                prev.filter(order => order.orderId !== orderId)
            );

            // Gọi API cập nhật
            await updateOrderStatus(orderId, { status: newStatus });

            // Refetch cả 2 danh sách để đồng bộ
            await Promise.all([refetch(), refetchPending()]);

            // Đóng dropdown
            setEditingStatusId(null);
            setSelectedStatus('');

        } catch (error) {
            console.error('Update status error:', error);
            alert('Không thể cập nhật trạng thái. Vui lòng thử lại.');

            // Rollback nếu lỗi
            await Promise.all([refetch(), refetchPending()]);
        } finally {
            setUpdatingId(null);
        }
    };

    // Mở dropdown chọn trạng thái
    const handleEditStatus = (orderId, currentStatus) => {
        setEditingStatusId(orderId);
        setSelectedStatus(currentStatus);
    };

    // Hủy chỉnh sửa trạng thái
    const handleCancelEdit = () => {
        setEditingStatusId(null);
        setSelectedStatus('');
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
            'PENDING': 'bg-yellow-100 text-yellow-800',
            'CONFIRMED': 'bg-blue-100 text-blue-800',
            'PROCESSING': 'bg-purple-100 text-purple-800',
            'SHIPPING': 'bg-indigo-100 text-indigo-800',
            'DELIVERED': 'bg-green-100 text-green-800',
            'COMPLETED': 'bg-emerald-100 text-emerald-800',
            'CANCELLED': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-slate-100 text-slate-800';
    };

    const getOrderStatusIcon = (status) => {
        const icons = {
            'PENDING': <Clock size={14} />,
            'CONFIRMED': <CheckCircle size={14} />,
            'PROCESSING': <Package size={14} />,
            'SHIPPING': <Truck size={14} />,
            'DELIVERED': <CheckCircle size={14} />,
            'COMPLETED': <CheckCircle size={14} />,
            'CANCELLED': <XCircle size={14} />
        };
        return icons[status] || <AlertCircle size={14} />;
    };

    const statusOptions = [
        { value: '', label: 'Tất cả' },
        { value: 'PENDING', label: 'Chờ xác nhận' },
        { value: 'CONFIRMED', label: 'Đã xác nhận' },
        { value: 'PROCESSING', label: 'Đang xử lý' },
        { value: 'SHIPPING', label: 'Đang giao' },
        { value: 'DELIVERED', label: 'Đã giao' },
        { value: 'COMPLETED', label: 'Hoàn thành' },
        { value: 'CANCELLED', label: 'Đã hủy' }
    ];

    // Render status dropdown cho carousel
    const renderCarouselStatusDropdown = (order) => {
        const isEditing = editingStatusId === order.orderId;
        const isUpdating = updatingId === order.orderId;

        if (isEditing) {
            return (
                <div className="flex items-center gap-1 mt-2">
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="flex-1 border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isUpdating}
                    >
                        {statusOptions.filter(s => s.value).map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={() => handleUpdateStatus(order.orderId, selectedStatus)}
                        disabled={isUpdating}
                        className="p-1 text-green-600 hover:bg-green-50 rounded-lg transition disabled:opacity-50"
                    >
                        <Save size={14} />
                    </button>
                    <button
                        onClick={handleCancelEdit}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                        <XIcon size={14} />
                    </button>
                </div>
            );
        }

        return (
            <button
                onClick={() => handleEditStatus(order.orderId, order.status)}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition w-full justify-center"
                disabled={isUpdating}
            >
                <Edit size={12} />
                Thay đổi
            </button>
        );
    };

    // Render status dropdown cho bảng
    const renderTableStatusDropdown = (order) => {
        const isEditing = editingStatusId === order.orderId;
        const isUpdating = updatingId === order.orderId;

        if (isEditing) {
            return (
                <div className="flex items-center gap-1">
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="border border-slate-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isUpdating}
                    >
                        {statusOptions.filter(s => s.value).map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={() => handleUpdateStatus(order.orderId, selectedStatus)}
                        disabled={isUpdating}
                        className="p-1 text-green-600 hover:bg-green-50 rounded-lg transition disabled:opacity-50"
                    >
                        <Save size={16} />
                    </button>
                    <button
                        onClick={handleCancelEdit}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                        <XIcon size={16} />
                    </button>
                </div>
            );
        }

        return (
            <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                    {getOrderStatusIcon(order.status)}
                    {getOrderStatusLabel(order.status)}
                </span>
                <button
                    onClick={() => handleEditStatus(order.orderId, order.status)}
                    className="p-1 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition"
                    title="Thay đổi trạng thái"
                    disabled={isUpdating}
                >
                    <Edit size={14} />
                </button>
            </div>
        );
    };

    // ✅ Sửa điều kiện loading
    const isLoading = loading || pendingLoading;

    if (isLoading) {
        return (
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="h-8 bg-slate-200 rounded w-48 animate-pulse"></div>
                        <div className="h-4 bg-slate-200 rounded w-64 mt-1 animate-pulse"></div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-10 bg-slate-200 rounded animate-pulse"></div>
                        <div className="w-20 h-10 bg-slate-200 rounded animate-pulse"></div>
                        <div className="w-10 h-10 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
                            <div className="h-40 bg-slate-200 rounded"></div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    {[...Array(6)].map((_, i) => (
                                        <th key={i} className="px-4 py-3">
                                            <div className="h-4 bg-slate-200 rounded w-16 animate-pulse"></div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(5)].map((_, i) => (
                                    <tr key={i} className="border-b border-slate-100">
                                        {[...Array(6)].map((_, j) => (
                                            <td key={j} className="px-4 py-3">
                                                <div className="h-4 bg-slate-200 rounded w-20 animate-pulse"></div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý đơn hàng</h1>
                    <p className="text-sm text-slate-500 mt-1">Quản lý danh sách đơn hàng trong cửa hàng</p>
                </div>
                <button
                    onClick={() => {
                        refetch();
                        refetchPending();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <RefreshCw size={18} />
                    Cập nhật
                </button>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
                <div className="flex flex-wrap items-center gap-3">
                    <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Tìm kiếm đơn hàng (mã, tên khách hàng, số điện thoại)..."
                                className="w-full pl-10 pr-10 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            {searchInput && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </form>

                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${showFilter || statusFilter
                            ? 'bg-blue-50 border-blue-300 text-blue-600'
                            : 'border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        <Filter size={18} />
                        Lọc
                        {statusFilter && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                    </button>
                </div>

                {showFilter && (
                    <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-200">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Trạng thái</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setPageNum(1);
                                }}
                                className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Sắp xếp</label>
                            <div className="flex gap-2">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="createdAt">Ngày tạo</option>
                                    <option value="finalPrice">Tổng tiền</option>
                                    <option value="receiverName">Tên khách hàng</option>
                                </select>
                                <select
                                    value={sortDir}
                                    onChange={(e) => setSortDir(e.target.value)}
                                    className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="ASC">Tăng dần</option>
                                    <option value="DESC">Giảm dần</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Hiển thị</label>
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setPageNum(1);
                                }}
                                className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                        {statusFilter && (
                            <button
                                onClick={() => {
                                    setStatusFilter('');
                                    setPageNum(1);
                                }}
                                className="text-sm text-red-500 hover:text-red-600 font-medium"
                            >
                                Xóa bộ lọc
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Pending Orders Carousel */}
            {pendingOrders.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Clock size={20} className="text-yellow-500" />
                                Đơn hàng chờ xác nhận
                            </h2>
                            <span className="text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                {totalPending} đơn
                            </span>
                        </div>
                        {totalPending > ITEMS_PER_PAGE && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-500">
                                    {carouselIndex + 1}/{totalCarouselPages}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <div className="overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {currentPageOrders.map((order) => (
                                    <div
                                        key={order.orderId}
                                        className="bg-white rounded-xl border-2 border-yellow-200 hover:border-yellow-400 shadow-sm hover:shadow-md transition-all p-4 flex flex-col"
                                    >
                                        {/* Header */}
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                                    #{order.orderId?.substring(0, 8)}
                                                </span>
                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-yellow-100 text-yellow-800">
                                                    <Clock size={10} />
                                                    Chờ
                                                </span>
                                            </div>
                                            <Link
                                                to={`/admin/orders/${order.orderId}`}
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Xem chi tiết"
                                            >
                                                <Eye size={14} />
                                            </Link>
                                        </div>

                                        {/* Customer Info */}
                                        <div className="mt-3 flex-1">
                                            <p className="font-medium text-sm text-slate-800 truncate flex items-center gap-1">
                                                <User size={12} className="text-slate-400 flex-shrink-0" />
                                                {order.receiverName}
                                            </p>
                                            <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                                                <Phone size={12} className="text-slate-400 flex-shrink-0" />
                                                {order.receiverPhone}
                                            </p>
                                        </div>

                                        {/* Price & Date */}
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <Calendar size={12} className="text-slate-400" />
                                                {formatDate(order.createdAt).split(',')[0]}
                                            </span>
                                            <span className="text-sm font-bold text-blue-600">
                                                {formatCurrency(order.finalPrice)}
                                            </span>
                                        </div>

                                        {/* Status Update */}
                                        <div className="mt-3 pt-3 border-t border-slate-100">
                                            {renderCarouselStatusDropdown(order)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {totalPending > ITEMS_PER_PAGE && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    className="absolute -left-3 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md border border-slate-200 hover:bg-slate-50 transition z-10"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute -right-3 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md border border-slate-200 hover:bg-slate-50 transition z-10"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </>
                        )}
                    </div>

                    {totalPending > ITEMS_PER_PAGE && (
                        <div className="flex justify-center mt-3 gap-1.5">
                            {[...Array(totalCarouselPages)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-2 h-2 rounded-full transition ${carouselIndex === index
                                        ? 'bg-blue-600 w-4'
                                        : 'bg-slate-300 hover:bg-slate-400'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Orders Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Mã đơn hàng</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Khách hàng</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Tổng tiền</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Ngày tạo</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {otherOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-4 py-12 text-center text-slate-500">
                                        {searchTerm ? 'Không tìm thấy đơn hàng nào' : 'Chưa có đơn hàng nào'}
                                    </td>
                                </tr>
                            ) : (
                                otherOrders.map((order) => {
                                    const isUpdating = updatingId === order.orderId;
                                    const isEditing = editingStatusId === order.orderId;

                                    return (
                                        <tr key={order.orderId} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-mono text-slate-600">
                                                    #{order.orderId?.substring(0, 8)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800">{order.receiverName}</p>
                                                    <p className="text-xs text-slate-400">{order.receiverPhone}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-bold text-blue-600">
                                                    {formatCurrency(order.finalPrice)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {renderTableStatusDropdown(order)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-500">
                                                {formatDate(order.createdAt)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        to={`/admin/orders/${order.orderId}`}
                                                        className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye size={18} />
                                                    </Link>
                                                    {isUpdating && (
                                                        <RefreshCw size={18} className="animate-spin text-blue-600" />
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
                        <div className="text-sm text-slate-500">
                            Hiển thị {(pageNum - 1) * pageSize + 1} - {Math.min(pageNum * pageSize, totalElements)} trong {totalElements} đơn hàng
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => handlePageChange(pageNum - 1)}
                                disabled={pageNum === 1}
                                className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <span className="px-4 py-2 text-sm font-medium text-slate-600">
                                {pageNum} / {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(pageNum + 1)}
                                disabled={pageNum === totalPages}
                                className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}