// src/features/product/hooks/useCompare.js
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import useCompareStore from '@/store/compareStore';
import productApi from '@/features/product/api/productApi';

export function useCompare() {
    const store = useCompareStore();
    const [leftProductDetail, setLeftProductDetail] = useState(null);
    const [rightProductDetail, setRightProductDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isFetchingRef = useRef(false);

    const { leftProduct, rightProduct, leftVariant, rightVariant } = store;

    // Lấy chi tiết sản phẩm
    const getProductDetail = useCallback(async (productId) => {
        try {
            const response = await productApi.getById(productId);
            return response.data?.data || response.data;
        } catch (error) {
            console.error('Get product detail error:', error);
            return null;
        }
    }, []);

    // Tìm kiếm sản phẩm
    const searchProducts = useCallback(async (query, categoryId = null) => {
        if (!query || query.length < 2) {
            store.setSearchResults([]);
            return;
        }

        store.setIsSearching(true);
        try {
            const params = {
                search: query,
                pageNum: 1,
                pageSize: 100,
                sortBy: 'productId',
                sortDir: 'DESC'
            };

            if (categoryId) {
                params.categoryId = categoryId;
            }

            console.log('🔍 Searching products:', params);

            const response = await productApi.getAll(params);
            const products = response.data?.data?.items || [];

            console.log('🔍 Search results:', products.length);

            const filtered = products.filter(p => !store.isProductSelected(p.productId));
            store.setSearchResults(filtered);
        } catch (error) {
            console.error('Search products error:', error);
            store.setSearchResults([]);
        } finally {
            store.setIsSearching(false);
        }
    }, [store]);

    // ✅ Lấy category cha để so sánh
    const getCategoryParentId = useCallback((product) => {
        if (!product || !product.categoryResponse) return null;

        const category = product.categoryResponse;
        // Nếu có parentId thì lấy parentId, ngược lại lấy categoryId
        return category.parentId || category.categoryId;
    }, []);

    // Thêm sản phẩm vào so sánh
    const addProductToCompare = useCallback(async (productId, variantId = null) => {
        if (store.isProductSelected(productId)) {
            console.log('Product already in compare');
            return false;
        }

        setLoading(true);
        setError(null);

        try {
            const productDetail = await getProductDetail(productId);
            if (!productDetail) {
                setError('Không thể lấy thông tin sản phẩm');
                setLoading(false);
                return false;
            }

            let variant = null;
            if (variantId && productDetail.variants) {
                variant = productDetail.variants.find(v => v.variantId === variantId);
            }

            if (!store.leftProduct) {
                store.setLeftProduct(productDetail, variant);
                setLeftProductDetail(productDetail);
                setLoading(false);
                return true;
            }

            if (!store.rightProduct) {
                // ✅ Lấy category cha của sản phẩm đã chọn
                const leftCategoryParent = getCategoryParentId(store.leftProduct);
                // ✅ Lấy category cha của sản phẩm mới
                const rightCategoryParent = getCategoryParentId(productDetail);

                console.log('🔍 Comparing categories - Left parent:', leftCategoryParent, 'Right parent:', rightCategoryParent);

                // ✅ So sánh category cha (parentId hoặc categoryId gốc)
                const isSameCategory = leftCategoryParent === rightCategoryParent;

                if (!isSameCategory) {
                    alert('Sản phẩm phải cùng danh mục để so sánh!');
                    setLoading(false);
                    return false;
                }

                store.setRightProduct(productDetail, variant);
                setRightProductDetail(productDetail);
                setLoading(false);
                return true;
            }

            alert('Đã có đủ 2 sản phẩm để so sánh!');
            setLoading(false);
            return false;

        } catch (error) {
            console.error('Add product to compare error:', error);
            setError('Không thể thêm sản phẩm vào so sánh');
            setLoading(false);
            return false;
        }
    }, [store, getProductDetail, getCategoryParentId]);

    // Cập nhật left product detail khi leftProduct thay đổi
    useEffect(() => {
        const fetchDetails = async () => {
            if (!store.leftProduct) {
                setLeftProductDetail(null);
                return;
            }

            if (store.leftProduct.variants && store.leftProduct.variants.length > 0) {
                setLeftProductDetail(store.leftProduct);
                return;
            }

            if (leftProductDetail?.productId === store.leftProduct.productId) {
                return;
            }

            if (isFetchingRef.current) return;

            isFetchingRef.current = true;
            try {
                const detail = await getProductDetail(store.leftProduct.productId);
                if (detail) {
                    setLeftProductDetail(detail);
                    store.setLeftProduct(detail, store.leftVariant);
                }
            } catch (error) {
                console.error('Fetch left product detail error:', error);
            } finally {
                isFetchingRef.current = false;
            }
        };
        fetchDetails();
    }, [store.leftProduct?.productId]);

    // Cập nhật right product detail khi rightProduct thay đổi
    useEffect(() => {
        const fetchDetails = async () => {
            if (!store.rightProduct) {
                setRightProductDetail(null);
                return;
            }

            if (store.rightProduct.variants && store.rightProduct.variants.length > 0) {
                setRightProductDetail(store.rightProduct);
                return;
            }

            if (rightProductDetail?.productId === store.rightProduct.productId) {
                return;
            }

            if (isFetchingRef.current) return;

            isFetchingRef.current = true;
            try {
                const detail = await getProductDetail(store.rightProduct.productId);
                if (detail) {
                    setRightProductDetail(detail);
                    store.setRightProduct(detail, store.rightVariant);
                }
            } catch (error) {
                console.error('Fetch right product detail error:', error);
            } finally {
                isFetchingRef.current = false;
            }
        };
        fetchDetails();
    }, [store.rightProduct?.productId]);

    // Xóa sản phẩm
    const removeLeftProduct = useCallback(() => {
        store.removeLeftProduct();
        setLeftProductDetail(null);
    }, [store]);

    const removeRightProduct = useCallback(() => {
        store.removeRightProduct();
        setRightProductDetail(null);
    }, [store]);

    // Reset tất cả
    const resetCompare = useCallback(() => {
        store.resetCompare();
        setLeftProductDetail(null);
        setRightProductDetail(null);
        setError(null);
        isFetchingRef.current = false;
    }, [store]);

    // Lấy dữ liệu so sánh
    const getCompareData = useCallback(() => {
        if (!leftProductDetail && !rightProductDetail) return null;

        return {
            products: [leftProductDetail, rightProductDetail].filter(Boolean)
        };
    }, [leftProductDetail, rightProductDetail]);

    // Memoize return value
    const result = useMemo(() => ({
        // Store states
        isOpen: store.isOpen,
        leftProduct: store.leftProduct,
        rightProduct: store.rightProduct,
        leftVariant: store.leftVariant,
        rightVariant: store.rightVariant,
        searchQuery: store.searchQuery,
        searchResults: store.searchResults,
        isSearching: store.isSearching,

        // Store actions
        openPanel: store.openPanel,
        closePanel: store.closePanel,
        togglePanel: store.togglePanel,
        setSearchQuery: store.setSearchQuery,
        setSearchResults: store.setSearchResults,
        setIsSearching: store.setIsSearching,
        isFull: store.isFull,
        isProductSelected: store.isProductSelected,
        getCompareProducts: store.getCompareProducts,
        hasProducts: store.hasProducts,
        getProductCount: store.getProductCount,

        // Custom hooks
        searchProducts,
        getProductDetail,
        addProductToCompare,
        removeLeftProduct,
        removeRightProduct,
        resetCompare,

        // Compare data
        compareData: getCompareData(),
        loading,
        error
    }), [
        store.isOpen,
        store.leftProduct,
        store.rightProduct,
        store.leftVariant,
        store.rightVariant,
        store.searchQuery,
        store.searchResults,
        store.isSearching,
        leftProductDetail,
        rightProductDetail,
        loading,
        error,
        searchProducts,
        getProductDetail,
        addProductToCompare,
        removeLeftProduct,
        removeRightProduct,
        resetCompare,
        getCompareData
    ]);

    return result;
}