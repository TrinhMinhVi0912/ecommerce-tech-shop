// src/pages/admin/Dashboard.jsx
import React, { useState } from 'react';
import {
    Users,
    Package,
    ShoppingBag,
    DollarSign,
    RefreshCw,
    BarChart3,
    TrendingUp,
    ShoppingCart
} from 'lucide-react';
import useAdminSummary from '@/features/admin/dashboard/hooks/useAdminSummary';
import useAdminRevenue from '@/features/admin/dashboard/hooks/useAdminRevenue';
import useAdminOrderStatistics from '@/features/admin/dashboard/hooks/useAdminOrderStatistics';
import useAdminTopProducts from '@/features/admin/dashboard/hooks/useAdminTopProducts';
import { getImageUrl } from '@/utils/imageUtils';

export default function Dashboard() {
    const [timeFilter, setTimeFilter] = useState('MONTH');
    const [activeChart, setActiveChart] = useState('revenue');
    const [currentYear] = useState(new Date().getFullYear());

    // Fetch data
    const { data: summary, loading: summaryLoading, refetch: refetchSummary } = useAdminSummary();
    const { data: revenue, loading: revenueLoading } = useAdminRevenue({ type: timeFilter, year: currentYear });
    const { data: orders, loading: ordersLoading } = useAdminOrderStatistics({ type: timeFilter, year: currentYear });
    const { data: topProducts, loading: topProductsLoading } = useAdminTopProducts({
        type: timeFilter,
        year: currentYear,
        month: new Date().getMonth() + 1,
        quarter: Math.ceil((new Date().getMonth() + 1) / 3)
    });

    const isLoading = summaryLoading || revenueLoading || ordersLoading || topProductsLoading;

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value || 0);
    };

    // Format number
    const formatNumber = (value) => {
        return new Intl.NumberFormat('vi-VN').format(value || 0);
    };

    // Get current month index
    const currentMonth = new Date().getMonth();

    // Get label based on time filter
    const getTimeLabel = () => {
        switch (timeFilter) {
            case 'MONTH': return 'Tháng';
            case 'QUARTER': return 'Quý';
            case 'YEAR': return 'Năm';
            default: return 'Tháng';
        }
    };

    // Get labels based on filter
    const getLabels = () => {
        if (timeFilter === 'MONTH') {
            return ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
        } else if (timeFilter === 'QUARTER') {
            return ['Quý 1', 'Quý 2', 'Quý 3', 'Quý 4'];
        } else {
            return ['2024', '2025', '2026'];
        }
    };

    const chartLabels = getLabels();

    // Stats cards data - remove change percentage
    const stats = [
        {
            title: 'Tổng doanh thu',
            value: formatCurrency(summary?.totalRevenue),
            icon: DollarSign,
            color: 'bg-blue-500',
            loading: summaryLoading
        },
        {
            title: 'Đơn hàng hoàn thành',
            value: formatNumber(summary?.totalCompleteOrders),
            icon: ShoppingBag,
            color: 'bg-green-500',
            loading: summaryLoading
        },
        {
            title: 'Sản phẩm đang bán',
            value: formatNumber(summary?.totalActiveProducts),
            icon: Package,
            color: 'bg-purple-500',
            loading: summaryLoading
        },
        {
            title: 'Người dùng hoạt động',
            value: formatNumber(summary?.totalEnableUsers),
            icon: Users,
            color: 'bg-orange-500',
            loading: summaryLoading
        },
    ];

    // Get chart data
    const getChartData = () => {
        if (activeChart === 'revenue') {
            return {
                data: revenue?.items || [],
                total: revenue?.totalRevenue || 0,
                color: 'bg-blue-500',
                colorLight: 'bg-blue-400',
                colorLighter: 'bg-blue-300',
                hoverColor: 'bg-blue-600',
                label: 'Doanh thu',
                valueKey: 'revenue',
                formatValue: formatCurrency,
                unit: 'đ'
            };
        } else {
            return {
                data: orders?.items || [],
                total: orders?.totalOrders || 0,
                color: 'bg-green-500',
                colorLight: 'bg-green-400',
                colorLighter: 'bg-green-300',
                hoverColor: 'bg-green-600',
                label: 'Đơn hàng',
                valueKey: 'totalOrders',
                formatValue: (val) => val,
                unit: 'đơn'
            };
        }
    };

    const chartData = getChartData();

    // Tính max value với padding
    const allValues = chartData.data.map(item => item[chartData.valueKey] || 0);
    const maxVal = Math.max(...allValues, 1);
    const maxValue = maxVal > 0 ? maxVal * 1.3 : 100;

    const chartOptions = [
        { id: 'revenue', label: 'Doanh thu', icon: BarChart3 },
        { id: 'orders', label: 'Đơn hàng', icon: ShoppingCart }
    ];

    return (
        <div>
            {/* Header with refresh */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Tổng quan</h1>
                    <p className="text-sm text-slate-500 mt-1">Xin chào, chào mừng bạn quay lại!</p>
                </div>
                <button
                    onClick={() => {
                        refetchSummary();
                        window.location.reload();
                    }}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                    <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                    {isLoading ? 'Đang tải...' : 'Cập nhật'}
                </button>
            </div>

            {/* Time Filter */}
            <div className="flex gap-2 mb-6">
                {['MONTH', 'QUARTER', 'YEAR'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setTimeFilter(type)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${timeFilter === type
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        {type === 'MONTH' ? 'Tháng' : type === 'QUARTER' ? 'Quý' : 'Năm'}
                    </button>
                ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-lg ${stat.color}`}>
                                    <Icon size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">{stat.title}</p>
                                    {stat.loading ? (
                                        <div className="h-8 w-24 bg-slate-200 rounded animate-pulse mt-1"></div>
                                    ) : (
                                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Top Products */}
            <div className="mb-6">
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                            <TrendingUp size={18} className="text-blue-600" />
                            Sản phẩm bán chạy
                        </h3>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-400">
                                {timeFilter === 'MONTH' ? 'Tháng này' : timeFilter === 'QUARTER' ? 'Quý này' : 'Năm nay'}
                            </span>
                            {topProducts?.length > 3 && (
                                <span className="text-xs text-blue-600">
                                    {topProducts.length} sản phẩm
                                </span>
                            )}
                        </div>
                    </div>
                    {topProductsLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse"></div>
                            ))}
                        </div>
                    ) : topProducts?.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 text-sm">
                            Chưa có sản phẩm nào được bán
                        </div>
                    ) : (
                        <div className={`${topProducts?.length > 3 ? 'max-h-[280px] overflow-y-auto pr-2' : ''}`}>
                            <div className="space-y-3">
                                {topProducts?.map((product, index) => (
                                    <div
                                        key={product.productId}
                                        className={`flex items-center gap-3 py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50 rounded-lg px-2 transition ${index >= 3 ? 'opacity-80' : ''
                                            }`}
                                    >
                                        <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white flex-shrink-0 ${index === 0 ? 'bg-yellow-500' :
                                                index === 1 ? 'bg-slate-400' :
                                                    index === 2 ? 'bg-amber-600' :
                                                        'bg-slate-300'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <img
                                            src={getImageUrl(product.thumbnail) || '/images/products/default.jpg'}
                                            alt={product.productName}
                                            className="w-12 h-12 object-cover rounded-lg bg-slate-50 border border-slate-200 flex-shrink-0"
                                            onError={(e) => {
                                                e.target.src = '/images/products/default.jpg';
                                            }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-800 truncate">
                                                {product.productName}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span>{product.brandName}</span>
                                                <span>•</span>
                                                <span>{product.categoryName}</span>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-sm font-medium text-slate-800">
                                                {formatNumber(product.totalSold)} đã bán
                                            </p>
                                            <p className="text-xs text-blue-600">
                                                {formatCurrency(product.revenue)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {topProducts?.length > 3 && (
                                <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-100 mt-2">
                                    Kéo xuống để xem thêm {topProducts.length - 3} sản phẩm
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                {/* Chart Tabs */}
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
                    <div className="flex items-center gap-6">
                        <h3 className="font-semibold text-slate-900">
                            Thống kê theo {getTimeLabel().toLowerCase()}
                        </h3>
                    </div>
                    <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                        {chartOptions.map((option) => {
                            const Icon = option.icon;
                            const isActive = activeChart === option.id;
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => setActiveChart(option.id)}
                                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition ${isActive
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    <Icon size={16} />
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Chart Content */}
                <div className="p-5">
                    {revenueLoading || ordersLoading ? (
                        <div className="h-64 bg-slate-100 rounded-lg animate-pulse"></div>
                    ) : chartData.data.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                            Không có dữ liệu
                        </div>
                    ) : (
                        <div>
                            <div className="h-64 flex items-end gap-1.5">
                                {chartData.data.map((item, index) => {
                                    const value = item[chartData.valueKey] || 0;
                                    const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;
                                    const displayHeight = value > 0 ? Math.max(heightPercent, 8) : 0;
                                    const isCurrent = timeFilter === 'MONTH' && index === currentMonth;
                                    const isMax = value === maxVal && maxVal > 0;
                                    const isZero = value === 0;

                                    let barColor = 'bg-slate-200';
                                    if (!isZero) {
                                        if (isCurrent || isMax) {
                                            barColor = chartData.color;
                                        } else {
                                            barColor = chartData.colorLight;
                                        }
                                    }

                                    return (
                                        <div
                                            key={index}
                                            className="flex-1 flex flex-col items-center gap-1.5 group relative h-full justify-end"
                                        >
                                            <div className="absolute -top-8 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                                {item.label}: {chartData.formatValue(value)}
                                            </div>

                                            {displayHeight > 0 && (
                                                <div
                                                    className={`w-full rounded-t transition-all duration-700 ${barColor}`}
                                                    style={{
                                                        height: `${displayHeight}%`,
                                                        minHeight: value > 0 ? '8px' : '0px',
                                                        transition: 'height 0.7s ease'
                                                    }}
                                                />
                                            )}

                                            <span className={`text-[10px] text-slate-500 ${timeFilter === 'MONTH' && index % 2 !== 0 ? 'hidden sm:block' : ''
                                                }`}>
                                                {item.label || chartLabels[index]}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between text-sm">
                                <span className="text-slate-500">
                                    Tổng {chartData.label.toLowerCase()}
                                </span>
                                <span className="font-bold text-slate-900">
                                    {chartData.formatValue(chartData.total)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}