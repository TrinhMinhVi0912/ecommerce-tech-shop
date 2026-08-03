// src/pages/product/ProductDetail.jsx
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import useProductDetail from "@/features/product/hooks/useProductDetail";
import useReviews from "@/features/review/hooks/useReviews";

import ProductGallery from "@/components/product/productdetails/ProductGallery";
import ProductInfo from "@/components/product/productdetails/ProductInfo";
import ProductVariants from "@/components/product/productdetails/ProductVariants";
import ProductActions from "@/components/product/productdetails/ProductActions";
import ProductReviews from "@/components/product/productdetails/ProductReviews";
import RelatedProducts from "@/components/product/productdetails/RelatedProducts";

export default function ProductDetail() {
    const { id } = useParams();
    const [selectedVariant, setSelectedVariant] = useState(null);

    const { data: product, loading, error } = useProductDetail(id);
    const { data: reviewsData, loading: reviewsLoading, refetch } = useReviews(id, {
        pageNum: 1,
        pageSize: 8
    });

    // ✅ Khi product load, set variant mặc định là variant đầu tiên
    useEffect(() => {
        if (product?.variants && product.variants.length > 0) {
            setSelectedVariant(product.variants[0]);
        }
    }, [product]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-4 max-w-5xl">
                <div className="animate-pulse">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="h-72 bg-slate-200 rounded-xl"></div>
                        <div className="space-y-3">
                            <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                            <div className="h-16 bg-slate-200 rounded"></div>
                            <div className="h-9 bg-slate-200 rounded w-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-10 max-w-5xl">
                <div className="text-center py-8">
                    <h2 className="text-xl font-bold text-red-600">Lỗi tải sản phẩm</h2>
                    <p className="text-gray-500 mt-2">Vui lòng thử lại sau</p>
                </div>
            </div>
        );
    }

    const reviews = reviewsData?.reviews?.items || [];
    const summary = reviewsData?.summary || { averageRating: 0, totalReviews: 0 };

    // ✅ Lấy variant hiện tại
    const currentVariant = selectedVariant || product.variants?.[0] || null;

    // ✅ Log để debug
    console.log('🔍 ProductDetail - selectedVariant:', selectedVariant);
    console.log('🔍 ProductDetail - currentVariant:', currentVariant);

    return (
        <div className="container mx-auto px-4 py-4 max-w-5xl">
            {/* Product Main Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                {/* Gallery */}
                <ProductGallery images={product.images || []} productName={product.name} />

                {/* Product Info */}
                <div className="space-y-3">
                    <ProductInfo
                        name={product.name}
                        description={product.description}
                        brand={product.brandResponse}
                        category={product.categoryResponse}
                    />

                    {/* Price */}
                    <div className="text-xl font-bold text-blue-600">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                            currentVariant?.price || product.basePrice
                        )}
                    </div>

                    {/* Variants */}
                    {product.variants && product.variants.length > 0 && (
                        <ProductVariants
                            variants={product.variants}
                            selectedVariant={currentVariant}
                            onVariantChange={setSelectedVariant}
                        />
                    )}

                    {/* Actions */}
                    <ProductActions
                        productId={product.productId}
                        basePrice={product.basePrice}
                        variants={product.variants || []}
                        selectedVariant={currentVariant}
                    />
                </div>
            </div>

            {/* Product Description */}
            <div className="mt-4">
                <h2 className="text-base font-bold mb-2">Mô tả sản phẩm</h2>
                <div className="bg-white rounded-xl border border-slate-200 p-4 prose max-w-none text-sm">
                    <p className="text-slate-700">{product.description || "Chưa có mô tả cho sản phẩm này"}</p>
                </div>
            </div>

            {/* Reviews */}
            <ProductReviews
                productId={product.productId}
                reviews={reviews}
                summary={summary}
                loading={reviewsLoading}
                onReviewAdded={refetch}
                onReviewDeleted={refetch}
                onReviewUpdated={refetch}
            />

            {/* Related Products */}
            <RelatedProducts categoryId={product.categoryResponse?.categoryId} />
        </div>
    );
}