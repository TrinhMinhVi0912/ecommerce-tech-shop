// src/components/wishlist/EmptyWishlist.jsx
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';

export default function EmptyWishlist() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart size={40} className="text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Danh sách yêu thích trống
                </h2>
                <p className="text-slate-500 mb-6">
                    Bạn chưa có sản phẩm nào trong danh sách yêu thích
                </p>
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Mua sắm ngay
                    <ArrowRight size={18} />
                </Link>
            </div>
        </div>
    );
}