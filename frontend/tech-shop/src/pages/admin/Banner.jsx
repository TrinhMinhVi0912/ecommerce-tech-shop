// src/pages/admin/Banners.jsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    Plus,
    Search,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Filter,
    X,
    Trash2,
    Image as ImageIcon,
    CheckCircle,
    XCircle,
    Calendar
} from 'lucide-react';
import useAdminBanners from '@/features/admin/banner/hooks/useAdminBanners';
import useUpdateBannerStatus from '@/features/admin/banner/hooks/useUpdateBannerStatus';
import useDeleteBanner from '@/features/admin/banner/hooks/useDeleteBanner';
import { getImageUrl } from '@/utils/imageUtils';

export default function Banners() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDir, setSortDir] = useState('desc');
    const [statusFilter, setStatusFilter] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [localBanners, setLocalBanners] = useState([]);

    const params = useMemo(() => ({
        pageNum,
        pageSize,
        sortBy,
        sortDir,
        search: searchTerm || undefined,
        isActive: statusFilter || undefined
    }), [pageNum, pageSize, sortBy, sortDir, searchTerm, statusFilter]);

    const { data, loading, refetch } = useAdminBanners(params);
    const { updateBannerStatus } = useUpdateBannerStatus();
    const { deleteBanner } = useDeleteBanner();

    useMemo(() => {
        if (data?.items) {
            setLocalBanners(data.items);
        }
    }, [data]);

    const banners = localBanners;
    const totalElements = data?.totalElements || 0;
    const totalPages = data?.totalPages || 1;

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
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

    const handleToggleStatus = async (bannerId, currentStatus) => {
        try {
            setUpdatingId(bannerId);

            setLocalBanners(prev =>
                prev.map(banner =>
                    banner.bannerId === bannerId
                        ? { ...banner, isActive: !currentStatus }
                        : banner
                )
            );

            await updateBannerStatus(bannerId, { active: !currentStatus });
            await refetch();

        } catch (error) {
            console.error('Update banner status error:', error);
            alert('Không thể cập nhật trạng thái banner. Vui lòng thử lại.');
            await refetch();
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (bannerId, title) => {
        if (!window.confirm(`Bạn có chắc muốn xóa banner "${title}"?`)) {
            return;
        }

        try {
            setDeletingId(bannerId);
            await deleteBanner(bannerId);
            alert('Xóa banner thành công!');
            await refetch();
        } catch (error) {
            console.error('Delete banner error:', error);
            alert(error.response?.data?.message || 'Không thể xóa banner. Vui lòng thử lại.');
        } finally {
            setDeletingId(null);
        }
    };

    const statusOptions = [
        { value: '', label: 'Tất cả' },
        { value: 'true', label: 'Đang hiển thị' },
        { value: 'false', label: 'Ẩn' }
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
                                    {[...Array(5)].map((_, i) => (
                                        <th key={i} className="px-4 py-3">
                                            <div className="h-4 bg-slate-200 rounded w-16 animate-pulse"></div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(5)].map((_, i) => (
                                    <tr key={i} className="border-b border-slate-100">
                                        {[...Array(5)].map((_, j) => (
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
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý Banner</h1>
                    <p className="text-sm text-slate-500 mt-1">Quản lý banner quảng cáo trên trang chủ</p>
                </div>
                <Link
                    to="/admin/banners/create"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus size={18} />
                    Thêm banner
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
                                placeholder="Tìm kiếm banner theo tiêu đề..."
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
                                    <option value="title">Tiêu đề</option>
                                </select>
                                <select
                                    value={sortDir}
                                    onChange={(e) => setSortDir(e.target.value)}
                                    className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="asc">Tăng dần</option>
                                    <option value="desc">Giảm dần</option>
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
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Banner</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Tiêu đề</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Ngày tạo</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banners.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-4 py-12 text-center text-slate-500">
                                        {searchTerm ? 'Không tìm thấy banner nào' : 'Chưa có banner nào'}
                                    </td>
                                </tr>
                            ) : (
                                banners.map((banner) => {
                                    const isUpdating = updatingId === banner.bannerId;
                                    const isDeleting = deletingId === banner.bannerId;
                                    const imageUrl = getImageUrl(banner.imageUrl) || '/images/banners/default.jpg';

                                    return (
                                        <tr key={banner.bannerId} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                            <td className="px-4 py-3">
                                                <div className="w-20 h-12 rounded-lg overflow-hidden bg-slate-50 border border-slate-200 flex-shrink-0">
                                                    <img
                                                        src={imageUrl}
                                                        alt={banner.title}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = '/images/banners/default.jpg';
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800 line-clamp-2">
                                                        {banner.title}
                                                    </p>
                                                    <p className="text-xs text-slate-400">ID: #{banner.bannerId}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleToggleStatus(banner.bannerId, banner.isActive)}
                                                        disabled={isUpdating}
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition ${banner.isActive
                                                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                            } disabled:opacity-50`}
                                                    >
                                                        {banner.isActive ? (
                                                            <CheckCircle size={12} />
                                                        ) : (
                                                            <XCircle size={12} />
                                                        )}
                                                        {banner.isActive ? 'Đang hiển thị' : 'Ẩn'}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    {formatDate(banner.createdAt)}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    {/* ✅ Đã xóa nút xem chi tiết (Eye) */}
                                                    <button
                                                        onClick={() => handleDelete(banner.bannerId, banner.title)}
                                                        disabled={isDeleting}
                                                        className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
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
                            Hiển thị {(pageNum - 1) * pageSize + 1} - {Math.min(pageNum * pageSize, totalElements)} trong {totalElements} banner
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