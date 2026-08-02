// src/components/cart/CartItem.jsx
import { useState, useEffect } from "react";
import { Trash2, Plus, Minus, Square, CheckSquare, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import useUpdateCartItem from "@/features/cart/hooks/useUpdateCartItem";
import useDeleteCartItem from "@/features/cart/hooks/useDeleteCartItem";
import useCartStore from "@/store/cartStore";
import { getImageUrl } from "@/utils/imageUtils";
import { useToast } from "@/context/ToastContext";

export default function CartItem({
    item,
    isSelected = false,
    onSelect,
    onUpdate,
    onDelete
}) {
    const toast = useToast();
    const [quantity, setQuantity] = useState(item.quantity);
    const [originalQuantity, setOriginalQuantity] = useState(item.quantity);
    const [isChanged, setIsChanged] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const { updateCartItem, loading: updating } = useUpdateCartItem();
    const { deleteCartItem, loading: deleting } = useDeleteCartItem();
    const { fetchCart } = useCartStore();

    const thumbnailUrl = getImageUrl(item.thumbnail);

    // Reset state khi item thay đổi
    useEffect(() => {
        setQuantity(item.quantity);
        setOriginalQuantity(item.quantity);
        setIsChanged(false);
    }, [item.quantity]);

    useEffect(() => {
        setIsChanged(quantity !== originalQuantity);
    }, [quantity, originalQuantity]);

    // Tăng số lượng
    const handleIncrease = () => {
        setQuantity(prev => prev + 1);
    };

    // Giảm số lượng
    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleQuantityInput = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 1) {
            setQuantity(value);
        } else if (e.target.value === '') {
            setQuantity('');
        }
    };

    const handleBlur = () => {
        if (quantity === '' || quantity < 1) {
            setQuantity(1);
        }
    };

    const handleUpdateQuantity = async () => {
        if (quantity === originalQuantity) return;

        if (quantity < 1) {
            toast.warning('Số lượng phải lớn hơn 0');
            setQuantity(1);
            return;
        }

        try {
            setIsUpdating(true);
            console.log('🔄 Updating quantity:', {
                cartItemId: item.cartItemId,
                oldQuantity: originalQuantity,
                newQuantity: quantity
            });

            await updateCartItem(item.cartItemId, { quantity: quantity });
            setOriginalQuantity(quantity);
            setIsChanged(false);
            await fetchCart();
            if (onUpdate) onUpdate();
            console.log('✅ Update quantity success');
        } catch (error) {
            console.error('❌ Update quantity error:', error);
            setQuantity(originalQuantity);
            const errorMessage = error.response?.data?.message || 'Không thể cập nhật số lượng. Vui lòng thử lại.';
            toast.error(errorMessage);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCancelChange = () => {
        setQuantity(originalQuantity);
        setIsChanged(false);
    };

    // ✅ Sửa lại hàm xóa
    const handleDelete = async () => {
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) {
            return;
        }

        try {
            setIsDeleting(true);
            console.log('🗑️ Deleting cart item:', item.cartItemId);

            // Gọi API xóa
            const response = await deleteCartItem(item.cartItemId);
            console.log('✅ Delete response:', response);

            // Refresh giỏ hàng
            await fetchCart();

            // Gọi callback để cập nhật UI
            if (onDelete) {
                onDelete();
            }

            console.log('✅ Delete success');
        } catch (error) {
            console.error('❌ Delete item error:', error);
            console.error('Error details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });

            const errorMessage = error.response?.data?.message || 'Không thể xóa sản phẩm. Vui lòng thử lại.';
            toast.error(errorMessage);
        } finally {
            setIsDeleting(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const isLoading = isUpdating || updating || isDeleting || deleting;

    return (
        <div className={`bg-white rounded-xl border p-4 hover:shadow-sm transition ${isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200'}`}>
            <div className="flex gap-4">
                {/* Checkbox */}
                <button
                    onClick={onSelect}
                    className="flex-shrink-0 mt-1"
                    disabled={isLoading}
                >
                    {isSelected ? (
                        <CheckSquare size={20} className="text-blue-600" />
                    ) : (
                        <Square size={20} className="text-slate-400" />
                    )}
                </button>

                {/* Image */}
                <Link to={`/products/${item.productId}`} className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-50 border border-slate-200">
                        <img
                            src={thumbnailUrl || '/images/products/default.jpg'}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = '/images/products/default.jpg';
                            }}
                        />
                    </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.productId}`}>
                        <h3 className="font-medium text-slate-900 hover:text-blue-600 transition line-clamp-2">
                            {item.productName}
                        </h3>
                    </Link>

                    {item.variantAttributes && item.variantAttributes.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                            {item.variantAttributes.map((attr, index) => (
                                <span
                                    key={index}
                                    className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded"
                                >
                                    {attr.attributeName}: {attr.value}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                            <button
                                onClick={handleDecrease}
                                disabled={quantity <= 1 || isLoading}
                                className="px-2 py-1 hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Minus size={14} />
                            </button>

                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={handleQuantityInput}
                                onBlur={handleBlur}
                                disabled={isLoading}
                                className="w-12 text-center text-sm font-medium border-0 focus:outline-none focus:ring-0"
                            />

                            <button
                                onClick={handleIncrease}
                                disabled={isLoading}
                                className="px-2 py-1 hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus size={14} />
                            </button>
                        </div>

                        {isChanged && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleUpdateQuantity}
                                    disabled={isLoading}
                                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs flex items-center gap-1 disabled:opacity-50"
                                >
                                    <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
                                    {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                                </button>
                                <button
                                    onClick={handleCancelChange}
                                    disabled={isLoading}
                                    className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition text-xs"
                                >
                                    Hủy
                                </button>
                            </div>
                        )}

                        <button
                            onClick={handleDelete}
                            disabled={isDeleting || deleting}
                            className="p-1.5 text-slate-400 hover:text-red-600 transition disabled:opacity-50 ml-auto"
                        >
                            <Trash2 size={18} />
                            {isDeleting && <span className="text-xs ml-1">Đang xóa...</span>}
                        </button>
                    </div>
                </div>

                <div className="text-right flex-shrink-0">
                    <div className="text-sm text-slate-500">Đơn giá</div>
                    <div className="font-medium text-slate-900">
                        {formatPrice(item.unitPrice)}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                        Tạm tính: {formatPrice(item.unitPrice * quantity)}
                    </div>
                </div>
            </div>
        </div>
    );
}