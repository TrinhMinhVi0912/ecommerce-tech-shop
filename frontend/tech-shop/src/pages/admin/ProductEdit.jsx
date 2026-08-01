// src/pages/admin/ProductEdit.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Save,
    X,
    Plus,
    Trash2,
    Image as ImageIcon,
    Upload,
    AlertCircle,
    Loader2
} from 'lucide-react';
import useAdminProductDetail from '@/features/admin/product/hooks/useAdminProductDetail';
import useAdminUpdateProduct from '@/features/admin/product/hooks/useAdminUpdateProduct';
import useCategories from '@/features/category/hooks/useCategories';
import useBrands from '@/features/brand/hooks/useBrands';
import { getImageUrl } from '@/utils/imageUtils';

export default function ProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const formRef = useRef(null);

    // Fetch data
    const { data: productData, loading: productLoading } = useAdminProductDetail(id);
    const { updateProduct, loading: updating } = useAdminUpdateProduct();
    const { data: categoriesData, loading: categoriesLoading } = useCategories();
    const { data: brandsData, loading: brandsLoading } = useBrands();

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        basePrice: '',
        brandId: '',
        categoryId: '',
        thumbnail: '',
        existingImages: [],
        variants: []
    });

    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = categoriesData?.data?.items || [];
    const brands = brandsData?.data?.items || [];

    // Load product data
    useEffect(() => {
        if (productData) {
            const product = productData?.productDetailResponse || productData;

            const loadedVariants = (product.variants || []).map(v => ({
                ...v,
                attributes: (v.attributes || []).map(a => ({
                    name: a.name || a.attributeName || '',
                    value: a.value || a.attributeValue || ''
                }))
            }));

            setFormData({
                name: product.name || '',
                description: product.description || '',
                basePrice: product.basePrice || '',
                brandId: product.brandId || product.brandResponse?.brandId || product.brand?.brandId || '',
                categoryId: product.categoryId || product.categoryResponse?.categoryId || product.category?.categoryId || '',
                thumbnail: product.thumbnailImagePath || product.thumbnail || (product.images?.[0]?.imagePath) || '',
                existingImages: product.images?.map(img => img.imagePath) || [],
                variants: loadedVariants
            });

            // Set image previews for existing images
            if (product.images && product.images.length > 0) {
                setImagePreviews(
                    product.images.map(img => ({
                        url: getImageUrl(img.imagePath),
                        path: img.imagePath,
                        isExisting: true
                    }))
                );
            }
        }
    }, [productData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...formData.variants];
        updatedVariants[index] = { ...updatedVariants[index], [field]: value };
        setFormData(prev => ({ ...prev, variants: updatedVariants }));
    };

    const handleAttributeChange = (variantIndex, attrIndex, field, value) => {
        const updatedVariants = [...formData.variants];
        const attrs = [...(updatedVariants[variantIndex].attributes || [])];
        attrs[attrIndex] = { ...attrs[attrIndex], [field]: value };
        updatedVariants[variantIndex].attributes = attrs;
        setFormData(prev => ({ ...prev, variants: updatedVariants }));
    };

    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [
                ...prev.variants,
                {
                    variantId: null,
                    price: '',
                    stock: '',
                    sku: '',
                    attributes: [{ name: '', value: '' }]
                }
            ]
        }));
    };

    const removeVariant = (index) => {
        if (formData.variants.length <= 1) {
            alert('Sản phẩm phải có ít nhất 1 biến thể');
            return;
        }
        const updatedVariants = formData.variants.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, variants: updatedVariants }));
    };

    const addAttribute = (variantIndex) => {
        const updatedVariants = [...formData.variants];
        updatedVariants[variantIndex].attributes = [
            ...(updatedVariants[variantIndex].attributes || []),
            { name: '', value: '' }
        ];
        setFormData(prev => ({ ...prev, variants: updatedVariants }));
    };

    const removeAttribute = (variantIndex, attrIndex) => {
        const updatedVariants = [...formData.variants];
        const attrs = updatedVariants[variantIndex].attributes || [];
        if (attrs.length <= 1) {
            alert('Biến thể phải có ít nhất 1 thuộc tính');
            return;
        }
        updatedVariants[variantIndex].attributes = attrs.filter((_, i) => i !== attrIndex);
        setFormData(prev => ({ ...prev, variants: updatedVariants }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);
        if (invalidFiles.length > 0) {
            alert('Một số file vượt quá 5MB. Vui lòng chọn file nhỏ hơn.');
            return;
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        const invalidTypes = files.filter(file => !validTypes.includes(file.type));
        if (invalidTypes.length > 0) {
            alert('Chỉ chấp nhận file ảnh (JPEG, PNG, WEBP)');
            return;
        }

        setImageFiles(prev => [...prev, ...files]);

        const newPreviews = files.map(file => ({
            url: URL.createObjectURL(file),
            file: file,
            isExisting: false
        }));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        if (imagePreviews[index]?.isExisting) {
            const path = imagePreviews[index].path;
            setFormData(prev => ({
                ...prev,
                existingImages: prev.existingImages.filter(p => p !== path)
            }));
        } else {
            setImageFiles(prev => prev.filter((_, i) => i !== index - imagePreviews.filter(p => p.isExisting).length));
        }
    };

    const setThumbnail = (index) => {
        const imagePath = imagePreviews[index]?.path || imagePreviews[index]?.url;
        setFormData(prev => ({ ...prev, thumbnail: imagePath }));
    };

    const validate = () => {
        const newErrors = {};
        if (!(formData.name || '').trim()) newErrors.name = 'Tên sản phẩm là bắt buộc';
        if (!(formData.description || '').trim()) newErrors.description = 'Mô tả sản phẩm là bắt buộc';
        if (!formData.basePrice || Number(formData.basePrice) <= 0) {
            newErrors.basePrice = 'Giá sản phẩm phải lớn hơn 0';
        }
        if (!formData.brandId) newErrors.brandId = 'Vui lòng chọn thương hiệu';
        if (!formData.categoryId) newErrors.categoryId = 'Vui lòng chọn danh mục';
        if (!formData.thumbnail) newErrors.thumbnail = 'Vui lòng chọn ảnh đại diện';

        formData.variants.forEach((variant, index) => {
            if (!variant.price || Number(variant.price) <= 0) {
                newErrors[`variant_${index}_price`] = 'Giá biến thể phải lớn hơn 0';
            }
            if (!variant.sku || !(variant.sku || '').trim()) {
                newErrors[`variant_${index}_sku`] = 'SKU là bắt buộc';
            }
            if (variant.stock === undefined || variant.stock === null || Number(variant.stock) < 0) {
                newErrors[`variant_${index}_stock`] = 'Tồn kho không hợp lệ';
            }
            variant.attributes?.forEach((attr, attrIndex) => {
                const attrName = attr.name || attr.attributeName || '';
                const attrVal = attr.value || attr.attributeValue || '';
                if (!attrName.trim()) {
                    newErrors[`variant_${index}_attr_${attrIndex}_name`] = 'Tên thuộc tính là bắt buộc';
                }
                if (!attrVal.trim()) {
                    newErrors[`variant_${index}_attr_${attrIndex}_value`] = 'Giá trị thuộc tính là bắt buộc';
                }
            });
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        console.log('🚀 Form submitted!');

        if (!validate()) {
            const firstError = document.querySelector('[data-error="true"]');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setIsSubmitting(true);
        try {
            const formDataToSend = new FormData();

            const productDataToSend = {
                name: formData.name,
                description: formData.description,
                basePrice: Number(formData.basePrice),
                brandId: Number(formData.brandId),
                categoryId: Number(formData.categoryId),
                thumbnail: formData.thumbnail,
                existingImages: formData.existingImages,
                variants: formData.variants.map(v => ({
                    variantId: v.variantId || null,
                    price: Number(v.price),
                    stock: Number(v.stock),
                    sku: v.sku,
                    attributes: (v.attributes || []).map(a => ({
                        attributeName: a.name || a.attributeName || '',
                        attributeValue: a.value || a.attributeValue || ''
                    }))
                }))
            };

            console.log('📤 Product data:', productDataToSend);

            formDataToSend.append('product', new Blob([JSON.stringify(productDataToSend)], { type: 'application/json' }));

            const newFiles = imagePreviews.filter(p => !p.isExisting).map(p => p.file);
            newFiles.forEach(file => {
                formDataToSend.append('images', file);
            });

            await updateProduct(id, formDataToSend);
            alert('Cập nhật sản phẩm thành công!');
            navigate(`/admin/products/${id}`);
        } catch (error) {
            console.error('Update product error:', error);
            alert(error.response?.data?.message || 'Không thể cập nhật sản phẩm. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveClick = (e) => {
        console.log('🔄 Save button clicked!');
        if (formRef.current) {
            if (typeof formRef.current.requestSubmit === 'function') {
                formRef.current.requestSubmit();
            } else {
                handleSubmit(e);
            }
        } else {
            handleSubmit(e);
        }
    };

    if (productLoading || categoriesLoading || brandsLoading) {
        return (
            <div className="container mx-auto px-4 py-6 max-w-6xl">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-48 mb-6"></div>
                    <div className="space-y-4">
                        <div className="h-64 bg-slate-200 rounded-xl"></div>
                        <div className="h-48 bg-slate-200 rounded-xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!productData) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-6xl text-center">
                <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800">Không tìm thấy sản phẩm</h2>
                <p className="text-slate-500 mt-2">Sản phẩm không tồn tại hoặc đã bị xóa.</p>
                <Link to="/admin/products" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Quay lại danh sách
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link to={`/admin/products/${id}`} className="p-2 hover:bg-slate-100 rounded-lg transition">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Chỉnh sửa sản phẩm</h1>
                        <p className="text-sm text-slate-500 mt-1">ID: #{id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link to={`/admin/products/${id}`} className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition text-sm">
                        Hủy
                    </Link>
                    <button
                        type="submit"
                        form="product-edit-form"
                        onClick={handleSaveClick}
                        disabled={isSubmitting || updating}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {isSubmitting || updating ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Lưu thay đổi
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Form */}
            <form id="product-edit-form" ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Thông tin cơ bản</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Tên sản phẩm <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-slate-200'
                                    }`}
                                data-error={!!errors.name}
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Giá cơ bản <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="basePrice"
                                value={formData.basePrice}
                                onChange={handleChange}
                                min="0"
                                step="1000"
                                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.basePrice ? 'border-red-500' : 'border-slate-200'
                                    }`}
                                data-error={!!errors.basePrice}
                            />
                            {errors.basePrice && <p className="mt-1 text-xs text-red-500">{errors.basePrice}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Thương hiệu <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="brandId"
                                value={formData.brandId}
                                onChange={handleChange}
                                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.brandId ? 'border-red-500' : 'border-slate-200'
                                    }`}
                                data-error={!!errors.brandId}
                            >
                                <option value="">Chọn thương hiệu</option>
                                {brands.map(brand => (
                                    <option key={brand.brandId} value={brand.brandId}>{brand.name}</option>
                                ))}
                            </select>
                            {errors.brandId && <p className="mt-1 text-xs text-red-500">{errors.brandId}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Danh mục <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.categoryId ? 'border-red-500' : 'border-slate-200'
                                    }`}
                                data-error={!!errors.categoryId}
                            >
                                <option value="">Chọn danh mục</option>
                                {categories.map(category => (
                                    <option key={category.categoryId} value={category.categoryId}>{category.name}</option>
                                ))}
                            </select>
                            {errors.categoryId && <p className="mt-1 text-xs text-red-500">{errors.categoryId}</p>}
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Mô tả <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-slate-200'
                                }`}
                            data-error={!!errors.description}
                        />
                        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Hình ảnh</h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Thêm ảnh mới</label>
                        <div className="relative">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
                                <Upload size={32} className="mx-auto text-slate-400" />
                                <p className="mt-2 text-sm text-slate-500">Kéo thả hoặc click để chọn ảnh</p>
                                <p className="text-xs text-slate-400">JPEG, PNG, WEBP (tối đa 5MB)</p>
                            </div>
                        </div>
                    </div>

                    {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={preview.url}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-24 object-cover rounded-lg border border-slate-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                                    >
                                        <X size={12} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setThumbnail(index)}
                                        className={`absolute bottom-1 left-1 px-2 py-0.5 text-xs rounded transition ${formData.thumbnail === (preview.path || preview.url)
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-black/50 text-white hover:bg-blue-600'
                                            }`}
                                    >
                                        {formData.thumbnail === (preview.path || preview.url) ? 'Thumbnail' : 'Đặt làm thumbnail'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    {errors.thumbnail && <p className="mt-1 text-xs text-red-500">{errors.thumbnail}</p>}
                </div>

                {/* Variants */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-900">Biến thể</h2>
                        <button
                            type="button"
                            onClick={addVariant}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                        >
                            <Plus size={18} />
                            Thêm biến thể
                        </button>
                    </div>

                    <div className="space-y-4">
                        {formData.variants.map((variant, vIndex) => (
                            <div key={vIndex} className="border border-slate-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-medium text-slate-900">Biến thể {vIndex + 1}</h4>
                                    <button
                                        type="button"
                                        onClick={() => removeVariant(vIndex)}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">
                                            SKU <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={variant.sku || ''}
                                            onChange={(e) => handleVariantChange(vIndex, 'sku', e.target.value)}
                                            className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`variant_${vIndex}_sku`] ? 'border-red-500' : 'border-slate-200'
                                                }`}
                                            data-error={!!errors[`variant_${vIndex}_sku`]}
                                        />
                                        {errors[`variant_${vIndex}_sku`] && (
                                            <p className="mt-0.5 text-xs text-red-500">{errors[`variant_${vIndex}_sku`]}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">
                                            Giá <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={variant.price || ''}
                                            onChange={(e) => handleVariantChange(vIndex, 'price', e.target.value)}
                                            min="0"
                                            step="1000"
                                            className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`variant_${vIndex}_price`] ? 'border-red-500' : 'border-slate-200'
                                                }`}
                                            data-error={!!errors[`variant_${vIndex}_price`]}
                                        />
                                        {errors[`variant_${vIndex}_price`] && (
                                            <p className="mt-0.5 text-xs text-red-500">{errors[`variant_${vIndex}_price`]}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">
                                            Tồn kho <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={variant.stock || ''}
                                            onChange={(e) => handleVariantChange(vIndex, 'stock', e.target.value)}
                                            min="0"
                                            className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`variant_${vIndex}_stock`] ? 'border-red-500' : 'border-slate-200'
                                                }`}
                                            data-error={!!errors[`variant_${vIndex}_stock`]}
                                        />
                                        {errors[`variant_${vIndex}_stock`] && (
                                            <p className="mt-0.5 text-xs text-red-500">{errors[`variant_${vIndex}_stock`]}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Attributes */}
                                <div className="mt-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs font-medium text-slate-700">Thuộc tính</label>
                                        <button
                                            type="button"
                                            onClick={() => addAttribute(vIndex)}
                                            className="text-xs text-blue-600 hover:text-blue-700"
                                        >
                                            + Thêm thuộc tính
                                        </button>
                                    </div>
                                    {(variant.attributes || []).map((attr, aIndex) => (
                                        <div key={aIndex} className="flex items-center gap-2 mb-2">
                                            <input
                                                type="text"
                                                placeholder="Tên (VD: RAM)"
                                                value={attr.name || ''}
                                                onChange={(e) => handleAttributeChange(vIndex, aIndex, 'name', e.target.value)}
                                                className={`flex-1 border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`variant_${vIndex}_attr_${aIndex}_name`] ? 'border-red-500' : 'border-slate-200'
                                                    }`}
                                                data-error={!!errors[`variant_${vIndex}_attr_${aIndex}_name`]}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Giá trị (VD: 16GB)"
                                                value={attr.value || ''}
                                                onChange={(e) => handleAttributeChange(vIndex, aIndex, 'value', e.target.value)}
                                                className={`flex-1 border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`variant_${vIndex}_attr_${aIndex}_value`] ? 'border-red-500' : 'border-slate-200'
                                                    }`}
                                                data-error={!!errors[`variant_${vIndex}_attr_${aIndex}_value`]}
                                            />
                                            {variant.attributes.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeAttribute(vIndex, aIndex)}
                                                    className="p-1 text-red-400 hover:text-red-600"
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {(errors[`variant_${vIndex}_attr_0_name`] || errors[`variant_${vIndex}_attr_0_value`]) && (
                                        <p className="mt-0.5 text-xs text-red-500">
                                            {errors[`variant_${vIndex}_attr_0_name`] || errors[`variant_${vIndex}_attr_0_value`]}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </form>
        </div>
    );
}