// src/pages/admin/Users.jsx
import React, { useState, useMemo } from 'react';
import {
    Search,
    RefreshCw,
    Filter,
    X,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import useAdminUsers from '@/features/admin/user/hooks/useAdminUsers';
import useUpdateUserStatus from '@/features/admin/user/hooks/useUpdateUserStatus';
import { getImageUrl } from '@/utils/imageUtils';
import { useToast } from '@/context/ToastContext';

export default function Users() {
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
    const [localUsers, setLocalUsers] = useState([]);

    const params = useMemo(() => ({
        pageNum,
        pageSize,
        sortBy,
        sortDir,
        search: searchTerm || undefined
    }), [pageNum, pageSize, sortBy, sortDir, searchTerm]);

    const { data, loading, refetch } = useAdminUsers(params);
    const { updateUserStatus, loading: updating } = useUpdateUserStatus();

    useMemo(() => {
        if (data?.items) {
            setLocalUsers(data.items);
        }
    }, [data]);

    const users = localUsers;
    const totalElements = data?.totalElements || 0;
    const totalPages = data?.totalPages || 1;

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

    const handleToggleStatus = async (userId, currentStatus) => {
        try {
            setUpdatingId(userId);

            setLocalUsers(prev =>
                prev.map(user =>
                    user.userId === userId
                        ? { ...user, enabled: !currentStatus }
                        : user
                )
            );

            await updateUserStatus(userId, { enabled: !currentStatus });
            await refetch();

        } catch (error) {
            console.error('Update user status error:', error);
            toast.error('Không thể cập nhật trạng thái người dùng. Vui lòng thử lại.');
            await refetch();
        } finally {
            setUpdatingId(null);
        }
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

    const statusOptions = [
        { value: '', label: 'Tất cả' },
        { value: 'true', label: 'Hoạt động' },
        { value: 'false', label: 'Bị khóa' }
    ];

    if (loading) {
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
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý người dùng</h1>
                    <p className="text-sm text-slate-500 mt-1">Quản lý danh sách người dùng trong hệ thống</p>
                </div>
                <button
                    onClick={() => refetch()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <RefreshCw size={18} />
                    Cập nhật
                </button>
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
                                placeholder="Tìm kiếm người dùng (tên, email, số điện thoại)..."
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
                                    <option value="fullName">Họ tên</option>
                                    <option value="email">Email</option>
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
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Người dùng</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Tên đăng nhập</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Số điện thoại</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Ngày tạo</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-4 py-12 text-center text-slate-500">
                                        {searchTerm ? 'Không tìm thấy người dùng nào' : 'Chưa có người dùng nào'}
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => {
                                    const isUpdating = updatingId === user.userId;
                                    const avatarUrl = getImageUrl(user.avatarUrl) || '/images/avatars/default.jpg';

                                    return (
                                        <tr key={user.userId} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={avatarUrl}
                                                        alt={user.fullName || user.userName}
                                                        className="w-10 h-10 rounded-full object-cover bg-slate-100"
                                                        onError={(e) => {
                                                            e.target.src = '/images/avatars/default.jpg';
                                                        }}
                                                    />
                                                    <span className="text-sm font-medium text-slate-800">
                                                        {user.fullName || user.userName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600">
                                                {user.userName}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600">
                                                {user.email}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600">
                                                {user.phone || '--'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${user.enabled
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {user.enabled ? 'Hoạt động' : 'Bị khóa'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-500">
                                                {formatDate(user.createdAt)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end">
                                                    <button
                                                        onClick={() => handleToggleStatus(user.userId, user.enabled)}
                                                        disabled={isUpdating}
                                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${user.enabled
                                                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                            } disabled:opacity-50`}
                                                    >
                                                        {isUpdating ? 'Đang xử lý...' : user.enabled ? 'Khóa' : 'Mở khóa'}
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
                            Hiển thị {(pageNum - 1) * pageSize + 1} - {Math.min(pageNum * pageSize, totalElements)} trong {totalElements} người dùng
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