// src/pages/admin/CouponCreate.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Save,
    X,
    AlertCircle,
    Loader2,
    Percent,
    DollarSign,
    Calendar,
    Tag
} from 'lucide-react';
import useCreateCoupon from '@/features/admin/coupon/hooks/useCreateCoupon';

export default function CouponCreate() {
    const navigate = useNavigate();
    const { createCoupon, loading } = useCreateCoupon();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        discount: '',
        discountType: 'PERCENT',
        minimumOrder: '',
        maximumDiscount: '',
        quantity: '',
        startDate: '',
        expireDate: '',
        active: true,
        description: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.code.trim()) newErrors.code = 'Mã code là bắt buộc';
        if (!formData.discount || Number(formData.discount) <= 0) {
            newErrors.discount = 'Giá trị giảm giá phải lớn hơn 0';
        }
        if (formData.discountType === 'PERCENT' && Number(formData.discount) > 100) {
            newErrors.discount = 'Giảm giá phần trăm không được vượt quá 100%';
        }
        if (!formData.quantity || Number(formData.quantity) <= 0) {
            newErrors.quantity = 'Số lượng phải lớn hơn 0';
        }
        if (!formData.startDate) newErrors.startDate = 'Ngày bắt đầu là bắt buộc';
        if (!formData.expireDate) newErrors.expireDate = 'Ngày kết thúc là bắt buộc';
        if (formData.startDate && formData.expireDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.expireDate);
            if (end <= start) {
                newErrors.expireDate = 'Ngày kết thúc phải sau ngày bắt đầu';
            }
        }
        if (formData.discountType === 'PERCENT' && formData.maximumDiscount && Number(formData.maximumDiscount) <= 0) {
            newErrors.maximumDiscount = 'Giảm tối đa phải lớn hơn 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            const firstError = document.querySelector('[data-error="true"]');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setIsSubmitting(true);
        try {
            const dataToSend = {
                ...formData,
                discount: Number(formData.discount),
                minimumOrder: formData.minimumOrder ? Number(formData.minimumOrder) : 0,
                maximumDiscount: formData.maximumDiscount ? Number(formData.maximumDiscount) : null,
                quantity: Number(formData.quantity),
                active: true
            };

            await createCoupon(dataToSend);
            alert('Tạo mã giảm giá thành công!');
            navigate('/admin/coupons');
        } catch (error) {
            console.error('Create coupon error:', error);
            alert(error.response?.data?.message || 'Không thể tạo mã giảm giá. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getToday = () => {
        const today = new Date();
        return today.toISOString().slice(0, 16);
    };

    const getDefaultExpire = () => {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        return date.toISOString().slice(0, 16);
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link to="/admin/coupons" className="p-2 hover:bg-slate-100 rounded-lg transition">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Thêm mã giảm giá mới</h1>
                        <p className="text-sm text-slate-500 mt-1">Tạo mã giảm giá mới trong cửa hàng</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/admin/coupons" className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition text-sm">
                        Hủy
                    </Link>
                    <button
                        type="submit"
                        form="coupon-form"
                        disabled={isSubmitting || loading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {isSubmitting || loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Đang tạo...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Tạo mã
                            </>
                        )}
                    </button>
                </div>
            </div>

            <form id="coupon-form" onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Tên mã giảm giá
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="VD: Giảm giá mùa hè"
                            className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Mã code <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            placeholder="VD: SUMMER2024"
                            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.code ? 'border-red-500' : 'border-slate-200'}`}
                            data-error={!!errors.code}
                        />
                        {errors.code && <p className="mt-1 text-xs text-red-500">{errors.code}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Loại giảm giá <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="discountType"
                            value={formData.discountType}
                            onChange={handleChange}
                            className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="PERCENT">Phần trăm (%)</option>
                            <option value="FIXED">Số tiền cố định</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Giá trị giảm <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            {formData.discountType === 'PERCENT' ? (
                                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            ) : (
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            )}
                            <input
                                type="number"
                                name="discount"
                                value={formData.discount}
                                onChange={handleChange}
                                min="0"
                                step={formData.discountType === 'PERCENT' ? 1 : 1000}
                                placeholder={formData.discountType === 'PERCENT' ? 'Nhập % giảm' : 'Nhập số tiền giảm'}
                                className={`w-full pl-10 pr-4 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.discount ? 'border-red-500' : 'border-slate-200'}`}
                                data-error={!!errors.discount}
                            />
                        </div>
                        {errors.discount && <p className="mt-1 text-xs text-red-500">{errors.discount}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Đơn hàng tối thiểu
                        </label>
                        <input
                            type="number"
                            name="minimumOrder"
                            value={formData.minimumOrder}
                            onChange={handleChange}
                            min="0"
                            step="1000"
                            placeholder="VD: 100000"
                            className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {formData.discountType === 'PERCENT' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Giảm tối đa
                            </label>
                            <input
                                type="number"
                                name="maximumDiscount"
                                value={formData.maximumDiscount}
                                onChange={handleChange}
                                min="0"
                                step="1000"
                                placeholder="VD: 100000"
                                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.maximumDiscount ? 'border-red-500' : 'border-slate-200'}`}
                                data-error={!!errors.maximumDiscount}
                            />
                            {errors.maximumDiscount && <p className="mt-1 text-xs text-red-500">{errors.maximumDiscount}</p>}
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Số lượng <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        min="1"
                        placeholder="VD: 100"
                        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.quantity ? 'border-red-500' : 'border-slate-200'}`}
                        data-error={!!errors.quantity}
                    />
                    {errors.quantity && <p className="mt-1 text-xs text-red-500">{errors.quantity}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Ngày bắt đầu <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.startDate ? 'border-red-500' : 'border-slate-200'}`}
                            data-error={!!errors.startDate}
                        />
                        {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Ngày kết thúc <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            name="expireDate"
                            value={formData.expireDate}
                            onChange={handleChange}
                            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.expireDate ? 'border-red-500' : 'border-slate-200'}`}
                            data-error={!!errors.expireDate}
                        />
                        {errors.expireDate && <p className="mt-1 text-xs text-red-500">{errors.expireDate}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Mô tả
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Mô tả chi tiết về mã giảm giá..."
                        className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                </div>
            </form>
        </div>
    );
}