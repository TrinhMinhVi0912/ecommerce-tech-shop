// src/components/product/productdetails/ProductActions.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import useAddToCart from "@/features/cart/hooks/useAddCartItem";
import useCartStore from "@/store/cartStore";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function ProductActions({
    productId,
    basePrice,
    variants = [],
    selectedVariant = null
}) {
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const { addToCart, loading: cartLoading } = useAddToCart();
    const { fetchCart } = useCartStore();
    const { isAuthenticated } = useAuth();
    const { success, error } = useToast();

    // ✅ Lấy variant hiện tại
    const currentVariant = selectedVariant || variants[0] || null;
    const stock = currentVariant?.stock ?? 0;
    const isOutOfStock = stock === 0;

    // Reset quantity khi variant thay đổi
    useEffect(() => {
        setQuantity(1);
    }, [selectedVariant]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/products/${productId}` } });
            return;
        }

        if (isOutOfStock) {
            error('Sản phẩm đã hết hàng!');
            return;
        }

        const variantId = currentVariant?.variantId || variants[0]?.variantId;

        if (!variantId) {
            error('Vui lòng chọn phân loại sản phẩm');
            return;
        }

        try {
            setIsAddingToCart(true);

            await addToCart({
                variantId: variantId,
                quantity: quantity
            });

            await fetchCart();

            success('Đã thêm sản phẩm vào giỏ hàng!');

        } catch (err) {
            console.error("Add to cart error:", err);
            error(err.response?.data?.message || 'Không thể thêm vào giỏ hàng. Vui lòng thử lại.');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/products/${productId}` } });
            return;
        }

        if (isOutOfStock) {
            error('Sản phẩm đã hết hàng!');
            return;
        }

        const variantId = currentVariant?.variantId || variants[0]?.variantId;

        if (!variantId) {
            error('Vui lòng chọn phân loại sản phẩm');
            return;
        }

        try {
            setIsAddingToCart(true);

            await addToCart({
                variantId: variantId,
                quantity: quantity
            });

            await fetchCart();

            navigate('/checkout');

        } catch (err) {
            console.error("Buy now error:", err);
            error(err.response?.data?.message || 'Không thể thêm vào giỏ hàng. Vui lòng thử lại.');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const price = currentVariant?.price || basePrice;
    const isLoading = isAddingToCart || cartLoading;

    return (
        <div className="space-y-4">
            {/* Stock Status */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Tình trạng:</span>
                    {isOutOfStock ? (
                        <span className="text-sm font-medium text-red-600">Hết hàng</span>
                    ) : (
                        <span className="text-sm font-medium text-green-600">
                            Còn {stock} sản phẩm
                        </span>
                    )}
                </div>
            </div>

            {/* Quantity */}
            {!isOutOfStock && (
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700">Số lượng:</label>
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                            disabled={isLoading}
                            className="px-3 py-2 hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            -
                        </button>
                        <span className="w-12 text-center text-sm font-medium">
                            {quantity}
                        </span>
                        <button
                            onClick={() => setQuantity(prev => Math.min(stock, prev + 1))}
                            disabled={isLoading || quantity >= stock}
                            className="px-3 py-2 hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            +
                        </button>
                    </div>
                </div>
            )}

            {/* Price */}
            <div className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={handleAddToCart}
                    disabled={isLoading || isOutOfStock}
                    className="flex-1 min-w-[120px] py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ShoppingCart size={18} />
                    {isOutOfStock ? 'Hết hàng' : isLoading ? 'Đang xử lý...' : 'Thêm vào giỏ'}
                </button>

                <button
                    onClick={handleBuyNow}
                    disabled={isLoading || isOutOfStock}
                    className="flex-1 min-w-[120px] py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isOutOfStock ? 'Hết hàng' : isLoading ? 'Đang xử lý...' : 'Mua ngay'}
                </button>
            </div>
        </div>
    );
}