// src/components/cart/CartSummary.jsx
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export default function CartSummary({
    totalItems,
    totalAmount,
    onCheckout,
    isCheckoutDisabled = false
}) {
    const navigate = useNavigate();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Shipping fee (có thể thay đổi theo logic của bạn)
    const shippingFee = totalAmount > 0 ? (totalAmount >= 500000 ? 0 : 30000) : 0;
    const finalTotal = totalAmount + shippingFee;

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-20">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
                Tóm tắt đơn hàng
            </h2>

            <div className="space-y-3">
                {/* Items count */}
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Sản phẩm đã chọn ({totalItems})</span>
                    <span className="font-medium">{formatPrice(totalAmount)}</span>
                </div>

                {/* Shipping fee */}
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Phí vận chuyển</span>
                    <span className="font-medium">
                        {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                    </span>
                </div>

                {/* Total */}
                <div className="border-t border-slate-200 pt-3">
                    <div className="flex justify-between text-base font-bold">
                        <span>Tổng cộng</span>
                        <span className="text-blue-600">{formatPrice(finalTotal)}</span>
                    </div>
                    {shippingFee > 0 && (
                        <p className="text-xs text-slate-500 mt-1">
                            * Miễn phí vận chuyển cho đơn hàng từ 500.000đ
                        </p>
                    )}
                </div>

                {/* Checkout button */}
                <button
                    onClick={onCheckout}
                    disabled={isCheckoutDisabled}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-3"
                >
                    <ShoppingBag size={18} />
                    {isCheckoutDisabled ? 'Chọn sản phẩm để thanh toán' : 'Tiến hành thanh toán'}
                </button>

                {/* Continue shopping */}
                <button
                    onClick={() => navigate("/products")}
                    className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    Tiếp tục mua sắm →
                </button>
            </div>
        </div>
    );
}