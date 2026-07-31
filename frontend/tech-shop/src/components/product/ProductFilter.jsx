import { useMemo, useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Search } from "lucide-react";

export default function ProductFilter({
    categories = [],
    brands = [],
    filters,
    onFilterChange,
    onReset,
}) {

    const [brandKeyword, setBrandKeyword] = useState("");
    const [expanded, setExpanded] = useState({});

    /*
    BUILD CATEGORY TREE
    */

    const categoryTree = useMemo(() => {

        if (!categories?.length) return [];

        const map = {};

        categories.forEach(category => {

            map[category.categoryId] = {
                ...category,
                children: [],
            };

        });

        const roots = [];

        categories.forEach(category => {

            if (category.parentId) {

                map[category.parentId]?.children.push(
                    map[category.categoryId]
                );

            } else {

                roots.push(map[category.categoryId]);

            }

        });

        return roots;

    }, [categories]);

    // Mở rộng category tree khi có category được chọn
    useEffect(() => {
        if (filters.categoryId) {
            // Tìm path của category được chọn để mở rộng
            const findPath = (tree, targetId, path = []) => {
                for (const node of tree) {
                    const currentPath = [...path, node.categoryId];
                    if (node.categoryId === targetId) {
                        return currentPath;
                    }
                    if (node.children && node.children.length > 0) {
                        const childPath = findPath(node.children, targetId, currentPath);
                        if (childPath) return childPath;
                    }
                }
                return null;
            };

            const path = findPath(categoryTree, filters.categoryId);
            if (path) {
                const newExpanded = {};
                path.forEach(id => {
                    if (id !== filters.categoryId) { // Không mở rộng chính nó
                        newExpanded[id] = true;
                    }
                });
                setExpanded(prev => ({ ...prev, ...newExpanded }));
            }
        }
    }, [filters.categoryId, categoryTree]);

    /*
    BRAND FILTER
    */

    const filteredBrands = useMemo(() => {

        return brands.filter(brand =>
            brand.name
                .toLowerCase()
                .includes(brandKeyword.toLowerCase())
        );

    }, [brands, brandKeyword]);

    /*
    CATEGORY ITEM
    */

    const renderCategory = (category, level = 0) => {

        const hasChildren = category.children && category.children.length > 0;

        return (

            <div key={category.categoryId}>

                <div
                    className="flex items-center gap-2 py-2"
                    style={{ paddingLeft: `${level * 16}px` }}
                >

                    {hasChildren ? (

                        <button
                            onClick={() =>
                                setExpanded(prev => ({
                                    ...prev,
                                    [category.categoryId]:
                                        !prev[category.categoryId],
                                }))
                            }
                            className="focus:outline-none"
                        >
                            {
                                expanded[category.categoryId]
                                    ? <ChevronDown size={16} />
                                    : <ChevronRight size={16} />
                            }
                        </button>

                    ) : (

                        <div className="w-4" />

                    )}

                    <input
                        type="checkbox"
                        checked={filters.categoryId === category.categoryId}
                        onChange={() =>
                            onFilterChange({
                                ...filters,
                                categoryId:
                                    filters.categoryId === category.categoryId
                                        ? null
                                        : category.categoryId,
                            })
                        }
                        className="cursor-pointer"
                    />

                    <span className="text-sm cursor-pointer" onClick={() =>
                        onFilterChange({
                            ...filters,
                            categoryId:
                                filters.categoryId === category.categoryId
                                    ? null
                                    : category.categoryId,
                        })
                    }>
                        {category.name}
                    </span>

                </div>

                {
                    hasChildren &&
                    expanded[category.categoryId] &&
                    category.children.map(child =>
                        renderCategory(child, level + 1)
                    )
                }

            </div>

        );

    };

    return (

        <aside className="w-72 bg-white rounded-xl border border-slate-200 p-5">

            {/* ================= CATEGORY ================= */}

            <div>

                <h3 className="font-semibold mb-3">
                    Danh mục
                </h3>

                {categoryTree.map(category =>
                    renderCategory(category)
                )}

            </div>

            <hr className="my-6" />

            {/* ================= BRAND ================= */}

            <div>

                <h3 className="font-semibold mb-3">
                    Thương hiệu
                </h3>

                <div className="relative mb-3">

                    <Search
                        size={16}
                        className="absolute left-3 top-3 text-slate-400"
                    />

                    <input
                        value={brandKeyword}
                        onChange={(e) =>
                            setBrandKeyword(e.target.value)
                        }
                        placeholder="Tìm thương hiệu..."
                        className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>

                <div className="max-h-56 overflow-y-auto space-y-2">

                    {filteredBrands.map(brand => (

                        <label
                            key={brand.brandId}
                            className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-600"
                        >

                            <input
                                type="checkbox"
                                checked={filters.brandId === brand.brandId}
                                onChange={() =>
                                    onFilterChange({
                                        ...filters,
                                        brandId:
                                            filters.brandId === brand.brandId
                                                ? null
                                                : brand.brandId,
                                    })
                                }
                                className="cursor-pointer"
                            />

                            <span>{brand.name}</span>

                        </label>

                    ))}

                </div>

            </div>

            <hr className="my-6" />

            {/* ================= PRICE ================= */}

            <div>

                <h3 className="font-semibold mb-3">
                    Khoảng giá
                </h3>

                <div className="space-y-3">

                    <input
                        type="number"
                        min={0}
                        step="100000"
                        placeholder="Giá từ"
                        value={filters.minPrice}
                        onChange={(e) =>
                            onFilterChange({
                                ...filters,
                                minPrice: e.target.value,
                            })
                        }
                        className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="number"
                        min={0}
                        step="100000"
                        placeholder="Giá đến"
                        value={filters.maxPrice}
                        onChange={(e) =>
                            onFilterChange({
                                ...filters,
                                maxPrice: e.target.value,
                            })
                        }
                        className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>

            </div>

            <div className="mt-8 flex gap-3">

                <button
                    className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition-colors"
                >
                    Áp dụng
                </button>

                <button
                    onClick={onReset}
                    className="flex-1 border rounded-lg py-2 hover:bg-gray-50 transition-colors"
                >
                    Đặt lại
                </button>

            </div>

        </aside>

    );

}