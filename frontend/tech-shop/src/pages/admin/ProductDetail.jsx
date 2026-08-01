// src/pages/admin/ProductDetail.jsx
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Edit,
    RefreshCw,
    Package,
    Tag,
    User,
    Image as ImageIcon,
    ChevronLeft,
    ChevronRight,
    X,
    Check,
    AlertCircle
} from 'lucide-react';
import useAdminProductDetail from '@/features/admin/product/hooks/useAdminProductDetail';
import useUpdateProductStatus from '@/features/admin/product/hooks/useUpdateProductStatus';
import { getImageUrl } from '@/utils/imageUtils';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('info');
    const [selectedImage, setSelectedImage] = useState(0);
    const { data, loading, refetch } = useAdminProductDetail(id);
    const { updateProductStatus, loading: updating } = useUpdateProductStatus();

    const product = data?.productDetailResponse || data;
    const isActive = data?.isActive !== undefined ? data.isActive : product?.isActive;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value || 0);
    };

    const handleStatusToggle = async () => {
        try {
            await updateProductStatus(id, { isActive: !isActive });
            await refetch();
        } catch (error) {
            console.error('Update status error:', error);
            alert('Không thể cập nhật trạng thái sản phẩm. Vui lòng thử lại.');
        }
    };

    const getStatusBadge = (isActive) => {
        return isActive
            ? <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">Đang bán</span>
            : <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">Ngừng bán</span>;
    };

    const tabs = [
        { id: 'info', label: 'Thông tin sản phẩm' },
        { id: 'variants', label: 'Biến thể' },
        { id: 'images', label: 'Hình ảnh' }
    ];

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

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-6xl text-center">
                <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800">Không tìm thấy sản phẩm</h2>
                <p className="text-slate-500 mt-2">Sản phẩm không tồn tại hoặc đã bị xóa.</p>
                <Link
                    to="/admin/products"
                    className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Quay lại danh sách
                </Link>
            </div>
        );
    }

    const images = product.images || [];
    const variants = product.variants || [];

    return (
        <div className="container mx-auto px-4 py-6 max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link
                        to="/admin/products"
                        className="p-2 hover:bg-slate-100 rounded-lg transition"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-slate-500">ID: #{product.productId}</span>
                            {getStatusBadge(isActive)}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => refetch()}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
                >
                    <RefreshCw size={18} />
                </button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Product Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tabs */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="flex border-b border-slate-200">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-3 text-sm font-medium transition ${activeTab === tab.id
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                                        : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-6">
                            {/* Tab: Thông tin sản phẩm */}
                            {activeTab === 'info' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-500">Tên sản phẩm</label>
                                            <p className="text-sm text-slate-900 mt-1">{product.name}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-500">Giá cơ bản</label>
                                            <p className="text-sm font-bold text-blue-600 mt-1">{formatCurrency(product.basePrice)}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-500">Thương hiệu</label>
                                            <p className="text-sm text-slate-900 mt-1">{product.brandResponse?.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-500">Danh mục</label>
                                            <p className="text-sm text-slate-900 mt-1">{product.categoryResponse?.name || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-500">Mô tả</label>
                                        <p className="text-sm text-slate-700 mt-1 leading-relaxed">{product.description || 'Chưa có mô tả'}</p>
                                    </div>
                                </div>
                            )}

                            {/* Tab: Biến thể */}
                            {activeTab === 'variants' && (
                                <div>
                                    {variants.length === 0 ? (
                                        <div className="text-center py-8 text-slate-500">
                                            <Package size={32} className="mx-auto mb-2 text-slate-300" />
                                            <p>Chưa có biến thể nào</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {variants.map((variant, index) => (
                                                <div key={variant.variantId || index} className="border border-slate-200 rounded-lg p-4">
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        <div>
                                                            <label className="block text-xs font-medium text-slate-500">SKU</label>
                                                            <p className="text-sm text-slate-900 mt-1">{variant.sku || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-slate-500">Giá</label>
                                                            <p className="text-sm font-medium text-blue-600 mt-1">{formatCurrency(variant.price)}</p>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-slate-500">Tồn kho</label>
                                                            <p className={`text-sm font-medium mt-1 ${variant.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                {variant.stock || 0} sản phẩm
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-slate-500">Thuộc tính</label>
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {variant.attributes?.map((attr, i) => (
                                                                    <span key={i} className="text-xs bg-slate-100 px-2 py-0.5 rounded">
                                                                        {attr.name}: {attr.value}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Tab: Hình ảnh */}
                            {activeTab === 'images' && (
                                <div>
                                    {images.length === 0 ? (
                                        <div className="text-center py-8 text-slate-500">
                                            <ImageIcon size={32} className="mx-auto mb-2 text-slate-300" />
                                            <p>Chưa có hình ảnh nào</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {images.map((image, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={getImageUrl(image.imagePath) || '/images/products/default.jpg'}
                                                        alt={`${product.name} - ${index + 1}`}
                                                        className="w-full h-40 object-cover rounded-lg border border-slate-200"
                                                        onError={(e) => {
                                                            e.target.src = '/images/products/default.jpg';
                                                        }}
                                                    />
                                                    {image.thumbnail && (
                                                        <span className="absolute top-2 right-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                                                            Thumbnail
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Summary */}
                <div className="space-y-6">
                    {/* Quick Info */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h3 className="font-semibold text-slate-900 mb-4">Thông tin nhanh</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Số biến thể</span>
                                <span className="font-medium text-slate-900">{variants.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Số hình ảnh</span>
                                <span className="font-medium text-slate-900">{images.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Trạng thái</span>
                                {getStatusBadge(isActive)}
                            </div>
                        </div>
                    </div>

                    {/* Total Stock */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h3 className="font-semibold text-slate-900 mb-4">Tồn kho tổng</h3>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-slate-900">
                                {variants.reduce((sum, v) => sum + (v.stock || 0), 0)}
                            </p>
                            <p className="text-sm text-slate-500 mt-1">sản phẩm</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h3 className="font-semibold text-slate-900 mb-4">Thao tác</h3>
                        <div className="space-y-2">
                            <Link
                                to={`/admin/products/edit/${product.productId}`}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                <Edit size={18} />
                                Chỉnh sửa sản phẩm
                            </Link>
                            <button
                                onClick={handleStatusToggle}
                                disabled={updating}
                                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white transition ${isActive
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-green-500 hover:bg-green-600'
                                    } disabled:opacity-50`}
                            >
                                {isActive ? <X size={18} /> : <Check size={18} />}
                                {isActive ? 'Ngừng bán' : 'Đăng bán'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}