// src/pages/admin/CouponUsages.jsx
import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Users,
    Calendar,
    User,
    Mail
} from 'lucide-react';
import useCouponUsages from '@/features/admin/coupon/hooks/useCouponUsages';

export default function CouponUsages() {
    const { couponId } = useParams();
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const params = useMemo(() => ({
        pageNum,
        pageSize,
        search: searchTerm || undefined
    }), [pageNum, pageSize, searchTerm]);

    const { data, loading, refetch } = useCouponUsages(couponId, params);

    const usages = data?.items || [];
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

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-6 max-w-6xl">
                <div className="animate-pulse">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-10 w-10 bg-slate-200 rounded-lg"></div>
                        <div className="h-8 bg-slate-200 rounded w-64"></div>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="p-4">
                            <div className="h-10 bg-slate-200 rounded w-full mb-4"></div>
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-12 bg-slate-200 rounded mb-2"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-6xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link
                        to="/admin/coupons"
                        className="p-2 hover:bg-slate-100 rounded-lg transition"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Lịch sử sử dụng mã giảm giá</h1>
                        <p className="text-sm text-slate-500 mt-1">Mã giảm giá ID: #{couponId}</p>
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

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Tìm kiếm theo tên đăng nhập hoặc email..."
                                className="w-full pl-4 pr-10 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Tìm kiếm
                        </button>
                    </form>
                </div>

                <div className="overflow-x-auto">
                    {usages.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <Users size={48} className="mx-auto mb-4 text-slate-300" />
                            <p>Chưa có ai sử dụng mã giảm giá này</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Người dùng</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Thời gian sử dụng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usages.map((usage) => (
                                    <tr key={usage.usageId} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <User size={16} className="text-slate-400" />
                                                <span className="text-sm font-medium text-slate-800">{usage.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Mail size={16} className="text-slate-400" />
                                                <span className="text-sm text-slate-600">{usage.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-slate-400" />
                                                <span className="text-sm text-slate-600">{formatDate(usage.usedAt)}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
                        <div className="text-sm text-slate-500">
                            Hiển thị {(pageNum - 1) * pageSize + 1} - {Math.min(pageNum * pageSize, totalElements)} trong {totalElements} lượt sử dụng
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