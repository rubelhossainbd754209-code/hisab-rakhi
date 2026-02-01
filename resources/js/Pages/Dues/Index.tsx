import { useState } from 'react';
import { router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { PageProps } from '@/types';
import AddDueModal from '@/Components/Modals/AddDueModal';
import CollectDueModal from '@/Components/Modals/CollectDueModal';
import ShareDueModal from '@/Components/Modals/ShareDueModal';
import EditDueModal from '@/Components/Modals/EditDueModal';
import DueHistoryModal from '@/Components/Modals/DueHistoryModal';

interface Party {
    id: string;
    name: string;
    phone: string | null;
    address: string | null;
    balance?: number;
}

interface Product {
    id: string;
    name: string;
    sku: string | null;
    selling_price: number;
    stock: number;
    unit: string;
}

interface DueItem {
    type: 'product' | 'custom';
    product_id?: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
}

interface Due {
    id: string | null;
    party: Party;
    items: DueItem[];
    total_amount: number;
    paid_amount: number;
    due_amount: number;
    due_date: string | null;
    status: 'pending' | 'partial' | 'paid';
    days_ago: number;
    created_at: string | null;
    is_party_balance?: boolean;
}

interface DuesPageProps extends PageProps {
    dues: Due[];
    products: Product[];
    customers: Party[];
    stats: {
        total_due: number;
        total_customers: number;
    };
}

export default function DuesIndex({ dues, products, customers, stats }: DuesPageProps) {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | '7days' | '30days' | '90days'>('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [collectDue, setCollectDue] = useState<Due | null>(null);
    const [shareDue, setShareDue] = useState<Due | null>(null);
    const [editDue, setEditDue] = useState<Due | null>(null);
    const [historyDue, setHistoryDue] = useState<Due | null>(null);

    // Handle delete
    const handleDelete = (due: Due) => {
        if (!due.id) return;
        if (confirm(`"${due.party.name}" এর বাকি ৳${due.due_amount.toLocaleString()} মুছে ফেলতে চান?`)) {
            router.delete(`/dues/${due.id}`, {
                preserveScroll: true,
            });
        }
    };

    // Filter dues
    const filteredDues = dues.filter(due => {
        // Search filter
        if (search) {
            const searchLower = search.toLowerCase();
            const matchName = due.party.name.toLowerCase().includes(searchLower);
            const matchPhone = due.party.phone?.includes(search);
            if (!matchName && !matchPhone) return false;
        }

        // Time filter
        if (filter === '7days' && due.days_ago < 7) return false;
        if (filter === '30days' && due.days_ago < 30) return false;
        if (filter === '90days' && due.days_ago < 90) return false;

        return true;
    });

    return (
        <DashboardLayout title="বাকি হিসাব">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">💰 বাকি হিসাব</h1>
                    <p className="text-gray-400">গ্রাহকদের বাকি তালিকা ও আদায়</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium hover:from-teal-600 hover:to-cyan-600 transition-all flex items-center gap-2"
                >
                    ➕ নতুন বাকি
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-2xl">
                            💸
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">মোট বাকি</p>
                            <p className="text-2xl font-bold text-white">৳{stats.total_due.toLocaleString('bn-BD')}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">
                            👥
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">বাকিদার</p>
                            <p className="text-2xl font-bold text-white">{stats.total_customers} জন</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                    <input
                        type="text"
                        placeholder="নাম বা ফোন দিয়ে খুঁজুন..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    {[
                        { key: 'all', label: 'সব' },
                        { key: '7days', label: '৭ দিন+' },
                        { key: '30days', label: '১ মাস+' },
                        { key: '90days', label: '৩ মাস+' },
                    ].map(f => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key as typeof filter)}
                            className={`px-4 py-2 rounded-xl font-medium transition-colors ${filter === f.key
                                ? 'bg-teal-500 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Dues List */}
            {filteredDues.length > 0 ? (
                <div className="space-y-3">
                    {filteredDues.map((due, index) => (
                        <div
                            key={due.id || `party-${due.party.id}`}
                            className="bg-gray-800 rounded-2xl border border-gray-700 p-4 hover:border-gray-600 transition-colors"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                {/* Left side - Avatar and info */}
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center text-xl font-bold text-red-400 flex-shrink-0">
                                        {due.party.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold text-white truncate">{due.party.name}</h3>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400">
                                            {due.party.phone && (
                                                <span className="truncate">📱 {due.party.phone}</span>
                                            )}
                                            {due.days_ago > 0 && (
                                                <span className={`${due.days_ago >= 30 ? 'text-red-400' : due.days_ago >= 7 ? 'text-orange-400' : ''}`}>
                                                    {due.days_ago} দিন আগে
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Right side - Amount */}
                                <div className="flex items-center justify-between sm:justify-end gap-4">
                                    <div className="text-left sm:text-right">
                                        <p className="text-xl font-bold text-red-400">
                                            ৳{due.due_amount.toLocaleString('bn-BD')}
                                        </p>
                                        {due.paid_amount > 0 && (
                                            <p className="text-xs text-gray-500">
                                                আদায়: ৳{due.paid_amount.toLocaleString('bn-BD')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                <button
                                    onClick={() => setHistoryDue(due)}
                                    className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
                                    title="বিস্তারিত দেখুন"
                                >
                                    📜
                                </button>
                                <button
                                    onClick={() => setEditDue(due)}
                                    className="p-2.5 rounded-xl bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors"
                                    title="এডিট করুন"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleDelete(due)}
                                    className="p-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                    title="মুছে ফেলুন"
                                >
                                    🗑️
                                </button>
                                <button
                                    onClick={() => setShareDue(due)}
                                    className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                                    title="শেয়ার করুন"
                                >
                                    📤
                                </button>
                                <button
                                    onClick={() => setCollectDue(due)}
                                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors font-medium"
                                >
                                    💰 আদায়
                                </button>
                            </div>

                            {/* Items Preview */}
                            {due.items && due.items.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-700">
                                    <div className="flex flex-wrap gap-2">
                                        {due.items.slice(0, 3).map((item: any, i: number) => (
                                            <span
                                                key={i}
                                                className="px-2 py-1 rounded-lg bg-gray-700 text-xs text-gray-300"
                                            >
                                                {item.name} {item.quantity > 1 && `x${item.quantity}`}
                                            </span>
                                        ))}
                                        {due.items.length > 3 && (
                                            <span className="px-2 py-1 text-xs text-gray-500">
                                                +{due.items.length - 3} আরও
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-800/50 rounded-2xl border border-dashed border-gray-700">
                    <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-4xl mb-4">
                        ✅
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">কোনো বাকি নেই!</h3>
                    <p className="text-gray-400 max-w-sm text-center">
                        {search || filter !== 'all'
                            ? 'আপনার সার্চ অনুযায়ী কোনো বাকিদার পাওয়া যায়নি।'
                            : 'এখন পর্যন্ত কোনো গ্রাহকের বাকি নেই।'
                        }
                    </p>
                </div>
            )}

            {/* Modals */}
            {
                showAddModal && (
                    <AddDueModal
                        customers={customers}
                        products={products}
                        onClose={() => setShowAddModal(false)}
                    />
                )
            }

            {
                collectDue && (
                    <CollectDueModal
                        due={collectDue}
                        onClose={() => setCollectDue(null)}
                    />
                )
            }

            {
                shareDue && (
                    <ShareDueModal
                        due={shareDue}
                        onClose={() => setShareDue(null)}
                    />
                )
            }

            {
                editDue && (
                    <EditDueModal
                        due={editDue}
                        products={products}
                        onClose={() => setEditDue(null)}
                    />
                )
            }

            {
                historyDue && (
                    <DueHistoryModal
                        due={historyDue}
                        onClose={() => setHistoryDue(null)}
                    />
                )
            }
        </DashboardLayout >
    );
}
