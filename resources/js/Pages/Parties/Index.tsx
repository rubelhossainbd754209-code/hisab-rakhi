import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { PageProps, Party } from '@/types';

interface PartiesProps extends PageProps {
    parties?: Party[];
}

export default function Parties({ auth, parties = [] }: PartiesProps) {
    const [activeTab, setActiveTab] = useState<'all' | 'customers' | 'suppliers'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Demo parties
    const demoParties: Party[] = parties.length > 0 ? parties : [
        { id: '1', business_id: '1', name: 'করিম সাহেব', phone: '01712345678', type: 'customer', balance: 5000, is_active: true, created_at: '', updated_at: '' },
        { id: '2', business_id: '1', name: 'রহিম ট্রেডার্স', phone: '01812345678', type: 'supplier', balance: -12000, is_active: true, created_at: '', updated_at: '' },
        { id: '3', business_id: '1', name: 'জামাল উদ্দিন', phone: '01912345678', type: 'customer', balance: 2500, is_active: true, created_at: '', updated_at: '' },
        { id: '4', business_id: '1', name: 'আলী এন্টারপ্রাইজ', phone: '01612345678', type: 'supplier', balance: -8000, is_active: true, created_at: '', updated_at: '' },
        { id: '5', business_id: '1', name: 'সালমা বেগম', phone: '01512345678', type: 'customer', balance: 0, is_active: true, created_at: '', updated_at: '' },
    ];

    const formatTaka = (amount: number) => '৳ ' + Math.abs(amount).toLocaleString('bn-BD');

    const filteredParties = demoParties.filter(p => {
        const matchesTab = activeTab === 'all' ||
            (activeTab === 'customers' && p.type === 'customer') ||
            (activeTab === 'suppliers' && p.type === 'supplier');
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.phone?.includes(searchQuery);
        return matchesTab && matchesSearch;
    });

    const totalReceivable = demoParties.filter(p => p.balance > 0).reduce((sum, p) => sum + p.balance, 0);
    const totalPayable = demoParties.filter(p => p.balance < 0).reduce((sum, p) => sum + Math.abs(p.balance), 0);

    return (
        <DashboardLayout title="পার্টি">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">পার্টি</h1>
                    <p className="text-gray-400">কাস্টমার ও সাপ্লায়ার পরিচালনা</p>
                </div>
                <Link
                    href="/parties/create"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium"
                    style={{ backgroundColor: '#006A4E' }}
                >
                    <span>➕</span>
                    <span>নতুন পার্টি</span>
                </Link>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">মোট পার্টি</p>
                    <p className="text-2xl font-bold text-white">{demoParties.length}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">মোট পাওনা</p>
                    <p className="text-2xl font-bold text-green-400">{formatTaka(totalReceivable)}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">মোট দেনা</p>
                    <p className="text-2xl font-bold text-red-400">{formatTaka(totalPayable)}</p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border-0 text-white placeholder-gray-400"
                    />
                </div>
                <div className="flex gap-2">
                    {[
                        { key: 'all', label: 'সব' },
                        { key: 'customers', label: 'কাস্টমার' },
                        { key: 'suppliers', label: 'সাপ্লায়ার' },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.key
                                    ? 'text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            style={activeTab === tab.key ? { backgroundColor: '#006A4E' } : {}}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Parties List */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700">
                <div className="divide-y divide-gray-700">
                    {filteredParties.map(party => (
                        <Link
                            key={party.id}
                            href={`/parties/${party.id}`}
                            className="block p-4 hover:bg-gray-700/50 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-semibold ${party.type === 'customer' ? 'bg-blue-500' : 'bg-purple-500'
                                        }`}>
                                        {party.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{party.name}</p>
                                        <p className="text-sm text-gray-400">
                                            {party.phone} • {party.type === 'customer' ? 'কাস্টমার' : 'সাপ্লায়ার'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-semibold ${party.balance > 0 ? 'text-green-400' :
                                            party.balance < 0 ? 'text-red-400' : 'text-gray-400'
                                        }`}>
                                        {party.balance > 0 ? 'পাবেন' : party.balance < 0 ? 'দিবেন' : 'সমান'}
                                    </p>
                                    <p className="text-lg font-bold text-white">{formatTaka(party.balance)}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
