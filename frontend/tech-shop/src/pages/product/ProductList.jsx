import { useState, useEffect, useRef } from "react";
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

    const categoryIdFromUrl = searchParams.get("categoryId");
    const brandIdFromUrl = searchParams.get("brandId");

    // Khởi tạo filters với giá trị từ URL ngay từ đầu
    const [filters, setFilters] = useState({
        pageNum: 1,
        pageSize: 12,
        sortBy: "productId",
        sortDir: "DESC",
        search: "",
        categoryId: categoryIdFromUrl ? Number(categoryIdFromUrl) : null,
        brandId: brandIdFromUrl ? Number(brandIdFromUrl) : null,
        minPrice: "",
        maxPrice: "",
    });

    // Chỉ cập nhật khi URL thay đổi và khác với filters hiện tại
    useEffect(() => {
        const newCategoryId = categoryIdFromUrl ? Number(categoryIdFromUrl) : null;
        const newBrandId = brandIdFromUrl ? Number(brandIdFromUrl) : null;

        // Chỉ cập nhật nếu có sự thay đổi
        if (filters.categoryId !== newCategoryId || filters.brandId !== newBrandId) {

            setFilters(prev => ({
                ...prev,
                pageNum: 1,
                categoryId: newCategoryId,
                brandId: newBrandId,
            }));
        }
    }, [categoryIdFromUrl, brandIdFromUrl]);

    // Categories
    const { data: categoryData } = useCategories();
    const categories = categoryData?.data?.items ?? [];

    // Brands
    const { data: brandData } = useBrands();
    const brands = brandData?.data?.items ?? [];

    // Products
    const { data: productData, loading: productLoading } = useProducts(filters);

    const products = productData?.items ?? [];
    const totalPages = productData?.totalPages ?? 1;
    const totalElements = productData?.totalElements ?? 0;

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

    return (
        <div className="container mx-auto px-4 py-8">
            <ProductToolbar
                filters={filters}
                totalElements={totalElements}
                onFilterChange={(newFilters) => {
                    setFilters({
                        ...newFilters,
                        pageNum: 1,
                    });
                }}
            />

            <div className="flex gap-6 mt-6">
                <ProductFilter
                    categories={categories}
                    brands={brands}
                    filters={filters}
                    onReset={handleReset}
                    onFilterChange={(newFilters) => {
                        const params = new URLSearchParams();

                        if (newFilters.categoryId)
                            params.set("categoryId", newFilters.categoryId);

                        if (newFilters.brandId)
                            params.set("brandId", newFilters.brandId);

                        navigate(`/products?${params.toString()}`);

                        setFilters({
                            ...newFilters,
                            pageNum: 1,
                        });
                    }}
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