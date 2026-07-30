import React from 'react';
import { Link } from 'react-router-dom';
import useBrands from '@/features/brand/hooks/useBrands';

const BrandSection = () => {
  const { data, loading, error } = useBrands({ pageSize: 10 });
  const brands = data?.data?.items || [];

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          Thương Hiệu Nổi Bật
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-200 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : error || brands.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">
          Chưa có thương hiệu nào.
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.brandId}
              to={`/products?brand=${brand.brandId}`}
              className="flex items-center justify-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all"
            >
              <span className="text-sm font-bold text-slate-700 hover:text-blue-600 truncate">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default BrandSection;