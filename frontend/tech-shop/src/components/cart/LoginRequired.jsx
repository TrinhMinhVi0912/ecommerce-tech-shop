// src/components/cart/LoginRequired.jsx
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, LogIn, ArrowRight } from 'lucide-react';

export default function LoginRequired({ type = 'cart' }) {
    const isWishlist = type === 'wishlist';

    const config = {
        cart: {
            icon: ShoppingCart,
            title: 'Bạn chưa đăng nhập',
            description: 'Vui lòng đăng nhập để xem giỏ hàng của bạn và tiếp tục mua sắm',
            buttonText: 'Đăng nhập ngay',
            buttonLink: '/login',
            secondaryText: 'Tiếp tục mua sắm'
        },
        wishlist: {
            icon: Heart,
            title: 'Bạn chưa đăng nhập',
            description: 'Vui lòng đăng nhập để xem danh sách yêu thích của bạn',
            buttonText: 'Đăng nhập ngay',
            buttonLink: '/login',
            secondaryText: 'Tiếp tục mua sắm'
        }
    };

    const currentConfig = config[type] || config.cart;
    const Icon = currentConfig.icon;

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon size={40} className="text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {currentConfig.title}
                </h2>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                    {currentConfig.description}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to={currentConfig.buttonLink}
                        state={{ from: window.location.pathname }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <LogIn size={18} />
                        {currentConfig.buttonText}
                    </Link>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                    >
                        {currentConfig.secondaryText}
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
}