// src/store/cartStore.js
import { create } from 'zustand';
import cartApi from '@/features/cart/api/cartApi';

const useCartStore = create((set, get) => ({
    cart: null,
    loading: false,
    error: null,
    totalItems: 0,
    checkoutItems: [],

    fetchCart: async () => {
        try {
            console.log('🔄 Fetching cart...');
            set({ loading: true, error: null });
            const response = await cartApi.getMyCart();
            console.log('📦 Cart response:', response.data);

            const cartData = response.data?.data || response.data;

            set({
                cart: cartData,
                totalItems: cartData?.totalItems || 0,
                loading: false,
            });

            console.log('✅ Cart updated:', cartData);
            return cartData;
        } catch (error) {
            console.error('❌ Fetch cart error:', error);
            set({ error, loading: false });
            throw error;
        }
    },

    // ... các actions khác giữ nguyên
}));

export default useCartStore;