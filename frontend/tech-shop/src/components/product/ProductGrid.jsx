import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({
    products = [],
    loading = false,
}) => {

    if (loading) {

        return (

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">

                {
                    Array.from({ length: 12 }).map((_, index) => (

                        <div
                            key={index}
                            className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse"
                        >

                            <div className="aspect-square bg-slate-200" />

                            <div className="p-3">

                                <div className="h-4 bg-slate-200 rounded mb-2" />

                                <div className="h-4 w-3/4 bg-slate-200 rounded mb-4" />

                                <div className="h-5 w-1/2 bg-slate-300 rounded" />

                            </div>

                        </div>

                    ))
                }

            </div>

        );

    }

    if (!products.length) {

        return (

            <div className="bg-white border border-slate-200 rounded-xl py-20 text-center">

                <h3 className="text-lg font-semibold text-slate-700">
                    Không tìm thấy sản phẩm
                </h3>

                <p className="text-sm text-slate-500 mt-2">
                    Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
                </p>

            </div>

        );

    }

    return (

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">

            {
                products.map(product => (

                    <ProductCard
                        key={product.productId}
                        product={product}
                    />

                ))
            }

        </div>

    );

};

export default ProductGrid;