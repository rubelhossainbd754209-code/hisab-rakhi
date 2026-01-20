import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { PageProps, Transaction } from '@/types';

interface TransactionsProps extends PageProps {
    transactions?: Transaction[];
}

export default function Transactions({ auth, transactions = [] }: TransactionsProps) {
    const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense'>('all');
    const [dateFilter, setDateFilter] = useState('today');

    // Demo transactions
    const demoTransactions: Transaction[] = transactions.length > 0 ? transactions : [
        { id: '1', business_id: '1', type: 'sale', amount: 5500, description: 'নগদ বিক্রি - চাল ও ডাল', transaction_date: '2026-01-15', created_at: '', updated_at: '' },
        { id: '2', business_id: '1', type: 'expense', amount: 1200, description: 'দোকান ভাড়া', transaction_date: '2026-01-15', created_at: '', updated_at: '' },
        { id: '3', business_id: '1', type: 'payment_in', amount: 3000, description: 'করিম সাহেব - বাকি আদায়', transaction_date: '2026-01-15', party: { id: '1', business_id: '1', name: 'করিম সাহেব', type: 'customer', balance: 2000, is_active: true, created_at: '', updated_at: '' }, created_at: '', updated_at: '' },
        { id: '4', business_id: '1', type: 'purchase', amount: 15000, description: 'পাইকারি মাল কেনা', transaction_date: '2026-01-14', created_at: '', updated_at: '' },
        { id: '5', business_id: '1', type: 'sale', amount: 2800, description: 'নগদ বিক্রি', transaction_date: '2026-01-14', created_at: '', updated_at: '' },
    ];

    const formatTaka = (amount: number) => '৳ ' + amount.toLocaleString('bn-BD');

    const filteredTransactions = demoTransactions.filter(t => {
        if (activeTab === 'income') return ['sale', 'payment_in', 'income'].includes(t.type);
        if (activeTab === 'expense') return ['expense', 'purchase', 'payment_out'].includes(t.type);
        return true;
    });

    return (
        <DashboardLayout title="দৈনিক হিসাব">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">দৈনিক হিসাব</h1>
                    <p className="text-gray-400">আজকের সব লেনদেন দেখুন ও পরিচালনা করুন</p>
                </div>
                <Link
                    href="/transactions/create"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium"
                    style={{ backgroundColor: '#006A4E' }}
                >
                    <span>➕</span>
                    <span>নতুন লেনদেন</span>
                </Link>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">মোট আয়</p>
                    <p className="text-2xl font-bold text-green-400">{formatTaka(11300)}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">মোট খরচ</p>
                    <p className="text-2xl font-bold text-red-400">{formatTaka(16200)}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">নীট</p>
                    <p className="text-2xl font-bold text-blue-400">{formatTaka(-4900)}</p>
                </div>
            </div>

            {/* Filters & Tabs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex gap-2">
                    {[
                        { key: 'all', label: 'সব' },
                        { key: 'income', label: 'আয়' },
                        { key: 'expense', label: 'ব্যয়' },
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
                <select
                    value={dateFilter}
                    onChange={e => setDateFilter(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-gray-700 border-0 text-white text-sm"
                >
                    <option value="today">আজ</option>
                    <option value="week">এই সপ্তাহ</option>
                    <option value="month">এই মাস</option>
                    <option value="custom">কাস্টম</option>
                </select>
            </div>

            {/* Transactions List */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700">
                <div className="divide-y divide-gray-700">
                    {filteredTransactions.map(transaction => (
                        <div key={transaction.id} className="p-4 hover:bg-gray-700/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${['sale', 'payment_in', 'income'].includes(transaction.type)
                                            ? 'bg-green-500/20'
                                            : 'bg-red-500/20'
                                        }`}>
                                        {transaction.type === 'sale' ? '🛒' :
                                            transaction.type === 'payment_in' ? '💰' :
                                                transaction.type === 'expense' ? '📝' :
                                                    transaction.type === 'purchase' ? '📦' : '💵'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{transaction.description}</p>
                                        <p className="text-sm text-gray-400">
                                            {transaction.party?.name && `${transaction.party.name} • `}
                                            {new Date(transaction.transaction_date).toLocaleDateString('bn-BD')}
                                        </p>
                                    </div>
                                </div>
                                <span className={`font-semibold ${['sale', 'payment_in', 'income'].includes(transaction.type)
                                        ? 'text-green-400'
                                        : 'text-red-400'
                                    }`}>
                                    {['sale', 'payment_in', 'income'].includes(transaction.type) ? '+' : '-'}
                                    {formatTaka(transaction.amount)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
