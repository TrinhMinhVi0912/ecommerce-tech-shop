import { useEffect, useState, useCallback } from "react";
import wishlistApi from "../api/wishlistApi";

export default function useWishlist(params = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [wishlistIds, setWishlistIds] = useState(new Set());

    // Lấy danh sách wishlist
    const fetchWishlist = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const requestParams = {
                pageNum: params.pageNum || 1,
                pageSize: params.pageSize || 10,
                sortDir: params.sortDir || 'asc'
            };

            const response = await wishlistApi.getMyWishlist(requestParams);
            const wishlistData = response.data?.data || response.data;

            setData(wishlistData);

            // Lưu danh sách productId đã có trong wishlist
            if (wishlistData?.items) {
                const ids = new Set(wishlistData.items.map(item => item.productId));
                setWishlistIds(ids);
            }
        } catch (err) {
            console.error("Wishlist API Error:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [params.pageNum, params.pageSize, params.sortDir]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    // Thêm vào wishlist
    const addToWishlist = useCallback(async (productId) => {
        try {
            setError(null);
            const response = await wishlistApi.addToWishlist(productId);
            // Cập nhật state
            setWishlistIds(prev => new Set([...prev, productId]));
            return response.data;
        } catch (err) {
            console.error("Add to wishlist error:", err);
            setError(err);
            throw err;
        }
    }, []);

    // Xóa khỏi wishlist
    const removeFromWishlist = useCallback(async (productId) => {
        try {
            setError(null);
            const response = await wishlistApi.removeFromWishlist(productId);
            // Cập nhật state
            setWishlistIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
            return response.data;
        } catch (err) {
            console.error("Remove from wishlist error:", err);
            setError(err);
            throw err;
        }
    }, []);

    // Kiểm tra sản phẩm có trong wishlist không
    const isInWishlist = useCallback((productId) => {
        return wishlistIds.has(productId);
    }, [wishlistIds]);

    // Refresh danh sách
    const refetch = useCallback(() => {
        return fetchWishlist();
    }, [fetchWishlist]);

    return {
        data,
        loading,
        error,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        refetch,
        wishlistIds
    };
}