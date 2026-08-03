// src/components/checkout/CheckoutPayment.jsx
import React from 'react';
import { CreditCard, Wallet, Banknote, ArrowLeft } from 'lucide-react';

const CheckoutPayment = ({
    paymentMethod,
    setPaymentMethod,
    note,
    setNote,
    couponCode,
    setCouponCode,
    onBack,
    onSubmit,
    loading
}) => {
    const paymentMethods = [
        { id: 'COD', label: 'Thanh toán khi nhận hàng (COD)', icon: Banknote, description: 'Thanh toán bằng tiền mặt khi nhận hàng' },
        { id: 'VNPAY', label: 'Thanh toán qua VNPay', icon: CreditCard, description: 'Thanh toán trực tuyến qua VNPay' },
    ];

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-blue-600" />
                Phương thức thanh toán
            </h2>

            {/* Payment Methods */}
            <div className="space-y-3">
                {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const isSelected = paymentMethod === method.id;
                    return (
                        <button
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition ${isSelected
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>
                                    <Icon size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-slate-900">{method.label}</div>
                                    <div className="text-sm text-slate-500">{method.description}</div>
                                </div>
                                {isSelected && (
                                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Coupon Code */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Mã giảm giá (nếu có)
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Nhập mã giảm giá..."
                        className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                        Áp dụng
                    </button>
                </div>
            </div>

            {/* Note */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ghi chú (tùy chọn)
                </label>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ghi chú cho đơn hàng..."
                    rows={2}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-4">
                <button
                    onClick={onBack}
                    className="flex-1 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition flex items-center justify-center gap-2"
                >
                    <ArrowLeft size={18} />
                    Quay lại
                </button>
                <button
                    onClick={onSubmit}
                    disabled={loading}
                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? 'Đang xử lý...' : 'Đặt hàng'}
                </button>
            </div>
        </div>
    );
};

export default CheckoutPayment;