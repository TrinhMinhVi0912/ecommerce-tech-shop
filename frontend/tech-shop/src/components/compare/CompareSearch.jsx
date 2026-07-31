// src/components/compare/CompareSearch.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useCompare } from '@/features/product/hooks/useCompare';
import { getImageUrl } from '@/utils/imageUtils';

const CompareSearch = () => {
    const {
        searchQuery,
        searchResults,
        isSearching,
        setSearchQuery,
        setSearchResults,
        addProductToCompare,
        searchProducts,
        leftProduct,
        rightProduct
    } = useCompare();

    const [isFocused, setIsFocused] = useState(false);
    const searchRef = useRef(null);
    const searchTimeout = useRef(null);
    const previousQueryRef = useRef('');

    const getSearchCategoryId = useCallback(() => {
        if (!leftProduct) return null;

        const category = leftProduct.categoryResponse;
        if (!category) return null;

        if (category.parentId) {
            console.log('🔍 Using parentId for search:', category.parentId);
            return category.parentId;
        }

        console.log('🔍 Using categoryId for search:', category.categoryId);
        return category.categoryId;
    }, [leftProduct]);

    useEffect(() => {
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        const trimmedQuery = searchQuery.trim();

        if (previousQueryRef.current === trimmedQuery) {
            return;
        }

        searchTimeout.current = setTimeout(() => {
            if (trimmedQuery.length < 2) {
                setSearchResults([]);
                previousQueryRef.current = trimmedQuery;
                return;
            }

            const categoryId = getSearchCategoryId();
            console.log('🔍 Searching:', trimmedQuery, 'categoryId:', categoryId);

            if (searchProducts) {
                searchProducts(trimmedQuery, categoryId);
                previousQueryRef.current = trimmedQuery;
            }
        }, 500);

        return () => {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, [searchQuery, searchProducts, getSearchCategoryId, setSearchResults]);

    const handleSelectProduct = (product) => {
        addProductToCompare(product.productId);
        setSearchQuery('');
        setSearchResults([]);
        setIsFocused(false);
        previousQueryRef.current = '';
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getProductImage = (product) => {
        if (product.thumbnailImagePath) {
            return getImageUrl(product.thumbnailImagePath);
        }
        if (product.images && product.images.length > 0) {
            const thumbnail = product.images.find(img => img.thumbnail === true);
            return getImageUrl(thumbnail?.imagePath || product.images[0]?.imagePath);
        }
        return '/images/products/default.jpg';
    };

    return (
        <div
            className="relative"
            ref={searchRef}
            style={{ position: 'relative', zIndex: 9999 }}
        >
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        setTimeout(() => setIsFocused(false), 200);
                    }}
                    placeholder={leftProduct ? 'Tìm sản phẩm thứ 2 để so sánh...' : 'Tìm sản phẩm để so sánh...'}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    disabled={leftProduct && rightProduct}
                />
                {searchQuery && (
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setSearchResults([]);
                            previousQueryRef.current = '';
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Search Results - z-index cực cao */}
            {isFocused && searchQuery.trim().length >= 2 && searchResults.length > 0 && (
                <div
                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-2xl max-h-60 overflow-y-auto"
                    style={{
                        zIndex: 99999,
                        position: 'absolute',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                    }}
                >
                    {isSearching ? (
                        <div className="p-4 text-center text-slate-400 text-sm">
                            <div className="animate-spin inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                            <span className="ml-2">Đang tìm kiếm...</span>
                        </div>
                    ) : (
                        searchResults.map((product) => (
                            <button
                                key={product.productId}
                                onClick={() => handleSelectProduct(product)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition text-left border-b border-slate-100 last:border-0"
                            >
                                <img
                                    src={getProductImage(product)}
                                    alt={product.name}
                                    className="w-10 h-10 object-cover rounded"
                                    onError={(e) => {
                                        e.target.src = '/images/products/default.jpg';
                                    }}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">
                                        {product.name}
                                    </p>
                                    <p className="text-xs text-blue-600">
                                        {formatPrice(product.basePrice)}
                                    </p>
                                </div>
                                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                    {product.brandResponse?.name || 'Không có thương hiệu'}
                                </span>
                            </button>
                        ))
                    )}
                </div>
            )}

            {isFocused && searchQuery.trim().length >= 2 && searchResults.length === 0 && !isSearching && (
                <div
                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-2xl p-4 text-center text-slate-400 text-sm"
                    style={{ zIndex: 99999, position: 'absolute' }}
                >
                    Không tìm thấy sản phẩm nào
                </div>
            )}

            {leftProduct && !rightProduct && (
                <div className="mt-2 text-xs text-slate-500">
                    💡 Chọn sản phẩm cùng danh mục để so sánh
                </div>
            )}
        </div>
    );
};

export default CompareSearch;