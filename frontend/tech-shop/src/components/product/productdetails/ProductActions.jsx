import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import useAddToCart from "@/features/cart/hooks/useAddCartItem";
import useAddToWishlist from "@/features/wishlist/hooks/useAddWishlist";
import useRemoveFromWishlist from "@/features/wishlist/hooks/useRemoveWishlist";
import useWishlist from "@/features/wishlist/hooks/useWishlist";
import useCartStore from "@/store/cartStore";
import { useAuth } from "@/context/AuthContext";

export default function ProductActions({ productId, basePrice, variants = [] }) {
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(variants[0] || null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const { addToCart, loading: cartLoading } = useAddToCart();
    const { addToWishlist, loading: addWishlistLoading } = useAddToWishlist();
    const { removeFromWishlist, loading: removeWishlistLoading } = useRemoveFromWishlist();
    const { isInWishlist, refetch: refetchWishlist } = useWishlist();
    const { fetchCart } = useCartStore();
    const { isAuthenticated } = useAuth();

    const handleAddToCart = async () => {
        // Kiểm tra đăng nhập
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/products/${productId}` } });
            return;
        }

        const variantId = selectedVariant?.variantId || variants[0]?.variantId;

        if (!variantId) {
            console.error('No variant selected');
            alert('Vui lòng chọn phân loại sản phẩm');
            return;
        }

        try {
            setIsAddingToCart(true);

            // Gọi API thêm vào giỏ hàng
            await addToCart({
                variantId: variantId,
                quantity: quantity
            });

            // Refresh lại giỏ hàng để cập nhật số lượng trên Navbar
            await fetchCart();

            // Hiển thị thông báo thành công
            alert('Đã thêm sản phẩm vào giỏ hàng!');

        } catch (error) {
            console.error("Add to cart error:", error);
            const errorMessage = error.response?.data?.message || 'Không thể thêm vào giỏ hàng. Vui lòng thử lại.';
            alert(errorMessage);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        // Kiểm tra đăng nhập
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/products/${productId}` } });
            return;
        }

        const variantId = selectedVariant?.variantId || variants[0]?.variantId;

        if (!variantId) {
            alert('Vui lòng chọn phân loại sản phẩm');
            return;
        }

        try {
            setIsAddingToCart(true);

            // Thêm vào giỏ hàng
            await addToCart({
                variantId: variantId,
                quantity: quantity
            });

            // Refresh giỏ hàng
            await fetchCart();

            // Chuyển đến trang thanh toán
            navigate('/checkout');

        } catch (error) {
            console.error("Buy now error:", error);
            const errorMessage = error.response?.data?.message || 'Không thể thêm vào giỏ hàng. Vui lòng thử lại.';
            alert(errorMessage);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleToggleWishlist = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/products/${productId}` } });
            return;
        }

        try {
            if (isInWishlist(productId)) {
                await removeFromWishlist(productId);
            } else {
                await addToWishlist(productId);
            }
            // Refresh wishlist
            await refetchWishlist();
        } catch (error) {
            console.error("Toggle wishlist error:", error);
            alert('Không thể thực hiện thao tác. Vui lòng thử lại.');
        }
    };

    const price = selectedVariant?.price || basePrice;
    const stock = selectedVariant?.stock || 0;
    const wishlistLoading = addWishlistLoading || removeWishlistLoading;
    const isLoading = isAddingToCart || cartLoading;

    return (
        <div className="space-y-4">
            {/* Quantity */}
            <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-slate-700">Số lượng:</label>
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                    <button
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        disabled={isLoading}
                        className="px-3 py-2 hover:bg-slate-50 text-slate-600 disabled:opacity-50"
                    >
                        -
                    </button>
                    <span className="w-12 text-center text-sm font-medium">
                        {quantity}
                    </span>
                    <button
                        onClick={() => setQuantity(prev => Math.min(stock || 99, prev + 1))}
                        disabled={isLoading || (stock > 0 && quantity >= stock)}
                        className="px-3 py-2 hover:bg-slate-50 text-slate-600 disabled:opacity-50"
                    >
                        +
                    </button>
                </div>
                <span className="text-sm text-slate-500">
                    {stock > 0 ? `${stock} sản phẩm có sẵn` : 'Hết hàng'}
                </span>
            </div>

            {/* Price */}
            <div className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={handleAddToCart}
                    disabled={isLoading || stock === 0}
                    className="flex-1 min-w-[120px] py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ShoppingCart size={18} />
                    {isLoading ? 'Đang xử lý...' : 'Thêm vào giỏ'}
                </button>

                <button
                    onClick={handleBuyNow}
                    disabled={isLoading || stock === 0}
                    className="flex-1 min-w-[120px] py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Đang xử lý...' : 'Mua ngay'}
                </button>

                <button
                    onClick={handleToggleWishlist}
                    disabled={wishlistLoading}
                    className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition disabled:opacity-50"
                >
                    <Heart
                        size={20}
                        className={isInWishlist(productId) ? 'fill-red-500 text-red-500' : 'text-slate-600'}
                    />
                </button>
            </div>
        </div>
    );
}