// src/pages/cart/Cart.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, CheckSquare, Square, RefreshCw } from "lucide-react";
import useCart from "@/features/cart/hooks/useCart";
import useCartStore from "@/store/cartStore";
import { useAuth } from "@/context/AuthContext";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCart from "@/components/cart/EmptyCart";
import LoginRequired from "@/components/cart/LoginRequired";

export default function Cart() {
    const navigate = useNavigate();
    const { data, loading, error, refetch } = useCart();
    const { cart } = useCartStore();
    const { isAuthenticated, loading: authLoading } = useAuth();

    const [selectedItems, setSelectedItems] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // Force refresh

    // Cập nhật trạng thái "Chọn tất cả"
    useEffect(() => {
        if (!cart?.items) return;

        if (cart.items.length > 0 && selectedItems.size === cart.items.length) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [selectedItems, cart?.items]);

    // Force refresh khi cần
    const handleRefresh = async () => {
        await refetch();
        setRefreshKey(prev => prev + 1);
    };

    // Đang kiểm tra auth
    if (authLoading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Nếu chưa đăng nhập
    if (!isAuthenticated) {
        return <LoginRequired />;
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <p className="text-red-500">Có lỗi xảy ra khi tải giỏ hàng</p>
                    <button
                        onClick={() => refetch()}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    const items = cart?.items || [];
    const totalItems = cart?.totalItems || 0;
    const totalAmount = cart?.totalAmount || 0;

    if (items.length === 0) {
        return <EmptyCart />;
    }

    // Xử lý chọn/bỏ chọn một item
    const handleSelectItem = (cartItemId) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(cartItemId)) {
            newSelected.delete(cartItemId);
        } else {
            newSelected.add(cartItemId);
        }
        setSelectedItems(newSelected);
    };

    // Xử lý chọn/bỏ chọn tất cả
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems(new Set());
        } else {
            const allIds = items.map(item => item.cartItemId);
            setSelectedItems(new Set(allIds));
        }
        setSelectAll(!selectAll);
    };

    // Tính tổng tiền các item được chọn
    const getSelectedTotal = () => {
        let total = 0;
        items.forEach(item => {
            if (selectedItems.has(item.cartItemId)) {
                total += item.unitPrice * item.quantity;
            }
        });
        return total;
    };

    // Tính số lượng item được chọn
    const getSelectedCount = () => {
        return selectedItems.size;
    };

    // Xử lý checkout
    const handleCheckout = () => {
        if (selectedItems.size === 0) {
            alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
            return;
        }

        const selectedIds = Array.from(selectedItems);
        localStorage.setItem('checkoutItems', JSON.stringify(selectedIds));

        navigate('/checkout', {
            state: {
                cartItemIds: selectedIds
            }
        });
    };

    const selectedTotal = getSelectedTotal();
    const selectedCount = getSelectedCount();

    return (
        <div className="container mx-auto px-4 py-6 max-w-5xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Link
                        to="/"
                        className="p-2 hover:bg-slate-100 rounded-full transition"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Giỏ hàng
                    </h1>
                    <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        {totalItems} sản phẩm
                    </span>
                </div>
            </div>

            {/* Cart Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-3">
                    {/* Select All */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
                        <button
                            onClick={handleSelectAll}
                            className="flex items-center gap-2 hover:text-blue-600 transition"
                        >
                            {selectAll ? (
                                <CheckSquare size={20} className="text-blue-600" />
                            ) : (
                                <Square size={20} className="text-slate-400" />
                            )}
                            <span className="text-sm font-medium">
                                {selectAll ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                            </span>
                        </button>
                        <span className="text-sm text-slate-500">
                            ({selectedCount}/{items.length} sản phẩm đã chọn)
                        </span>
                    </div>

                    {/* Cart Items */}
                    {items.map((item) => (
                        <CartItem
                            key={item.cartItemId}
                            item={item}
                            isSelected={selectedItems.has(item.cartItemId)}
                            onSelect={() => handleSelectItem(item.cartItemId)}
                            onUpdate={handleRefresh}
                            onDelete={handleRefresh}
                        />
                    ))}
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <CartSummary
                        totalItems={selectedCount}
                        totalAmount={selectedTotal}
                        onCheckout={handleCheckout}
                        isCheckoutDisabled={selectedCount === 0}
                    />
                </div>
            </div>
        </div>
    );
}