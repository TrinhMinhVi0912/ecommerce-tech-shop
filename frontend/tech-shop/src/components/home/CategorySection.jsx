import React from 'react';
import { Link } from 'react-router-dom';
import useCategories from '@/features/category/hooks/useCategories';

const CategorySection = () => {
  const { data, loading, error } = useCategories({ pageNum: 1, pageSize: 12 });
  const categories = data?.data?.items || [];


  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          Danh Mục Sản Phẩm
        </h2>
        <Link
          to="/products"
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:underline"
        >
          Xem tất cả &rarr;
        </Link>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 lg:grid-cols-8 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-slate-200 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : error || categories.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">
          Chưa có danh mục nào.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.categoryId}
              to={`/products?category=${cat.categoryId}`}
              className="group flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all text-center"
            >
              <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategorySection;