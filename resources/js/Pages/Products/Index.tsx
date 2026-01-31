import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { PageProps, Product, PaginatedResponse } from '@/types';

interface ProductStats {
    total_products: number;
    potential_profit: number;
    total_stock_value: number;
    low_stock_count: number;
    stock_out_count: number;
}

interface ProductsProps extends PageProps {
    products: PaginatedResponse<Product>;
    filters: { search?: string; filter?: string };
    stats: ProductStats;
}

export default function Products({ products, filters, stats }: ProductsProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [currentFilter, setCurrentFilter] = useState(filters.filter || 'all');
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    // Copy to clipboard with feedback
    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 1500);
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== (filters.search || '')) {
                router.get('/products', {
                    search: searchQuery,
                    filter: currentFilter === 'all' ? undefined : currentFilter
                }, {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true
                });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Handle Tab Change
    const handleTabChange = (filter: string) => {
        setCurrentFilter(filter);
        router.get('/products', {
            search: searchQuery,
            filter: filter === 'all' ? undefined : filter
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const formatTaka = (amount: number) => '৳ ' + Number(amount || 0).toLocaleString('bn-BD');

    return (
        <DashboardLayout title="পণ্য সমূহ">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">পণ্য সমূহ</h1>
                    <p className="text-gray-400">পণ্য মজুদ ও দাম পরিচালনা</p>
                </div>
                <Link
                    href="/products/create"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium"
                    style={{ backgroundColor: '#006A4E' }}
                >
                    <span>➕</span>
                    <span>নতুন পণ্য</span>
                </Link>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">মোট স্টক ভ্যালু</p>
                    <p className="text-2xl font-bold text-blue-400">{formatTaka(stats.total_stock_value)}</p>
                </div>
                {/* New: Potential Profit Card */}
                <div className="bg-gradient-to-br from-teal-900/50 to-gray-800 rounded-xl p-4 border border-teal-700/50 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="text-4xl">💰</span>
                    </div>
                    <p className="text-teal-400 text-sm font-medium">সম্ভাব্য লাভ (Potential Profit)</p>
                    <p className="text-2xl font-bold text-teal-300 mt-1">{formatTaka(stats.potential_profit)}</p>
                    <p className="text-xs text-gray-400 mt-1">সব বিক্রি হলে আনুমানিক লাভ</p>
                </div>
                <div
                    className={`bg-gray-800 rounded-xl p-4 border cursor-pointer transition-all ${currentFilter === 'low_stock' ? 'border-yellow-500 bg-yellow-500/10' : 'border-gray-700 hover:border-yellow-600'}`}
                    onClick={() => handleTabChange('low_stock')}
                >
                    <p className="text-gray-400 text-sm">কম স্টক (Alert)</p>
                    <p className="text-2xl font-bold text-yellow-400">{stats.low_stock_count}</p>
                </div>
                <div
                    className={`bg-gray-800 rounded-xl p-4 border cursor-pointer transition-all ${currentFilter === 'stock_out' ? 'border-red-500 bg-red-500/10' : 'border-gray-700 hover:border-red-600'}`}
                    onClick={() => handleTabChange('stock_out')}
                >
                    <p className="text-gray-400 text-sm">স্টক আউট</p>
                    <p className="text-2xl font-bold text-red-400">{stats.stock_out_count}</p>
                </div>
            </div>

            {/* Search & Filters (Tabs) */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-gray-800 p-2 rounded-xl border border-gray-700">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="পণ্যের নাম বা SKU কোড দিয়ে খুঁজুন..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                </div>
                <div className="flex gap-2 bg-gray-900 p-1 rounded-lg">
                    {[
                        { key: 'all', label: 'সব পণ্য' },
                        { key: 'low_stock', label: 'কম স্টক' },
                        { key: 'stock_out', label: 'স্টক আউট' },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => handleTabChange(tab.key)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${currentFilter === tab.key
                                ? 'bg-gray-700 text-white shadow'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Table */}
            {products.data && products.data.length > 0 ? (
                <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-300">
                            <thead className="bg-gray-900/50 text-xs uppercase font-semibold text-gray-400">
                                <tr>
                                    <th className="px-3 py-4 w-12 text-center">SL</th>
                                    <th className="px-3 py-4">কোড</th>
                                    <th className="px-4 py-4">পণ্য</th>
                                    <th className="px-4 py-4">বিক্রয় মূল্য</th>
                                    <th className="px-4 py-4">ক্রয় মূল্য</th>
                                    <th className="px-4 py-4">মজুদ (Stock)</th>
                                    <th className="px-4 py-4">Status</th>
                                    <th className="px-4 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {products.data.map((product, index) => {
                                    const serialNumber = (products.from || 0) + index;
                                    const quickCode = `P-${String(product.id).substring(0, 6).toUpperCase()}`;
                                    return (
                                        <tr key={product.id} className="hover:bg-gray-700/50 transition-colors group">
                                            {/* Serial Number */}
                                            <td className="px-3 py-4 text-center">
                                                <span className="w-7 h-7 inline-flex items-center justify-center rounded-full bg-gray-700 text-sm font-bold text-gray-300">
                                                    {serialNumber}
                                                </span>
                                            </td>
                                            {/* Quick Product Code */}
                                            <td className="px-3 py-4">
                                                <span
                                                    className={`px-2 py-1 rounded-md text-xs font-mono font-bold cursor-pointer transition-all ${copiedCode === quickCode
                                                            ? 'bg-green-600 text-white scale-105'
                                                            : 'bg-teal-900/30 text-teal-400 hover:bg-teal-800/50'
                                                        }`}
                                                    title="ক্লিক করে কপি করুন"
                                                    onClick={() => copyToClipboard(quickCode)}
                                                >
                                                    {copiedCode === quickCode ? '✓ কপি হয়েছে!' : quickCode}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-xl shadow-inner">
                                                        📦
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white group-hover:text-teal-400 transition-colors">{product.name}</p>
                                                        <p className="text-xs text-gray-500 font-mono">{product.sku || '---'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-white">
                                                {formatTaka(product.selling_price)}
                                                <span className="text-xs text-gray-500 font-normal ml-1">/{product.unit}</span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400">
                                                {formatTaka(product.purchase_price)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-white">{product.stock}</span>
                                                <span className="text-xs text-gray-500 ml-1">{product.unit}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${product.stock <= 0
                                                    ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                    : product.stock <= (product.alert_quantity || 10)
                                                        ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                        : 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                    }`}>
                                                    {product.stock <= 0 ? 'STOCK OUT' :
                                                        product.stock <= (product.alert_quantity || 10) ? 'LOW STOCK' : 'ACTIVE'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/products/${product.id}/edit`}
                                                    className="text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-lg transition-all"
                                                    title="Edit Product"
                                                >
                                                    ✏️
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {/* Simple Pagination */}
                    {products.links && (
                        <div className="p-4 border-t border-gray-700 flex justify-center">
                            <span className="text-sm text-gray-500">
                                দেখানো হচ্ছে {products.from} থেকে {products.to} (মোট {products.total})
                            </span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-800/50 rounded-2xl border border-dashed border-gray-700">
                    <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-4xl mb-4 animate-bounce-slow">
                        🔍
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">কোনো পণ্য পাওয়া যায়নি</h3>
                    <p className="text-gray-400 mb-6 max-w-sm text-center">আপনার সার্চের সাথে মিলে এমন কোনো পণ্য নেই অথবা এই ফিল্টারে কোনো পণ্য নেই।</p>
                    <button
                        onClick={() => { setSearchQuery(''); handleTabChange('all'); }}
                        className="px-6 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-all font-medium"
                    >
                        সকল ফিল্টার মুছুন
                    </button>
                </div>
            )}
        </DashboardLayout>
    );
}
