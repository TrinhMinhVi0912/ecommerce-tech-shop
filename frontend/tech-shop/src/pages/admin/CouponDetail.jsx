// src/pages/admin/CouponDetail.jsx
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    RefreshCw,
    Edit,
    Users,
    Calendar,
    DollarSign,
    Percent,
    Clock,
    CheckCircle,
    XCircle,
    Tag,
    AlertCircle,
    Save,
    X
} from 'lucide-react';
import useCouponDetail from '@/features/admin/coupon/hooks/useCouponDetail';
import useUpdateCouponStatus from '@/features/admin/coupon/hooks/useUpdateCouponStatus';
import { useToast } from '@/context/ToastContext';

export default function CouponDetail() {
    const toast = useToast();
    const { couponId } = useParams();
    const navigate = useNavigate();
    const [isEditingStatus, setIsEditingStatus] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [localCoupon, setLocalCoupon] = useState(null);

    const { data: coupon, loading, refetch } = useCouponDetail(couponId);
    const { updateCouponStatus } = useUpdateCouponStatus();

    React.useEffect(() => {
        if (coupon) {
            setLocalCoupon(coupon);
            setSelectedStatus(coupon.active ? 'true' : 'false');
        }
    }, [coupon]);

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

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value || 0);
    };

    const handleToggleStatus = async () => {
        const newStatus = selectedStatus === 'true';
        try {
            setIsUpdating(true);

            setLocalCoupon(prev => ({ ...prev, active: newStatus }));

            await updateCouponStatus(couponId, { active: newStatus });
            await refetch();
            setIsEditingStatus(false);

        } catch (error) {
            console.error('Update coupon status error:', error);
            toast.error('Không thể cập nhật trạng thái. Vui lòng thử lại.');
            await refetch();
        } finally {
            setIsUpdating(false);
        }
    };

    const displayCoupon = localCoupon || coupon;

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

    if (!displayCoupon) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-6xl text-center">
                <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800">Không tìm thấy mã giảm giá</h2>
                <p className="text-slate-500 mt-2">Mã giảm giá không tồn tại hoặc đã bị xóa.</p>
                <Link to="/admin/coupons" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Quay lại danh sách
                </Link>
            </div>
        );
    }

    const isExpired = new Date(displayCoupon.expireDate) < new Date();
    const isOutOfStock = displayCoupon.quantity <= 0;
    const isActive = displayCoupon.active && !isExpired && !isOutOfStock;

    return (
        <div className="container mx-auto px-4 py-6 max-w-6xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link to="/admin/coupons" className="p-2 hover:bg-slate-100 rounded-lg transition">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Chi tiết mã giảm giá</h1>
                        <p className="text-sm text-slate-500 mt-1">Mã: {displayCoupon.code}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to={`/admin/coupons/edit/${displayCoupon.couponId}`}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                    >
                        <Edit size={18} />
                        Chỉnh sửa
                    </Link>
                    <Link
                        to={`/admin/coupons/${displayCoupon.couponId}/usages`}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
                    >
                        <Users size={18} />
                        Lịch sử
                    </Link>
                    <button onClick={() => refetch()} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition">
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Tag size={20} className="text-blue-600" />
                                Thông tin mã giảm giá
                            </h2>
                            <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${isActive ? 'bg-green-100 text-green-800' :
                                        isExpired ? 'bg-red-100 text-red-800' :
                                            isOutOfStock ? 'bg-orange-100 text-orange-800' :
                                                'bg-slate-100 text-slate-600'
                                    }`}>
                                    {isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                    {isActive ? 'Đang hoạt động' :
                                        isExpired ? 'Hết hạn' :
                                            isOutOfStock ? 'Hết số lượng' : 'Không hoạt động'}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-500">Mã code</label>
                                <p className="text-lg font-mono font-bold text-slate-900 mt-1">{displayCoupon.code}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-500">Tên</label>
                                <p className="text-lg font-medium text-slate-900 mt-1">{displayCoupon.name || 'Chưa có tên'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-500">Giảm giá</label>
                                <p className="text-lg font-bold text-blue-600 mt-1 flex items-center gap-2">
                                    {displayCoupon.discountType === 'PERCENT' ? (
                                        <><Percent size={18} /> {displayCoupon.discount}%</>
                                    ) : (
                                        <><DollarSign size={18} /> {formatCurrency(displayCoupon.discount)}</>
                                    )}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-500">Đơn hàng tối thiểu</label>
                                <p className="text-lg font-medium text-slate-900 mt-1">
                                    {displayCoupon.minimumOrder ? formatCurrency(displayCoupon.minimumOrder) : 'Không yêu cầu'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-500">Số lượng</label>
                                <p className="text-lg font-medium text-slate-900 mt-1">{displayCoupon.quantity}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-500">Đã sử dụng</label>
                                <p className="text-lg font-medium text-slate-900 mt-1">{displayCoupon.totalUsage || 0}</p>
                            </div>
                        </div>

                        {displayCoupon.maximumDiscount && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-700">
                                    <span className="font-medium">Giảm tối đa:</span> {formatCurrency(displayCoupon.maximumDiscount)}
                                </p>
                            </div>
                        )}

                        {displayCoupon.description && (
                            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                                <p className="text-sm text-slate-700">{displayCoupon.description}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Thời gian</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-500">Bắt đầu</label>
                                <p className="text-sm font-medium text-slate-800 mt-1 flex items-center gap-2">
                                    <Calendar size={16} className="text-slate-400" />
                                    {formatDate(displayCoupon.startDate)}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-500">Kết thúc</label>
                                <p className="text-sm font-medium text-slate-800 mt-1 flex items-center gap-2">
                                    <Calendar size={16} className="text-slate-400" />
                                    {formatDate(displayCoupon.expireDate)}
                                </p>
                            </div>
                            <div className="pt-3 border-t border-slate-200">
                                <label className="block text-sm font-medium text-slate-500">Trạng thái</label>
                                <div className="mt-2 flex items-center gap-2">
                                    {isEditingStatus ? (
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={selectedStatus}
                                                onChange={(e) => setSelectedStatus(e.target.value)}
                                                className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                disabled={isUpdating}
                                            >
                                                <option value="true">Hoạt động</option>
                                                <option value="false">Không hoạt động</option>
                                            </select>
                                            <button
                                                onClick={handleToggleStatus}
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
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${displayCoupon.active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {displayCoupon.active ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                                {displayCoupon.active ? 'Hoạt động' : 'Không hoạt động'}
                                            </span>
                                            <button
                                                onClick={() => setIsEditingStatus(true)}
                                                className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition"
                                            >
                                                <Edit size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Thống kê</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Tổng số lượng</span>
                                <span className="font-medium text-slate-900">{displayCoupon.quantity}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Đã sử dụng</span>
                                <span className="font-medium text-slate-900">{displayCoupon.totalUsage || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm border-t border-slate-200 pt-3">
                                <span className="text-slate-500">Còn lại</span>
                                <span className={`font-medium ${displayCoupon.quantity - (displayCoupon.totalUsage || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {displayCoupon.quantity - (displayCoupon.totalUsage || 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}