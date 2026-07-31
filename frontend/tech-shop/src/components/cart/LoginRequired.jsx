// src/components/cart/LoginRequired.jsx
import { Link } from "react-router-dom";
import { ShoppingCart, LogIn, ArrowRight } from "lucide-react";

export default function LoginRequired() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart size={40} className="text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Bạn chưa đăng nhập
                </h2>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                    Vui lòng đăng nhập để xem giỏ hàng của bạn và tiếp tục mua sắm
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/login"
                        state={{ from: "/cart" }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <LogIn size={18} />
                        Đăng nhập ngay
                    </Link>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                    >
                        Tiếp tục mua sắm
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
}