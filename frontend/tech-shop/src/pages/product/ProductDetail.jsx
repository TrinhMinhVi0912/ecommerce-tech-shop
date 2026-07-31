// src/pages/product/ProductDetail.jsx
import { useParams } from "react-router-dom";
import { GitCompare } from "lucide-react";
import { useCompare } from "@/features/product/hooks/useCompare";
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
    const productId = Number(id);

    // ✅ Lấy các hàm từ useCompare
    const { openPanel, addProductToCompare, isProductSelected } = useCompare();

    const { data: product, loading, error } = useProductDetail(id);
    const { data: reviewsData, loading: reviewsLoading, refetch } = useReviews(id, {
        pageNum: 1,
        pageSize: 8
    });

    const handleCompare = async () => {
        console.log('🔄 Adding product to compare from detail:', productId);

        try {
            openPanel();
            const result = await addProductToCompare(productId);
            console.log('✅ Add product result:', result);
        } catch (error) {
            console.error('❌ Error adding product to compare:', error);
        }
    };

    const isSelected = isProductSelected(productId);

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

    return (
        <div className="container mx-auto px-4 py-4 max-w-5xl">
            {/* Nút so sánh */}
            <div className="flex justify-end mb-2">
                <button
                    onClick={handleCompare}
                    disabled={isSelected}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${isSelected
                        ? 'bg-blue-100 text-blue-600 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                        }`}
                >
                    <GitCompare size={18} />
                    {isSelected ? 'Đã thêm vào so sánh' : 'So sánh sản phẩm'}
                </button>
            </div>

            {/* Product Main Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <ProductGallery images={product.images || []} productName={product.name} />

                <div className="space-y-3">
                    <ProductInfo
                        name={product.name}
                        description={product.description}
                        brand={product.brandResponse}
                        category={product.categoryResponse}
                    />

                    <div className="text-xl font-bold text-blue-600">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.basePrice)}
                    </div>

                    {product.variants && product.variants.length > 0 && (
                        <ProductVariants variants={product.variants} />
                    )}

                    <ProductActions
                        productId={product.productId}
                        basePrice={product.basePrice}
                        variants={product.variants}
                    />
                </div>
            </div>

            <div className="mt-4">
                <h2 className="text-base font-bold mb-2">Mô tả sản phẩm</h2>
                <div className="bg-white rounded-xl border border-slate-200 p-4 prose max-w-none text-sm">
                    <p className="text-slate-700">{product.description || "Chưa có mô tả cho sản phẩm này"}</p>
                </div>
            </div>

            <ProductReviews
                productId={product.productId}
                reviews={reviews}
                summary={summary}
                loading={reviewsLoading}
                onReviewAdded={refetch}
                onReviewDeleted={refetch}
                onReviewUpdated={refetch}
            />

            <RelatedProducts categoryId={product.categoryResponse?.categoryId} />
        </div>
    );
}