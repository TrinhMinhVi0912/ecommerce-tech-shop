// src/pages/admin/Coupons.jsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    Plus,
    Search,
    Edit,
    Eye,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Filter,
    X,
    Clock,
    CheckCircle,
    XCircle,
    Users,
    Calendar,
    DollarSign,
    Percent
} from 'lucide-react';
import useAdminCoupons from '@/features/admin/coupon/hooks/useAdminCoupons';
import useUpdateCouponStatus from '@/features/admin/coupon/hooks/useUpdateCouponStatus';
import { useToast } from '@/context/ToastContext';

export default function Coupons() {
    const toast = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDir, setSortDir] = useState('DESC');
    const [statusFilter, setStatusFilter] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [localCoupons, setLocalCoupons] = useState([]);

    const params = useMemo(() => ({
        pageNum,
        pageSize,
        sortBy,
        sortDir,
        search: searchTerm || undefined,
        isActive: statusFilter || undefined
    }), [pageNum, pageSize, sortBy, sortDir, searchTerm, statusFilter]);

    const { data, loading, refetch } = useAdminCoupons(params);
    const { updateCouponStatus } = useUpdateCouponStatus();

    useMemo(() => {
        if (data?.items) {
            setLocalCoupons(data.items);
        }
    }, [data]);

    const coupons = localCoupons;
    const totalElements = data?.totalElements || 0;
    const totalPages = data?.totalPages || 1;

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value || 0);
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

    const handleToggleStatus = async (couponId, currentStatus) => {
        try {
            setUpdatingId(couponId);

            setLocalCoupons(prev =>
                prev.map(coupon =>
                    coupon.couponId === couponId
                        ? { ...coupon, active: !currentStatus }
                        : coupon
                )
            );

            await updateCouponStatus(couponId, { active: !currentStatus });
            await refetch();

        } catch (error) {
            console.error('Update coupon status error:', error);
            toast.error('Không thể cập nhật trạng thái mã giảm giá. Vui lòng thử lại.');
            await refetch();
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusBadge = (isActive, quantity, expireDate) => {
        const now = new Date();
        const expire = new Date(expireDate);
        const isExpired = expire < now;

        if (!isActive) {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">Không hoạt động</span>;
        }
        if (isExpired) {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">Hết hạn</span>;
        }
        if (quantity <= 0) {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-600">Hết số lượng</span>;
        }
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Đang hoạt động</span>;
    };

    const statusOptions = [
        { value: '', label: 'Tất cả' },
        { value: 'true', label: 'Hoạt động' },
        { value: 'false', label: 'Không hoạt động' }
    ];

    if (loading) {
        return (
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="h-8 bg-slate-200 rounded w-48 animate-pulse"></div>
                        <div className="h-4 bg-slate-200 rounded w-64 mt-1 animate-pulse"></div>
                    </div>
                    <div className="h-10 bg-slate-200 rounded w-32 animate-pulse"></div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-10 bg-slate-200 rounded animate-pulse"></div>
                        <div className="w-20 h-10 bg-slate-200 rounded animate-pulse"></div>
                        <div className="w-10 h-10 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    {[...Array(7)].map((_, i) => (
                                        <th key={i} className="px-4 py-3">
                                            <div className="h-4 bg-slate-200 rounded w-16 animate-pulse"></div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(5)].map((_, i) => (
                                    <tr key={i} className="border-b border-slate-100">
                                        {[...Array(7)].map((_, j) => (
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
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý mã giảm giá</h1>
                    <p className="text-sm text-slate-500 mt-1">Quản lý danh sách mã giảm giá trong cửa hàng</p>
                </div>
                <Link
                    to="/admin/coupons/create"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus size={18} />
                    Thêm mã giảm giá
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
                <div className="flex flex-wrap items-center gap-3">
                    <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Tìm kiếm mã giảm giá (tên, mã code)..."
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

                    <button
                        onClick={() => refetch()}
                        className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
                    >
                        <RefreshCw size={18} />
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
                                    <option value="code">Mã code</option>
                                    <option value="discount">Giảm giá</option>
                                    <option value="quantity">Số lượng</option>
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

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Mã code</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Giảm giá</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Số lượng</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Đã dùng</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Thời gian</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-4 py-12 text-center text-slate-500">
                                        {searchTerm ? 'Không tìm thấy mã giảm giá nào' : 'Chưa có mã giảm giá nào'}
                                    </td>
                                </tr>
                            ) : (
                                coupons.map((coupon) => {
                                    const isUpdating = updatingId === coupon.couponId;
                                    const isExpired = new Date(coupon.expireDate) < new Date();

                                    return (
                                        <tr key={coupon.couponId} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="text-sm font-mono font-medium text-slate-800">{coupon.code}</p>
                                                    {coupon.name && (
                                                        <p className="text-xs text-slate-400">{coupon.name}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    {coupon.discountType === 'PERCENT' ? (
                                                        <Percent size={14} className="text-blue-500" />
                                                    ) : (
                                                        <DollarSign size={14} className="text-blue-500" />
                                                    )}
                                                    <span className="text-sm font-medium text-slate-800">
                                                        {coupon.discountType === 'PERCENT'
                                                            ? `${coupon.discount}%`
                                                            : formatCurrency(coupon.discount)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600">
                                                {coupon.quantity}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600">
                                                {coupon.totalUsage || 0}
                                            </td>
                                            <td className="px-4 py-3">
                                                {getStatusBadge(coupon.active, coupon.quantity, coupon.expireDate)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-xs text-slate-500">
                                                    <div>BĐ: {formatDate(coupon.startDate)}</div>
                                                    <div>KT: {formatDate(coupon.expireDate)}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        to={`/admin/coupons/${coupon.couponId}`}
                                                        className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye size={18} />
                                                    </Link>
                                                    <Link
                                                        to={`/admin/coupons/edit/${coupon.couponId}`}
                                                        className="p-2 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleToggleStatus(coupon.couponId, coupon.active)}
                                                        disabled={isUpdating}
                                                        className={`p-2 rounded-lg transition ${coupon.active && !isExpired
                                                                ? 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                                                                : 'text-slate-400 hover:text-green-600 hover:bg-green-50'
                                                            } disabled:opacity-50`}
                                                        title={coupon.active && !isExpired ? 'Vô hiệu hóa' : 'Kích hoạt'}
                                                    >
                                                        {coupon.active && !isExpired ? (
                                                            <XCircle size={18} />
                                                        ) : (
                                                            <CheckCircle size={18} />
                                                        )}
                                                    </button>
                                                    <Link
                                                        to={`/admin/coupons/${coupon.couponId}/usages`}
                                                        className="p-2 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition"
                                                        title="Xem lịch sử sử dụng"
                                                    >
                                                        <Users size={18} />
                                                    </Link>
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
                            Hiển thị {(pageNum - 1) * pageSize + 1} - {Math.min(pageNum * pageSize, totalElements)} trong {totalElements} mã giảm giá
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