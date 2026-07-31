// src/store/wishlistStore.js
import { create } from 'zustand';
import wishlistApi from '@/features/wishlist/api/wishlistApi';

const useWishlistStore = create((set, get) => ({
    wishlistCount: 0,
    loading: false,

    // Lấy số lượng wishlist
    fetchWishlistCount: async () => {
        try {
            set({ loading: true });
            const response = await wishlistApi.getMyWishlist({
                pageNum: 1,
                pageSize: 1,
                sortDir: 'asc'
            });

            const wishlistData = response.data?.data || response.data;
            const count = wishlistData?.totalElements || 0;

            set({ wishlistCount: count, loading: false });
        } catch (error) {
            console.error('Fetch wishlist count error:', error);
            set({ loading: false });
        }
    },

    // Cập nhật số lượng
    setWishlistCount: (count) => {
        set({ wishlistCount: count });
    },

    // Reset
    resetWishlistCount: () => {
        set({ wishlistCount: 0 });
    }
}));

export default useWishlistStore;