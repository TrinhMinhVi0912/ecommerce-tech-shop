// src/pages/admin/Dashboard.jsx
import React from 'react';
import {
    Users,
    Package,
    ShoppingBag,
    DollarSign,
    ArrowUp,
    ArrowDown,
    TrendingUp
} from 'lucide-react';

export default function Dashboard() {
    // Dữ liệu tạm - sẽ thay bằng API sau
    const stats = [
        {
            title: 'Tổng doanh thu',
            value: '2,450,000,000 ₫',
            change: '+12.5%',
            isUp: true,
            icon: DollarSign,
            color: 'bg-blue-500'
        },
        {
            title: 'Đơn hàng',
            value: '1,234',
            change: '+8.2%',
            isUp: true,
            icon: ShoppingBag,
            color: 'bg-green-500'
        },
        {
            title: 'Sản phẩm',
            value: '456',
            change: '+3.1%',
            isUp: true,
            icon: Package,
            color: 'bg-purple-500'
        },
        {
            title: 'Người dùng',
            value: '3,456',
            change: '-2.4%',
            isUp: false,
            icon: Users,
            color: 'bg-orange-500'
        },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Tổng quan</h1>
                <p className="text-sm text-slate-500 mt-1">Xin chào, chào mừng bạn quay lại!</p>
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
                            <div className="flex items-center justify-between">
                                <div className={`p-2.5 rounded-lg ${stat.color}`}>
                                    <Icon size={20} className="text-white" />
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-medium ${stat.isUp ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {stat.isUp ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                                    {stat.change}
                                </div>
                            </div>
                            <div className="mt-3">
                                <p className="text-sm text-slate-500">{stat.title}</p>
                                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts & Tables - Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-900">Đơn hàng gần đây</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Xem tất cả →
                        </button>
                    </div>
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((_, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-slate-800">#ORD-{String(i + 1).padStart(4, '0')}</p>
                                    <p className="text-xs text-slate-500">Nguyễn Văn A</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-slate-800">2,500,000 ₫</p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        Đang xử lý
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-900">Sản phẩm bán chạy</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Xem tất cả →
                        </button>
                    </div>
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((_, i) => (
                            <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-500">
                                    #{i + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-800">Laptop Dell XPS 13</p>
                                    <p className="text-xs text-slate-500">{12 - i * 2} đã bán</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-slate-800">35,990,000 ₫</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}