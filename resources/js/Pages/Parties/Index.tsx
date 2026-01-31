import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { PageProps, Party, PaginatedResponse } from '@/types';

interface PartiesProps extends PageProps {
    parties: PaginatedResponse<Party>;
    filters: { type?: string; search?: string };
    stats: {
        total: number;
        customers: number;
        suppliers: number;
        total_receivable: number;
        total_payable: number;
    };
}

export default function Parties({ parties, filters, stats }: PartiesProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [activeTab, setActiveTab] = useState<'all' | 'customer' | 'supplier'>(
        (filters.type as any) || 'all'
    );

    const partiesList = parties.data || [];

    const formatTaka = (amount: number) => '৳' + Math.abs(Number(amount || 0)).toLocaleString('bn-BD');

    // Handle search with debounce
    const handleSearch = (value: string) => {
        setSearchQuery(value);
        const timer = setTimeout(() => {
            router.get('/parties', {
                search: value || undefined,
                type: activeTab === 'all' ? undefined : activeTab
            }, { preserveState: true, replace: true });
        }, 500);
        return () => clearTimeout(timer);
    };

    // Handle tab change
    const handleTabChange = (tab: 'all' | 'customer' | 'supplier') => {
        setActiveTab(tab);
        router.get('/parties', {
            search: searchQuery || undefined,
            type: tab === 'all' ? undefined : tab
        }, { preserveState: true });
    };

    return (
        <DashboardLayout title="গ্রাহক ও সাপ্লায়ার">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">গ্রাহক ও সাপ্লায়ার</h1>
                    <p className="text-gray-400">কাস্টমার ও সাপ্লায়ার পরিচালনা করুন</p>
                </div>
                <Link
                    href="/parties/create"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium"
                    style={{ backgroundColor: '#006A4E' }}
                >
                    <span>➕</span>
                    <span>নতুন যোগ করুন</span>
                </Link>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">মোট</p>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <div
                    className={`bg-gray-800 rounded-xl p-4 border cursor-pointer transition-all ${activeTab === 'customer' ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700 hover:border-blue-600'}`}
                    onClick={() => handleTabChange('customer')}
                >
                    <p className="text-gray-400 text-sm">👤 গ্রাহক</p>
                    <p className="text-2xl font-bold text-blue-400">{stats.customers}</p>
                </div>
                <div
                    className={`bg-gray-800 rounded-xl p-4 border cursor-pointer transition-all ${activeTab === 'supplier' ? 'border-purple-500 bg-purple-900/20' : 'border-gray-700 hover:border-purple-600'}`}
                    onClick={() => handleTabChange('supplier')}
                >
                    <p className="text-gray-400 text-sm">🏭 সাপ্লায়ার</p>
                    <p className="text-2xl font-bold text-purple-400">{stats.suppliers}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">পাওনা/দেনা</p>
                    <div className="flex gap-2 mt-1">
                        <span className="text-green-400 text-sm font-bold">+{formatTaka(stats.total_receivable)}</span>
                        <span className="text-gray-500">/</span>
                        <span className="text-red-400 text-sm font-bold">-{formatTaka(stats.total_payable)}</span>
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-gray-800 p-3 rounded-xl border border-gray-700">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
                        value={searchQuery}
                        onChange={e => handleSearch(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                </div>
                <div className="flex gap-2 bg-gray-900 p-1 rounded-lg">
                    {[
                        { key: 'all', label: 'সব', icon: '📋' },
                        { key: 'customer', label: 'গ্রাহক', icon: '👤' },
                        { key: 'supplier', label: 'সাপ্লায়ার', icon: '🏭' },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => handleTabChange(tab.key as any)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab.key
                                ? 'bg-gray-700 text-white shadow'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Parties Table */}
            {partiesList.length > 0 ? (
                <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-300">
                            <thead className="bg-gray-900/50 text-xs uppercase font-semibold text-gray-400">
                                <tr>
                                    <th className="px-4 py-4 w-12 text-center">SL</th>
                                    <th className="px-4 py-4">নাম</th>
                                    <th className="px-4 py-4">ফোন</th>
                                    <th className="px-4 py-4">ধরন</th>
                                    <th className="px-4 py-4 text-right">ব্যালেন্স</th>
                                    <th className="px-4 py-4 text-right">অ্যাকশন</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {partiesList.map((party, index) => (
                                    <tr key={party.id} className="hover:bg-gray-700/50 transition-colors group">
                                        <td className="px-4 py-4 text-center">
                                            <span className="w-7 h-7 inline-flex items-center justify-center rounded-full bg-gray-700 text-sm font-bold text-gray-300">
                                                {(parties.from || 0) + index}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold ${party.type === 'customer' ? 'bg-blue-600' :
                                                        party.type === 'supplier' ? 'bg-purple-600' : 'bg-teal-600'
                                                    }`}>
                                                    {party.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white group-hover:text-teal-400 transition-colors">
                                                        {party.name}
                                                    </p>
                                                    {party.address && (
                                                        <p className="text-xs text-gray-500">{party.address}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="font-mono text-gray-300">{party.phone || '---'}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${party.type === 'customer'
                                                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                    : party.type === 'supplier'
                                                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                                        : 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                                                }`}>
                                                {party.type === 'customer' ? 'গ্রাহক' :
                                                    party.type === 'supplier' ? 'সাপ্লায়ার' : 'উভয়'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className={`font-bold ${Number(party.balance) > 0 ? 'text-green-400' :
                                                    Number(party.balance) < 0 ? 'text-red-400' : 'text-gray-400'
                                                }`}>
                                                {Number(party.balance) > 0 ? 'পাবেন ' :
                                                    Number(party.balance) < 0 ? 'দিবেন ' : ''}
                                                {formatTaka(party.balance)}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/parties/${party.id}`}
                                                    className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-teal-600 hover:text-white transition-all"
                                                    title="বিস্তারিত"
                                                >
                                                    👁️
                                                </Link>
                                                <Link
                                                    href={`/parties/${party.id}/edit`}
                                                    className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white transition-all"
                                                    title="এডিট"
                                                >
                                                    ✏️
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {parties.last_page > 1 && (
                        <div className="p-4 border-t border-gray-700 flex justify-center">
                            <span className="text-sm text-gray-500">
                                দেখানো হচ্ছে {parties.from} থেকে {parties.to} (মোট {parties.total})
                            </span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-800/50 rounded-2xl border border-dashed border-gray-700">
                    <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-4xl mb-4">
                        👥
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">কোনো গ্রাহক/সাপ্লায়ার পাওয়া যায়নি</h3>
                    <p className="text-gray-400 mb-6 max-w-sm text-center">
                        নতুন গ্রাহক বা সাপ্লায়ার যোগ করুন অথবা সার্চ ফিল্টার পরিবর্তন করুন
                    </p>
                    <Link
                        href="/parties/create"
                        className="px-6 py-3 rounded-xl text-white font-bold"
                        style={{ backgroundColor: '#006A4E' }}
                    >
                        ➕ নতুন যোগ করুন
                    </Link>
                </div>
            )}
        </DashboardLayout>
    );
}
