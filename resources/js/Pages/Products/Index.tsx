import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { PageProps, Product } from '@/types';

interface ProductsProps extends PageProps {
    products?: Product[];
}

export default function Products({ auth, products = [] }: ProductsProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStock, setFilterStock] = useState<'all' | 'low' | 'out'>('all');

    // Demo products
    const demoProducts: Product[] = products.length > 0 ? products : [
        { id: '1', business_id: '1', name: 'চাল (মিনিকেট)', sku: 'RICE001', unit: 'কেজি', purchase_price: 55, selling_price: 65, stock_quantity: 100, low_stock_threshold: 20, is_active: true, created_at: '', updated_at: '' },
        { id: '2', business_id: '1', name: 'সয়াবিন তেল', sku: 'OIL001', unit: 'লিটার', purchase_price: 180, selling_price: 200, stock_quantity: 15, low_stock_threshold: 10, is_active: true, created_at: '', updated_at: '' },
        { id: '3', business_id: '1', name: 'চিনি', sku: 'SUGAR001', unit: 'কেজি', purchase_price: 110, selling_price: 125, stock_quantity: 5, low_stock_threshold: 10, is_active: true, created_at: '', updated_at: '' },
        { id: '4', business_id: '1', name: 'ডাল (মসুর)', sku: 'DAL001', unit: 'কেজি', purchase_price: 120, selling_price: 140, stock_quantity: 0, low_stock_threshold: 15, is_active: true, created_at: '', updated_at: '' },
        { id: '5', business_id: '1', name: 'লবণ', sku: 'SALT001', unit: 'প্যাকেট', purchase_price: 25, selling_price: 35, stock_quantity: 50, low_stock_threshold: 20, is_active: true, created_at: '', updated_at: '' },
    ];

    const formatTaka = (amount: number) => '৳ ' + amount.toLocaleString('bn-BD');

    const filteredProducts = demoProducts.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStock = filterStock === 'all' ||
            (filterStock === 'low' && p.stock_quantity <= (p.low_stock_threshold || 10) && p.stock_quantity > 0) ||
            (filterStock === 'out' && p.stock_quantity === 0);
        return matchesSearch && matchesStock;
    });

    const totalValue = demoProducts.reduce((sum, p) => sum + (p.selling_price * p.stock_quantity), 0);
    const lowStockCount = demoProducts.filter(p => p.stock_quantity <= (p.low_stock_threshold || 10) && p.stock_quantity > 0).length;
    const outOfStockCount = demoProducts.filter(p => p.stock_quantity === 0).length;

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
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">মোট পণ্য</p>
                    <p className="text-2xl font-bold text-white">{demoProducts.length}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">মোট মূল্য</p>
                    <p className="text-2xl font-bold text-blue-400">{formatTaka(totalValue)}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">কম স্টক</p>
                    <p className="text-2xl font-bold text-yellow-400">{lowStockCount}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">স্টক আউট</p>
                    <p className="text-2xl font-bold text-red-400">{outOfStockCount}</p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="পণ্যের নাম বা কোড দিয়ে খুঁজুন..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border-0 text-white placeholder-gray-400"
                    />
                </div>
                <div className="flex gap-2">
                    {[
                        { key: 'all', label: 'সব' },
                        { key: 'low', label: 'কম স্টক' },
                        { key: 'out', label: 'স্টক আউট' },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setFilterStock(tab.key as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStock === tab.key
                                    ? 'text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            style={filterStock === tab.key ? { backgroundColor: '#006A4E' } : {}}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map(product => (
                    <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="bg-gray-800 rounded-2xl border border-gray-700 p-5 hover:border-gray-600 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-2xl">
                                📦
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock_quantity === 0
                                    ? 'bg-red-500/20 text-red-400'
                                    : product.stock_quantity <= (product.low_stock_threshold || 10)
                                        ? 'bg-yellow-500/20 text-yellow-400'
                                        : 'bg-green-500/20 text-green-400'
                                }`}>
                                {product.stock_quantity === 0 ? 'স্টক আউট' :
                                    product.stock_quantity <= (product.low_stock_threshold || 10) ? 'কম স্টক' : 'স্টকে আছে'}
                            </span>
                        </div>
                        <h3 className="font-semibold text-white mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-400 mb-3">{product.sku}</p>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs text-gray-500">বিক্রয় মূল্য</p>
                                <p className="font-bold text-white">{formatTaka(product.selling_price)}/{product.unit}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">মজুদ</p>
                                <p className="font-bold text-white">{product.stock_quantity} {product.unit}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </DashboardLayout>
    );
}
