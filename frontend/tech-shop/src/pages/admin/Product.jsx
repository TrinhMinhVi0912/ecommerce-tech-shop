// src/pages/admin/Products.jsx
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
    X
} from 'lucide-react';
import useAdminProducts from '@/features/admin/product/hooks/useAdminProducts';
import useUpdateProductStatus from '@/features/admin/product/hooks/useUpdateProductStatus';
import { getImageUrl } from '@/utils/imageUtils';
import { useToast } from '@/context/ToastContext';

export default function Products() {
    const toast = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState('productId');
    const [sortDir, setSortDir] = useState('DESC');
    const [statusFilter, setStatusFilter] = useState('');
    const [showFilter, setShowFilter] = useState(false);

    const params = useMemo(() => ({
        pageNum,
        pageSize,
        sortBy,
        sortDir,
        search: searchTerm || undefined,
        isActive: statusFilter || undefined
    }), [pageNum, pageSize, sortBy, sortDir, searchTerm, statusFilter]);

    const { data, loading, refetch } = useAdminProducts(params);
    const { updateProductStatus } = useUpdateProductStatus();

    const products = data?.items || [];
    const totalElements = data?.totalElements || 0;
    const totalPages = data?.totalPages || 1;

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

    const handleStatusToggle = async (productId, currentStatus) => {
        try {
            await updateProductStatus(productId, { isActive: !currentStatus });
            await refetch();
        } catch (error) {
            console.error('Update status error:', error);
            toast.error('Không thể cập nhật trạng thái sản phẩm. Vui lòng thử lại.');
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPageNum(newPage);
        }
    };

    const getStatusBadge = (isActive) => {
        return isActive
            ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Đang bán</span>
            : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Ngừng bán</span>;
    };

    const statusOptions = [
        { value: '', label: 'Tất cả' },
        { value: 'true', label: 'Đang bán' },
        { value: 'false', label: 'Ngừng bán' }
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
                                        <td className="px-4 py-3"><div className="h-4 bg-slate-200 rounded w-8 animate-pulse"></div></td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-slate-200 rounded-lg animate-pulse"></div>
                                                <div className="h-4 bg-slate-200 rounded w-32 animate-pulse"></div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3"><div className="h-4 bg-slate-200 rounded w-20 animate-pulse"></div></td>
                                        <td className="px-4 py-3"><div className="h-4 bg-slate-200 rounded w-16 animate-pulse"></div></td>
                                        <td className="px-4 py-3"><div className="h-4 bg-slate-200 rounded w-24 animate-pulse ml-auto"></div></td>
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
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý sản phẩm</h1>
                    <p className="text-sm text-slate-500 mt-1">Quản lý danh sách sản phẩm trong cửa hàng</p>
                </div>
                <Link
                    to="/admin/products/create"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus size={18} />
                    Thêm sản phẩm
                </Link>
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
                                placeholder="Tìm kiếm sản phẩm..."
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
                                    <option value="productId">ID</option>
                                    <option value="name">Tên</option>
                                    <option value="basePrice">Giá</option>
                                    <option value="createdAt">Ngày tạo</option>
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

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Sản phẩm</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Giá</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-4 py-12 text-center text-slate-500">
                                        {searchTerm ? 'Không tìm thấy sản phẩm nào' : 'Chưa có sản phẩm nào'}
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.productId} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                        <td className="px-4 py-3 text-sm text-slate-600">#{product.productId}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={getImageUrl(product.thumbnailImagePath) || '/images/products/default.jpg'}
                                                    alt={product.name}
                                                    className="w-12 h-12 object-cover rounded-lg bg-slate-50 border border-slate-200"
                                                    onError={(e) => {
                                                        e.target.src = '/images/products/default.jpg';
                                                    }}
                                                />
                                                <span className="text-sm font-medium text-slate-800 line-clamp-1">
                                                    {product.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-slate-800">
                                            {formatCurrency(product.basePrice)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleStatusToggle(product.productId, product.isActive)}
                                                className="hover:opacity-80 transition"
                                            >
                                                {getStatusBadge(product.isActive)}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/admin/products/${product.productId}`}
                                                    className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                                <Link
                                                    to={`/admin/products/edit/${product.productId}`}
                                                    className="p-2 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
                        <div className="text-sm text-slate-500">
                            Hiển thị {(pageNum - 1) * pageSize + 1} - {Math.min(pageNum * pageSize, totalElements)} trong {totalElements} sản phẩm
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