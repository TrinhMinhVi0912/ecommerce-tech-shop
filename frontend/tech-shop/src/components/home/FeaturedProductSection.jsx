import React from 'react';
import { Link } from 'react-router-dom';
import useProducts from '@/features/product/hooks/useProducts';
import ProductCard from '@/components/product/ProductCard';

const FeaturedProductSection = () => {
  const { data, loading, error } = useProducts({
    pageNum: 1,
    pageSize: 12,
    sortBy: 'createdAt',
    sortDir: 'DESC',
  });

  // Lấy dữ liệu từ data đã được xử lý trong hook
  const products = data?.items || [];

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Sản Phẩm Mới Nhất
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Những thiết bị công nghệ đỉnh cao vừa cập bến
          </p>
        </div>
        <Link
          to="/products"
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:underline"
        >
          Xem tất cả &rarr;
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-72 bg-slate-200 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : error || products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-100 text-slate-500 text-sm">
          Hiện chưa có sản phẩm nổi bật nào.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard key={product.productId || product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedProductSection;