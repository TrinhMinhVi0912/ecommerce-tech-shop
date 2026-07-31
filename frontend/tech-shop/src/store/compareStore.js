// src/store/compareStore.js
import { create } from 'zustand';

const useCompareStore = create((set, get) => ({
    isOpen: false,
    leftProduct: null,
    rightProduct: null,
    leftVariant: null,
    rightVariant: null,
    searchQuery: '',
    searchResults: [],
    isSearching: false,

    // Mở/đóng panel
    togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
    openPanel: () => set({ isOpen: true }),
    closePanel: () => set({ isOpen: false }),

    // Chọn sản phẩm bên trái
    setLeftProduct: (product, variant = null) => set({
        leftProduct: product,
        leftVariant: variant
    }),

    // Chọn sản phẩm bên phải
    setRightProduct: (product, variant = null) => set({
        rightProduct: product,
        rightVariant: variant
    }),

    // Xóa sản phẩm
    removeLeftProduct: () => set({ leftProduct: null, leftVariant: null }),
    removeRightProduct: () => set({ rightProduct: null, rightVariant: null }),

    // Reset tất cả
    resetCompare: () => set({
        leftProduct: null,
        rightProduct: null,
        leftVariant: null,
        rightVariant: null
    }),

    // Search
    setSearchQuery: (query) => set({ searchQuery: query }),
    setSearchResults: (results) => set({ searchResults: results }),
    setIsSearching: (isSearching) => set({ isSearching }),

    // ✅ Kiểm tra có sản phẩm trong so sánh không
    hasProducts: () => {
        const state = get();
        return state.leftProduct !== null || state.rightProduct !== null;
    },

    // Kiểm tra xem đã đủ 2 sản phẩm chưa
    isFull: () => {
        const state = get();
        return state.leftProduct !== null && state.rightProduct !== null;
    },

    // Kiểm tra sản phẩm đã được chọn chưa
    isProductSelected: (productId) => {
        const state = get();
        return state.leftProduct?.productId === productId ||
            state.rightProduct?.productId === productId;
    },

    // Lấy sản phẩm đang so sánh
    getCompareProducts: () => {
        const state = get();
        return {
            left: state.leftProduct,
            right: state.rightProduct,
            leftVariant: state.leftVariant,
            rightVariant: state.rightVariant
        };
    },

    // ✅ Lấy số lượng sản phẩm đang so sánh
    getProductCount: () => {
        const state = get();
        let count = 0;
        if (state.leftProduct) count++;
        if (state.rightProduct) count++;
        return count;
    }
}));

export default useCompareStore;