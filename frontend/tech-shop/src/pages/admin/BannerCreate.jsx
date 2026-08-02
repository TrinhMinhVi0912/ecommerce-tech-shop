// src/pages/admin/BannerCreate.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Save,
    X,
    AlertCircle,
    Loader2,
    Upload,
    Image as ImageIcon
} from 'lucide-react';
import useCreateBanner from '@/features/admin/banner/hooks/useCreateBanner';
import { getImageUrl } from '@/utils/imageUtils';
import { useToast } from '@/context/ToastContext';

export default function BannerCreate() {
    const toast = useToast();
    const navigate = useNavigate();
    const { createBanner, loading } = useCreateBanner();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.warning('Vui lòng chọn file ảnh');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.warning('Kích thước ảnh không được vượt quá 5MB');
            return;
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        if (errors.image) {
            setErrors(prev => ({ ...prev, image: '' }));
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const validate = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = 'Tiêu đề là bắt buộc';
        if (!imageFile) newErrors.image = 'Vui lòng chọn ảnh banner';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', title.trim());
            formData.append('image', imageFile);

            await createBanner(formData);
            toast.success('Thêm banner thành công!');
            navigate('/admin/banners');
        } catch (error) {
            console.error('Create banner error:', error);
            toast.error(error.response?.data?.message || 'Không thể thêm banner. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-3xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link to="/admin/banners" className="p-2 hover:bg-slate-100 rounded-lg transition">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Thêm banner mới</h1>
                        <p className="text-sm text-slate-500 mt-1">Tạo banner quảng cáo mới</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/admin/banners" className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition text-sm">
                        Hủy
                    </Link>
                    <button
                        type="submit"
                        form="banner-form"
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
                                Thêm banner
                            </>
                        )}
                    </button>
                </div>
            </div>

            <form id="banner-form" onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Tiêu đề <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (errors.title) {
                                setErrors(prev => ({ ...prev, title: '' }));
                            }
                        }}
                        placeholder="Nhập tiêu đề banner"
                        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-slate-200'}`}
                        data-error={!!errors.title}
                    />
                    {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Hình ảnh <span className="text-red-500">*</span>
                    </label>
                    {imagePreview ? (
                        <div className="relative">
                            <img
                                src={imagePreview}
                                alt="Banner preview"
                                className="w-full max-h-64 object-cover rounded-lg border border-slate-200"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className={`border-2 border-dashed rounded-lg p-12 text-center hover:border-blue-500 transition ${errors.image ? 'border-red-500' : 'border-slate-300'}`}>
                                <Upload size={48} className="mx-auto text-slate-400" />
                                <p className="mt-2 text-sm text-slate-500">Click hoặc kéo thả để chọn ảnh</p>
                                <p className="text-xs text-slate-400">JPEG, PNG, WEBP (tối đa 5MB)</p>
                            </div>
                        </div>
                    )}
                    {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
                    {imagePreview && (
                        <p className="text-xs text-slate-400 mt-1">
                            Kích thước khuyến nghị: 1200 x 400px
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}