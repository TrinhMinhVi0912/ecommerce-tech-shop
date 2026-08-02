// src/pages/product/ProductList.jsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useProducts from "@/features/product/hooks/useProducts";
import useCategories from "@/features/category/hooks/useCategories";
import useBrands from "@/features/brand/hooks/useBrands";

import ProductToolbar from "@/components/product/ProductToolbar";
import ProductFilter from "@/components/product/ProductFilter";
import ProductGrid from "@/components/product/ProductGrid";
import ProductPagination from "@/components/product/ProductPagination";

export default function ProductList() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // ✅ Lấy tất cả params từ URL
    const categoryIdFromUrl = searchParams.get("categoryId");
    const brandIdFromUrl = searchParams.get("brandId");
    const searchFromUrl = searchParams.get("search") || "";

    // ✅ Khởi tạo filters với giá trị từ URL
    const [filters, setFilters] = useState({
        pageNum: 1,
        pageSize: 12,
        sortBy: "productId",
        sortDir: "DESC",
        search: searchFromUrl,
        categoryId: categoryIdFromUrl ? Number(categoryIdFromUrl) : null,
        brandId: brandIdFromUrl ? Number(brandIdFromUrl) : null,
        minPrice: "",
        maxPrice: "",
    });

    // ✅ Cập nhật khi URL thay đổi
    useEffect(() => {
        const newCategoryId = categoryIdFromUrl ? Number(categoryIdFromUrl) : null;
        const newBrandId = brandIdFromUrl ? Number(brandIdFromUrl) : null;
        const newSearch = searchFromUrl || "";

        const hasChanges =
            filters.categoryId !== newCategoryId ||
            filters.brandId !== newBrandId ||
            filters.search !== newSearch;

        if (hasChanges) {
            setFilters(prev => ({
                ...prev,
                pageNum: 1,
                categoryId: newCategoryId,
                brandId: newBrandId,
                search: newSearch,
            }));
        }
    }, [categoryIdFromUrl, brandIdFromUrl, searchFromUrl]);

    // ✅ Categories
    const { data: categoryData } = useCategories();
    const categories = categoryData?.data?.items ?? [];

    // ✅ Brands
    const { data: brandData } = useBrands();
    const brands = brandData?.data?.items ?? [];

    // ✅ Products
    const { data: productData, loading: productLoading } = useProducts(filters);

    const products = productData?.items ?? [];
    const totalPages = productData?.totalPages ?? 1;
    const totalElements = productData?.totalElements ?? 0;

    // ✅ Reset filters
    const handleReset = () => {
        navigate("/products");
        setFilters({
            pageNum: 1,
            pageSize: 12,
            sortBy: "productId",
            sortDir: "DESC",
            search: "",
            categoryId: null,
            brandId: null,
            minPrice: "",
            maxPrice: "",
        });
    };

    // ✅ Xử lý khi toolbar filter thay đổi
    const handleToolbarChange = (newFilters) => {
        setFilters({
            ...newFilters,
            pageNum: 1,
        });
    };

    // ✅ Xử lý khi filter thay đổi
    const handleFilterChange = (newFilters) => {
        const params = new URLSearchParams();

        if (newFilters.search) params.set("search", newFilters.search);
        if (newFilters.categoryId) params.set("categoryId", newFilters.categoryId);
        if (newFilters.brandId) params.set("brandId", newFilters.brandId);

        navigate(`/products?${params.toString()}`);

        setFilters({
            ...newFilters,
            pageNum: 1,
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <ProductToolbar
                filters={filters}
                totalElements={totalElements}
                onFilterChange={handleToolbarChange}
            />

            <div className="flex gap-6 mt-6">
                <ProductFilter
                    categories={categories}
                    brands={brands}
                    filters={filters}
                    onReset={handleReset}
                    onFilterChange={handleFilterChange}
                />

                <div className="flex-1">
                    <ProductGrid
                        products={products}
                        loading={productLoading}
                    />

                    <ProductPagination
                        pageNum={filters.pageNum}
                        totalPages={totalPages}
                        onPageChange={(page) =>
                            setFilters(prev => ({
                                ...prev,
                                pageNum: page,
                            }))
                        }
                    />
                </div>
            </div>
        </div>
    );
}