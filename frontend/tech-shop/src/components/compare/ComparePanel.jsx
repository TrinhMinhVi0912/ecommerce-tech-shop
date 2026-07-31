// src/components/compare/ComparePanel.jsx
import React, { useEffect, useMemo, useCallback, memo } from 'react';
import { X, Trash2, RefreshCw, Maximize2, Minimize2 } from 'lucide-react';
import { useCompare } from '@/features/product/hooks/useCompare';
import CompareProductCard from './CompareProductCard';
import CompareSearch from './CompareSearch';
import CompareVariantSelector from './CompareVariantSelector';

const ComparePanel = memo(() => {
    const {
        isOpen,
        closePanel,
        leftProduct,
        rightProduct,
        leftVariant,
        rightVariant,
        removeLeftProduct,
        removeRightProduct,
        resetCompare,
        loading,
        error,
        isFull,
        getProductCount // ✅ Lấy số lượng sản phẩm
    } = useCompare();

    const [isExpanded, setIsExpanded] = React.useState(false);

    const getSpecs = useCallback((product, variant) => {
        if (!product) return [];

        const specs = [
            {
                label: 'Giá',
                value: variant?.price ?
                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(variant.price) :
                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.basePrice)
            },
            { label: 'Thương hiệu', value: product.brandResponse?.name || 'N/A' },
            { label: 'Danh mục', value: product.categoryResponse?.name || 'N/A' },
        ];

        if (variant?.attributes) {
            variant.attributes.forEach(attr => {
                specs.push({ label: attr.name, value: attr.value });
            });
        }

        return specs;
    }, []);

    const leftSpecs = useMemo(() => getSpecs(leftProduct, leftVariant), [leftProduct, leftVariant, getSpecs]);
    const rightSpecs = useMemo(() => getSpecs(rightProduct, rightVariant), [rightProduct, rightVariant, getSpecs]);

    const differences = useMemo(() => {
        if (!leftProduct || !rightProduct) return { left: [], right: [] };

        const leftDiff = [];
        const rightDiff = [];

        leftSpecs.forEach((spec, index) => {
            const rightSpec = rightSpecs[index];
            if (rightSpec && spec.value !== rightSpec.value) {
                leftDiff.push(spec);
                rightDiff.push(rightSpec);
            }
        });

        return { left: leftDiff, right: rightDiff };
    }, [leftSpecs, rightSpecs, leftProduct, rightProduct]);

    if (!isOpen) return null;

    const panelWidth = isExpanded ? 'w-[85%]' : 'w-[55%]';

    // ✅ Tính số sản phẩm đang có
    const currentCount = getProductCount ? getProductCount() : 0;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
                onClick={closePanel}
            />

            {/* Panel */}
            <div
                className={`relative bg-white h-full shadow-2xl transition-all duration-300 ease-in-out ${panelWidth}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-bold text-slate-900">
                            So sánh sản phẩm
                        </h2>
                        {/* ✅ Hiển thị đúng số sản phẩm */}
                        <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
                            {currentCount}/2 sản phẩm
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-2 hover:bg-slate-200 rounded-lg transition"
                            title={isExpanded ? 'Thu nhỏ' : 'Mở rộng'}
                        >
                            {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                        </button>
                        <button
                            onClick={resetCompare}
                            className="p-2 hover:bg-slate-200 rounded-lg transition text-sm flex items-center gap-1"
                            title="Xóa tất cả"
                        >
                            <Trash2 size={16} />
                        </button>
                        <button
                            onClick={closePanel}
                            className="p-2 hover:bg-slate-200 rounded-lg transition"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="h-[calc(100%-70px)] overflow-y-auto p-4">
                    {/* Search Area */}
                    {!isFull() && (
                        <div className="mb-4">
                            <CompareSearch />
                        </div>
                    )}

                    {/* Compare Grid */}
                    <div className={`grid ${leftProduct && rightProduct ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                        {/* Left Product */}
                        <div className="border border-slate-200 rounded-xl p-4 bg-white">
                            <CompareProductCard
                                side="left"
                                product={leftProduct}
                                variant={leftVariant}
                                onRemove={removeLeftProduct}
                                emptyText="Chọn sản phẩm bên trái"
                            />
                            {leftProduct && (
                                <CompareVariantSelector
                                    product={leftProduct}
                                    side="left"
                                />
                            )}
                        </div>

                        {/* Right Product */}
                        {rightProduct && (
                            <div className="border border-slate-200 rounded-xl p-4 bg-white">
                                <CompareProductCard
                                    side="right"
                                    product={rightProduct}
                                    variant={rightVariant}
                                    onRemove={removeRightProduct}
                                    emptyText="Chọn sản phẩm bên phải"
                                />
                                {rightProduct && (
                                    <CompareVariantSelector
                                        product={rightProduct}
                                        side="right"
                                    />
                                )}
                            </div>
                        )}

                        {/* Empty placeholder */}
                        {leftProduct && !rightProduct && (
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 flex items-center justify-center min-h-[200px] bg-slate-50">
                                <div className="text-center">
                                    <p className="text-slate-400 text-sm">Chọn sản phẩm thứ 2</p>
                                    <p className="text-xs text-slate-300">để so sánh</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Compare Results */}
                    {leftProduct && rightProduct && (
                        <div className="mt-6 border-t border-slate-200 pt-4">
                            <h3 className="font-semibold text-slate-900 mb-3">Chi tiết so sánh</h3>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Left column */}
                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-slate-600">Thông số</div>
                                    {leftSpecs.map((spec, index) => (
                                        <div key={index} className="flex justify-between py-1 border-b border-slate-100 text-sm">
                                            <span className="text-slate-500">{spec.label}:</span>
                                            <span className="font-medium">{spec.value || 'N/A'}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Right column */}
                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-slate-600">Thông số</div>
                                    {rightSpecs.map((spec, index) => (
                                        <div key={index} className="flex justify-between py-1 border-b border-slate-100 text-sm">
                                            <span className="text-slate-500">{spec.label}:</span>
                                            <span className="font-medium">{spec.value || 'N/A'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Differences */}
                            {(differences.left.length > 0 || differences.right.length > 0) && (
                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <h4 className="text-sm font-medium text-yellow-800 mb-2">Điểm khác biệt</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            {differences.left.map((spec, index) => (
                                                <div key={index} className="py-1">
                                                    <span className="text-slate-500">{spec.label}:</span>
                                                    <span className="ml-2 font-medium text-blue-600">{spec.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            {differences.right.map((spec, index) => (
                                                <div key={index} className="py-1">
                                                    <span className="text-slate-500">{spec.label}:</span>
                                                    <span className="ml-2 font-medium text-blue-600">{spec.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {loading && (
                        <div className="flex items-center justify-center py-8">
                            <RefreshCw className="animate-spin text-blue-600" size={24} />
                            <span className="ml-2 text-slate-500">Đang tải...</span>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

ComparePanel.displayName = 'ComparePanel';

export default ComparePanel;