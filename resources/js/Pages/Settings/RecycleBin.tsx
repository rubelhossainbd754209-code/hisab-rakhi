import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { PageProps } from '@/types';

interface RecycleBinItem {
    id: string;
    type: 'product' | 'transaction' | 'party' | 'invoice';
    type_label: string;
    name: string;
    details: string | null;
    deleted_at: string;
    days_remaining: number;
}

interface RecycleBinStats {
    products: number;
    transactions: number;
    parties: number;
    invoices: number;
    total: number;
}

interface RecycleBinProps extends PageProps {
    items: RecycleBinItem[];
    stats: RecycleBinStats;
}

export default function RecycleBin({ items, stats }: RecycleBinProps) {
    const [filter, setFilter] = useState<string>('all');
    const [processing, setProcessing] = useState<string | null>(null);
    const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);

    const filteredItems = filter === 'all'
        ? items
        : items.filter(item => item.type === filter);

    const handleRestore = (type: string, id: string) => {
        setProcessing(id);
        router.post(`/settings/recycle-bin/${type}/${id}/restore`, {}, {
            onFinish: () => setProcessing(null),
        });
    };

    const handleDelete = (type: string, id: string) => {
        if (!confirm('এই আইটেম স্থায়ীভাবে মুছে ফেলা হবে। আপনি কি নিশ্চিত?')) return;
        setProcessing(id);
        router.delete(`/settings/recycle-bin/${type}/${id}`, {
            onFinish: () => setProcessing(null),
        });
    };

    const handleEmptyAll = () => {
        setShowEmptyConfirm(false);
        router.delete('/settings/recycle-bin', {
            onFinish: () => setProcessing(null),
        });
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('bn-BD', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'product': return '📦';
            case 'transaction': return '💰';
            case 'party': return '👤';
            case 'invoice': return '🧾';
            default: return '📄';
        }
    };

    return (
        <DashboardLayout title="রিসাইকেল বিন">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">🗑️ রিসাইকেল বিন</h1>
                    <p className="text-gray-400">ডিলিট করা আইটেম ৬০ দিন পর্যন্ত এখানে থাকবে</p>
                </div>
                {stats.total > 0 && (
                    <button
                        onClick={() => setShowEmptyConfirm(true)}
                        className="px-4 py-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-medium"
                    >
                        🗑️ সব খালি করুন
                    </button>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                {[
                    { key: 'all', label: 'সব', count: stats.total, color: 'gray' },
                    { key: 'product', label: 'পণ্য', count: stats.products, color: 'blue' },
                    { key: 'transaction', label: 'লেনদেন', count: stats.transactions, color: 'green' },
                    { key: 'party', label: 'পার্টি', count: stats.parties, color: 'purple' },
                    { key: 'invoice', label: 'ইনভয়েস', count: stats.invoices, color: 'orange' },
                ].map(stat => (
                    <button
                        key={stat.key}
                        onClick={() => setFilter(stat.key)}
                        className={`p-3 rounded-xl border transition-all ${filter === stat.key
                                ? 'bg-gray-700 border-teal-500'
                                : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                            }`}
                    >
                        <p className="text-2xl font-bold text-white">{stat.count}</p>
                        <p className="text-xs text-gray-400">{stat.label}</p>
                    </button>
                ))}
            </div>

            {/* Items List */}
            {filteredItems.length > 0 ? (
                <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                    <div className="divide-y divide-gray-700">
                        {filteredItems.map(item => (
                            <div
                                key={`${item.type}-${item.id}`}
                                className="p-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gray-700 flex items-center justify-center text-2xl">
                                        {getTypeIcon(item.type)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{item.name}</p>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="px-2 py-0.5 rounded-full bg-gray-700 text-gray-400 text-xs">
                                                {item.type_label}
                                            </span>
                                            {item.details && (
                                                <span className="text-gray-500">{item.details}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm text-gray-400">{formatDate(item.deleted_at)}</p>
                                        <p className={`text-xs ${item.days_remaining <= 7 ? 'text-red-400' : 'text-gray-500'
                                            }`}>
                                            {item.days_remaining > 0
                                                ? `${item.days_remaining} দিন বাকি`
                                                : 'মেয়াদ শেষ'
                                            }
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleRestore(item.type, item.id)}
                                            disabled={processing === item.id}
                                            className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors disabled:opacity-50"
                                            title="পুনরুদ্ধার করুন"
                                        >
                                            ♻️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.type, item.id)}
                                            disabled={processing === item.id}
                                            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                                            title="স্থায়ীভাবে মুছুন"
                                        >
                                            ❌
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-800/50 rounded-2xl border border-dashed border-gray-700">
                    <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-4xl mb-4">
                        🗑️
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">রিসাইকেল বিন খালি</h3>
                    <p className="text-gray-400 max-w-sm text-center">
                        {filter !== 'all'
                            ? 'এই ক্যাটাগরিতে কোনো ডিলিট করা আইটেম নেই।'
                            : 'ডিলিট করা আইটেম এখানে দেখা যাবে এবং ৬০ দিন পর্যন্ত পুনরুদ্ধার করা যাবে।'
                        }
                    </p>
                </div>
            )}

            {/* Info Box */}
            <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start gap-3">
                    <span className="text-xl">ℹ️</span>
                    <div>
                        <p className="text-blue-400 font-medium">কিভাবে কাজ করে?</p>
                        <ul className="text-sm text-gray-400 mt-1 space-y-1">
                            <li>• যেকোনো আইটেম ডিলিট করলে এখানে আসবে</li>
                            <li>• ৬০ দিন পর্যন্ত পুনরুদ্ধার (♻️) করতে পারবেন</li>
                            <li>• ৬০ দিন পর অটোমেটিক স্থায়ীভাবে মুছে যাবে</li>
                            <li>• এখনই মুছতে চাইলে ❌ বাটনে ক্লিক করুন</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Empty Confirmation Modal */}
            {showEmptyConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-700 shadow-2xl">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                                <span className="text-4xl">⚠️</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">সব মুছে ফেলবেন?</h3>
                            <p className="text-gray-400 mb-4">
                                রিসাইকেল বিনের সব আইটেম ({stats.total} টি) স্থায়ীভাবে মুছে যাবে।
                                এই কাজটি ফিরিয়ে আনা যাবে না!
                            </p>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowEmptyConfirm(false)}
                                className="flex-1 px-4 py-3 rounded-xl bg-gray-700 text-white font-medium hover:bg-gray-600 transition-colors"
                            >
                                বাতিল
                            </button>
                            <button
                                onClick={handleEmptyAll}
                                className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                            >
                                হ্যাঁ, সব মুছুন
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
