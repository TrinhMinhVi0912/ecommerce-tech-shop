import { useEffect, useState } from "react";
import productApi from "../api/productApi";

export default function useProducts(filters = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                const params = {
                    pageNum: filters.pageNum || 1,
                    pageSize: filters.pageSize || 12,
                    sortBy: filters.sortBy || "productId",
                    sortDir: filters.sortDir || "DESC",
                };

                if (filters.search) params.search = filters.search;
                if (filters.categoryId) params.categoryId = filters.categoryId;
                if (filters.brandId) params.brandId = filters.brandId;
                if (filters.minPrice) params.minPrice = filters.minPrice;
                if (filters.maxPrice) params.maxPrice = filters.maxPrice;

                const response = await productApi.getAll(params);

                const responseData = response.data?.data || response.data;

                setData({
                    items: responseData?.items || [],
                    totalPages: responseData?.totalPages || 1,
                    totalElements: responseData?.totalElements || 0,
                    pageNum: responseData?.pageNum || 1,
                    pageSize: responseData?.pageSize || 12,
                });
            } catch (err) {
                setError(err);
                setData({
                    items: [],
                    totalPages: 1,
                    totalElements: 0,
                    pageNum: 1,
                    pageSize: 12,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [
        filters.pageNum,
        filters.pageSize,
        filters.sortBy,
        filters.sortDir,
        filters.search,
        filters.categoryId,
        filters.brandId,
        filters.minPrice,
        filters.maxPrice,
    ]);

    return {
        data,
        loading,
        error,
    };
}