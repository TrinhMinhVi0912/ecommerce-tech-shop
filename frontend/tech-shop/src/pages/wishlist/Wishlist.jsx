// src/pages/wishlist/Wishlist.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import useWishlist from '@/features/wishlist/hooks/useWishlist';
import { useAuth } from '@/context/AuthContext';
import WishlistCard from '@/components/wishlist/WishlistCard';
import EmptyWishlist from '@/components/wishlist/EmptyWishlist';
import LoginRequired from '@/components/cart/LoginRequired';

export default function Wishlist() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const { data, loading, refetch } = useWishlist({
        pageNum: 1,
        pageSize: 20,
        sortDir: 'desc'
    });

    const wishlistData = data?.data || data;
    const items = wishlistData?.items || [];
    const totalElements = wishlistData?.totalElements || 0;
    const totalPages = wishlistData?.totalPages || 0;

    const handleRefresh = async () => {
        await refetch();
    };

    if (authLoading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
                                <div className="aspect-square bg-slate-200 rounded-lg"></div>
                                <div className="mt-3 space-y-2">
                                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                                    <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // ✅ Truyền type='wishlist' để hiển thị thông báo phù hợp
        return <LoginRequired type="wishlist" />;
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
                                <div className="aspect-square bg-slate-200 rounded-lg"></div>
                                <div className="mt-3 space-y-2">
                                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                                    <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return <EmptyWishlist />;
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-6xl">
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
                        Danh sách yêu thích
                    </h1>
                    <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        {totalElements} sản phẩm
                    </span>
                </div>
                <button
                    onClick={handleRefresh}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    Cập nhật
                </button>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {items.map((item) => (
                    <WishlistCard
                        key={item.productId}
                        item={item}
                        onRemove={handleRefresh}
                        onCartAdd={handleRefresh}
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    {/* Bạn có thể thêm pagination ở đây nếu cần */}
                </div>
            )}
        </div>
    );
}