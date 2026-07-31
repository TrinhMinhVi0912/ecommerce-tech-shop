// src/components/wishlist/WishlistCard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';
import useRemoveFromWishlist from '@/features/wishlist/hooks/useRemoveWishlist';
import useAddToCart from '@/features/cart/hooks/useAddCartItem';
import useProductDetail from '@/features/product/hooks/useProductDetail';
import useCartStore from '@/store/cartStore';
import { getImageUrl } from '@/utils/imageUtils';

const IMAGE_BASE_URL =
    import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:8080/api";

const WishlistCard = ({ item, onRemove, onCartAdd }) => {
    const [imageError, setImageError] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [isVariantOpen, setIsVariantOpen] = useState(false);

    const { removeFromWishlist, loading: removing } = useRemoveFromWishlist();
    const { addToCart, loading: adding } = useAddToCart();
    const { fetchCart } = useCartStore();

    // Lấy chi tiết sản phẩm để lấy danh sách variants
    const { data: productData, loading: productLoading } = useProductDetail(item.productId);
    const product = productData?.data || productData;
    const variants = product?.variants || [];

    // Chọn variant đầu tiên mặc định
    useEffect(() => {
        if (variants.length > 0 && !selectedVariant) {
            setSelectedVariant(variants[0]);
        }
    }, [variants]);

    const imageUrl = item.thumbnailImagePath && !imageError
        ? `${IMAGE_BASE_URL}${item.thumbnailImagePath}`
        : '/images/products/default.jpg';

    const formatCurrency = (value) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value ?? 0);

    const handleRemove = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi danh sách yêu thích?')) {
            try {
                await removeFromWishlist(item.productId);
                if (onRemove) onRemove();
            } catch (error) {
                console.error('Remove from wishlist error:', error);
                alert('Không thể xóa sản phẩm. Vui lòng thử lại.');
            }
        }
    };

    const handleVariantSelect = (variant) => {
        setSelectedVariant(variant);
        setIsVariantOpen(false);
    };

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Kiểm tra đã chọn variant chưa
        if (!selectedVariant) {
            alert('Vui lòng chọn phân loại sản phẩm');
            return;
        }

        try {
            setIsAdding(true);

            // Thêm vào giỏ hàng với variantId
            await addToCart({
                variantId: selectedVariant.variantId,
                quantity: 1
            });

            // ✅ Refresh giỏ hàng để cập nhật số lượng trên Navbar
            await fetchCart();

            // ✅ Refresh wishlist để cập nhật danh sách
            if (onCartAdd) {
                await onCartAdd();
            }

            alert('Đã thêm sản phẩm vào giỏ hàng!');
        } catch (error) {
            console.error('Add to cart error:', error);
            const errorMessage = error.response?.data?.message ||
                error.message ||
                'Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.';
            alert(errorMessage);
        } finally {
            setIsAdding(false);
        }
    };

    const isLoading = isAdding || adding;

    // Hiển thị thông tin variant đã chọn
    const getVariantDisplay = () => {
        if (!selectedVariant) return 'Chọn phân loại';
        if (selectedVariant.attributes && selectedVariant.attributes.length > 0) {
            return selectedVariant.attributes.map(a => `${a.name}: ${a.value}`).join(' | ');
        }
        return `Variant ${selectedVariant.variantId}`;
    };

    const getVariantPrice = () => {
        if (selectedVariant) {
            return selectedVariant.price;
        }
        return item.basePrice;
    };

    return (
        <div className="group bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col relative">
            {/* Nút xóa */}
            <button
                onClick={handleRemove}
                disabled={removing}
                className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-red-500 hover:text-white text-slate-600 rounded-lg transition z-10 shadow-sm"
                title="Xóa khỏi yêu thích"
            >
                <X size={16} />
            </button>

            <Link to={`/products/${item.productId}`} className="flex flex-col flex-1">
                {/* Ảnh */}
                <div className="aspect-square bg-slate-50 overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={item.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                            setImageError(true);
                            e.target.src = '/images/products/default.jpg';
                        }}
                    />
                </div>

                {/* Thông tin */}
                <div className="p-3 flex flex-col flex-1">
                    <h3 className="text-sm font-medium text-slate-800 line-clamp-2 min-h-[40px] group-hover:text-blue-600 transition-colors">
                        {item.name}
                    </h3>

                    {/* Giá hiển thị theo variant đã chọn */}
                    <div className="mt-2">
                        <span className="text-lg font-bold text-red-600">
                            {formatCurrency(getVariantPrice())}
                        </span>
                    </div>

                    {/* Chọn variant */}
                    {variants.length > 0 && (
                        <div className="mt-2 relative">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsVariantOpen(!isVariantOpen);
                                }}
                                disabled={productLoading}
                                className="w-full flex items-center justify-between px-3 py-1.5 text-xs border border-slate-200 rounded-lg hover:border-blue-500 transition bg-slate-50"
                            >
                                <span className="truncate text-slate-700">
                                    {productLoading ? 'Đang tải...' : getVariantDisplay()}
                                </span>
                                {isVariantOpen ? (
                                    <ChevronUp size={14} className="text-slate-400" />
                                ) : (
                                    <ChevronDown size={14} className="text-slate-400" />
                                )}
                            </button>

                            {/* Dropdown variants */}
                            {isVariantOpen && (
                                <div
                                    className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-40 overflow-y-auto"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {variants.map((variant) => {
                                        const isSelected = selectedVariant?.variantId === variant.variantId;
                                        const attrText = variant.attributes?.map(a => `${a.name}: ${a.value}`).join(' | ') || `Variant ${variant.variantId}`;

                                        return (
                                            <button
                                                key={variant.variantId}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleVariantSelect(variant);
                                                }}
                                                className={`w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-slate-50 transition ${isSelected ? 'bg-blue-50 text-blue-600' : 'text-slate-700'
                                                    }`}
                                            >
                                                <span className="truncate">{attrText}</span>
                                                <span className="font-medium ml-2">{formatCurrency(variant.price)}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Nút thêm vào giỏ hàng */}
                    <button
                        onClick={handleAddToCart}
                        disabled={isLoading || !selectedVariant}
                        className="mt-3 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ShoppingCart size={16} />
                        {isLoading ? 'Đang thêm...' : 'Thêm vào giỏ'}
                    </button>
                </div>
            </Link>
        </div>
    );
};

export default WishlistCard;