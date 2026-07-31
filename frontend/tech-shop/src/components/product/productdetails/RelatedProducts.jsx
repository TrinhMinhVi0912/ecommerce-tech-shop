import { Link } from "react-router-dom";
import useProducts from "@/features/product/hooks/useProducts";
import ProductCard from "@/components/product/ProductCard";

export default function RelatedProducts({ categoryId }) {
    const { data, loading } = useProducts({
        pageNum: 1,
        pageSize: 6,
        categoryId: categoryId,
        sortBy: "productId",
        sortDir: "DESC"
    });

    const products = data?.items || [];

    if (loading || products.length === 0) return null;

    return (
        <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {products.slice(0, 6).map((product) => (
                    <ProductCard key={product.productId} product={product} />
                ))}
            </div>
        </div>
    );
}