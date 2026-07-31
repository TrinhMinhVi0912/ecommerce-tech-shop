import React from "react";
import { Search } from "lucide-react";

const ProductToolbar = ({
    filters,
    totalElements = 0,
    onFilterChange,
}) => {

    return (

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            {/* Left */}

            <div className="flex flex-col sm:flex-row gap-3 flex-1">

                {/* Search */}

                <div className="relative flex-1">

                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={filters.search}
                        onChange={(e) =>
                            onFilterChange({
                                ...filters,
                                search: e.target.value,
                            })
                        }
                        className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-sm outline-none focus:border-blue-500"
                    />

                </div>

                {/* Sort */}

                <select
                    value={`${filters.sortBy}-${filters.sortDir}`}
                    onChange={(e) => {

                        const [sortBy, sortDir] = e.target.value.split("-");

                        onFilterChange({
                            ...filters,
                            sortBy,
                            sortDir,
                        });

                    }}
                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
                >

                    <option value="productId-DESC">
                        Mới nhất
                    </option>

                    <option value="basePrice-ASC">
                        Giá tăng dần
                    </option>

                    <option value="basePrice-DESC">
                        Giá giảm dần
                    </option>

                    <option value="name-ASC">
                        Tên A-Z
                    </option>

                    <option value="name-DESC">
                        Tên Z-A
                    </option>

                </select>

            </div>

            {/* Right */}

            <div className="flex items-center gap-4">

                <span className="text-sm text-slate-500 whitespace-nowrap">

                    {totalElements} sản phẩm

                </span>

                <select
                    value={filters.pageSize}
                    onChange={(e) =>
                        onFilterChange({
                            ...filters,
                            pageSize: Number(e.target.value),
                            pageNum: 1,
                        })
                    }
                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
                >

                    <option value={12}>12 / trang</option>

                    <option value={24}>24 / trang</option>

                    <option value={36}>36 / trang</option>

                    <option value={48}>48 / trang</option>

                </select>

            </div>

        </div>

    );

};

export default ProductToolbar;