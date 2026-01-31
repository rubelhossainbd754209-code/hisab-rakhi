import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { PageProps } from '@/types';

interface TransactionItem {
    id: string;
    type: string;
    amount: number;
    description: string;
    party?: { name: string } | null;
    transaction_date: string;
    source: 'transaction' | 'invoice';
    invoice_id?: string;
    paid_amount?: number;
    due_amount?: number;
    status?: string;
}

interface Summary {
    total_income: number;
    total_expense: number;
    net: number;
    total_due: number;
    total_paid: number;
    invoice_count: number;
}

interface TransactionsProps extends PageProps {
    transactions?: TransactionItem[];
    summary?: Summary;
    filter?: string;
}

export default function Transactions({ auth, transactions = [], summary, filter = 'today' }: TransactionsProps) {
    const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense'>('all');
    const [dateFilter, setDateFilter] = useState(filter);

    const formatTaka = (amount: number) => '৳ ' + amount.toLocaleString('bn-BD');

    const handleFilterChange = (newFilter: string) => {
        setDateFilter(newFilter);
        router.get('/transactions', { filter: newFilter }, { preserveState: true });
    };

    const filteredTransactions = transactions.filter(t => {
        if (activeTab === 'income') return ['sale', 'payment_in', 'income'].includes(t.type);
        if (activeTab === 'expense') return ['expense', 'purchase', 'payment_out'].includes(t.type);
        return true;
    });

    const getFilterLabel = () => {
        switch (dateFilter) {
            case 'today': return 'আজকের';
            case 'week': return 'এই সপ্তাহের';
            case 'month': return 'এই মাসের';
            case 'year': return 'এই বছরের';
            default: return 'আজকের';
        }
    };

    return (
        <DashboardLayout title="দৈনিক হিসাব">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">দৈনিক হিসাব</h1>
                    <p className="text-gray-400">{getFilterLabel()} সব লেনদেন দেখুন ও পরিচালনা করুন</p>
                </div>
                <Link
                    href="/invoices/create"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-medium shadow-lg transition-all hover:scale-105"
                    style={{ backgroundColor: '#006A4E' }}
                >
                    <span className="text-xl">🧾</span>
                    <span>নতুন বিল তৈরি করুন</span>
                </Link>
            </div>

            {/* Summary Cards - 4 cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* মোট আয় */}
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-xl">
                            💵
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">মোট আয়</p>
                            <p className="text-xl font-bold text-green-400">{formatTaka(summary?.total_income || 0)}</p>
                        </div>
                    </div>
                </div>

                {/* মোট খরচ */}
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center text-xl">
                            💸
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">মোট খরচ</p>
                            <p className="text-xl font-bold text-red-400">{formatTaka(summary?.total_expense || 0)}</p>
                        </div>
                    </div>
                </div>

                {/* বাকি পাওনা */}
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center text-xl">
                            📋
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">বাকি পাওনা</p>
                            <p className="text-xl font-bold text-yellow-400">{formatTaka(summary?.total_due || 0)}</p>
                        </div>
                    </div>
                </div>

                {/* নীট লাভ/লোকসান */}
                <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl p-4 border border-green-700/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/30 rounded-lg flex items-center justify-center text-xl">
                            📊
                        </div>
                        <div>
                            <p className="text-gray-300 text-sm">{getFilterLabel()} নীট হিসাব</p>
                            <p className={`text-xl font-bold ${(summary?.net || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {(summary?.net || 0) >= 0 ? '+' : ''}{formatTaka(summary?.net || 0)}
                            </p>
                        </div>
                    </div>
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
                    onChange={e => handleFilterChange(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-gray-700 border-0 text-white text-sm"
                >
                    <option value="today">আজ</option>
                    <option value="week">এই সপ্তাহ</option>
                    <option value="month">এই মাস</option>
                    <option value="year">এই বছর</option>
                </select>
            </div>

            {/* Invoice Count Badge */}
            {summary?.invoice_count && summary.invoice_count > 0 && (
                <div className="mb-4 flex items-center gap-2">
                    <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg text-sm">
                        🧾 আজকে {summary.invoice_count}টি বিল তৈরি হয়েছে
                    </span>
                </div>
            )}

            {/* Transactions List */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700">
                <div className="divide-y divide-gray-700">
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map(transaction => (
                            <div
                                key={transaction.id}
                                className="p-4 hover:bg-gray-700/50 transition-colors cursor-pointer"
                                onClick={() => {
                                    if (transaction.source === 'invoice' && transaction.invoice_id) {
                                        router.visit(`/invoices/${transaction.invoice_id}`);
                                    }
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${['sale', 'payment_in', 'income'].includes(transaction.type)
                                            ? 'bg-green-500/20'
                                            : 'bg-red-500/20'
                                            }`}>
                                            {transaction.source === 'invoice' ? '🧾' :
                                                transaction.type === 'sale' ? '🛒' :
                                                    transaction.type === 'payment_in' ? '💰' :
                                                        transaction.type === 'expense' ? '📝' :
                                                            transaction.type === 'purchase' ? '📦' : '💵'}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-white">{transaction.description}</p>
                                                {transaction.source === 'invoice' && (
                                                    <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-xs">
                                                        বিল
                                                    </span>
                                                )}
                                                {transaction.status === 'unpaid' && (
                                                    <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-xs">
                                                        বাকি
                                                    </span>
                                                )}
                                                {transaction.status === 'partial' && (
                                                    <span className="bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded text-xs">
                                                        আংশিক
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-400">
                                                {transaction.party?.name && `${transaction.party.name} • `}
                                                {new Date(transaction.transaction_date).toLocaleDateString('bn-BD')}
                                                {transaction.due_amount && transaction.due_amount > 0 && (
                                                    <span className="text-yellow-400 ml-2">
                                                        (বাকি: {formatTaka(transaction.due_amount)})
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`font-semibold ${['sale', 'payment_in', 'income'].includes(transaction.type)
                                            ? 'text-green-400'
                                            : 'text-red-400'
                                            }`}>
                                            {['sale', 'payment_in', 'income'].includes(transaction.type) ? '+' : '-'}
                                            {formatTaka(transaction.amount)}
                                        </span>
                                        {transaction.source === 'invoice' && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                পেমেন্ট: {formatTaka(transaction.paid_amount || 0)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center">
                            <div className="text-4xl mb-3">📋</div>
                            <p className="text-gray-400">{getFilterLabel()} কোনো লেনদেন নেই</p>
                            <Link
                                href="/invoices/create"
                                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-white text-sm"
                                style={{ backgroundColor: '#006A4E' }}
                            >
                                <span>🧾</span>
                                <span>প্রথম বিল তৈরি করুন</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
