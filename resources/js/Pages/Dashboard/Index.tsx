import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { PageProps, DashboardStats, Transaction } from '@/types';
import QuickActionsCustomizer from '@/Components/Dashboard/QuickActionsCustomizer';

interface DashboardProps extends PageProps {
    stats?: DashboardStats;
}

// Default quick actions
const defaultQuickActions = [
    { id: 'new_sale', name: 'নতুন বিক্রি', icon: '🛒', href: '/sales/create', color: 'bg-green-500', isVisible: true, order: 0 },
    { id: 'collect_due', name: 'বাকি আদায়', icon: '💰', href: '/payments/in', color: 'bg-blue-500', isVisible: true, order: 1 },
    { id: 'add_expense', name: 'খরচ যোগ', icon: '📝', href: '/expenses/create', color: 'bg-red-500', isVisible: true, order: 2 },
    { id: 'new_product', name: 'নতুন পণ্য', icon: '📦', href: '/products/create', color: 'bg-purple-500', isVisible: true, order: 3 },
    { id: 'new_invoice', name: 'নতুন বিল', icon: '🧾', href: '/invoices/create', color: 'bg-orange-500', isVisible: false, order: 4 },
    { id: 'new_party', name: 'নতুন পার্টি', icon: '👤', href: '/parties/create', color: 'bg-teal-500', isVisible: false, order: 5 },
    { id: 'new_purchase', name: 'নতুন কেনা', icon: '📥', href: '/purchases/create', color: 'bg-indigo-500', isVisible: false, order: 6 },
];

interface QuickAction {
    id: string;
    name: string;
    customName?: string;
    icon: string;
    href: string;
    color: string;
    isVisible: boolean;
    order: number;
}

// Format number as Bengali currency
const formatTaka = (amount: number): string => {
    return '৳ ' + amount.toLocaleString('bn-BD');
};

// Format date as Bengali
const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('bn-BD', {
        day: 'numeric',
        month: 'short',
    });
};

export default function Dashboard({ auth, stats }: DashboardProps) {
    const [isQuickActionsCustomizerOpen, setIsQuickActionsCustomizerOpen] = useState(false);

    // Load quick actions from localStorage or defaults
    const [quickActions, setQuickActions] = useState<QuickAction[]>(() => {
        const saved = typeof window !== 'undefined' ? localStorage.getItem('hisab_quick_actions') : null;
        return saved ? JSON.parse(saved) : defaultQuickActions;
    });

    // Handle quick actions save
    const handleQuickActionsSave = (actions: QuickAction[]) => {
        setQuickActions(actions);
        if (typeof window !== 'undefined') {
            localStorage.setItem('hisab_quick_actions', JSON.stringify(actions));
        }
    };

    // Get visible quick actions
    const visibleQuickActions = quickActions
        .filter(a => a.isVisible)
        .sort((a, b) => a.order - b.order)
        .slice(0, 4);

    // Default stats for demo
    const dashboardStats: DashboardStats = stats || {
        today_income: 15000,
        today_expense: 8500,
        today_profit: 6500,
        total_receivable: 45000,
        total_payable: 12000,
        low_stock_count: 5,
        pending_invoices: 3,
        recent_transactions: [],
    };

    const recentTransactions: Transaction[] = dashboardStats.recent_transactions.length > 0
        ? dashboardStats.recent_transactions
        : [
            { id: '1', business_id: '1', type: 'sale', amount: 2500, description: 'নগদ বিক্রি', transaction_date: '2026-01-15', created_at: '', updated_at: '' },
            { id: '2', business_id: '1', type: 'expense', amount: 500, description: 'বিদ্যুৎ বিল', transaction_date: '2026-01-15', created_at: '', updated_at: '' },
            { id: '3', business_id: '1', type: 'payment_in', amount: 3000, description: 'রহিম সাহেব - বাকি', transaction_date: '2026-01-15', party: { id: '1', business_id: '1', name: 'রহিম সাহেব', type: 'customer', balance: 5000, is_active: true, created_at: '', updated_at: '' }, created_at: '', updated_at: '' },
            { id: '4', business_id: '1', type: 'purchase', amount: 8000, description: 'মাল কেনা - পাইকারি', transaction_date: '2026-01-14', created_at: '', updated_at: '' },
        ];

    return (
        <DashboardLayout title="ড্যাশবোর্ড">
            {/* Quick Actions Customizer Modal */}
            <QuickActionsCustomizer
                isOpen={isQuickActionsCustomizerOpen}
                onClose={() => setIsQuickActionsCustomizerOpen(false)}
                actions={quickActions}
                onSave={handleQuickActionsSave}
            />

            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">
                    স্বাগতম, {auth.user?.name?.split(' ')[0] || 'ব্যবহারকারী'}! 👋
                </h1>
                <p className="text-gray-400 mt-1">
                    আজকের তারিখ: {new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-2xl">
                            💵
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">আজকের আয়</p>
                            <p className="text-xl font-bold text-white">{formatTaka(dashboardStats.today_income)}</p>
                            <p className="text-xs text-green-400">↑ 12%</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center text-2xl">
                            💸
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">আজকের খরচ</p>
                            <p className="text-xl font-bold text-white">{formatTaka(dashboardStats.today_expense)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl">
                            📥
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">মোট পাওনা</p>
                            <p className="text-xl font-bold text-white">{formatTaka(dashboardStats.total_receivable)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center text-2xl">
                            📤
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">মোট দেনা</p>
                            <p className="text-xl font-bold text-white">{formatTaka(dashboardStats.total_payable)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">
                        দ্রুত কাজ
                    </h2>
                    <button
                        onClick={() => setIsQuickActionsCustomizerOpen(true)}
                        className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
                    >
                        ✏️ কাস্টমাইজ
                    </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {visibleQuickActions.map((action) => (
                        <Link
                            key={action.id}
                            href={action.href}
                            className="flex flex-col items-center gap-3 p-5 bg-gray-800 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:-translate-y-1"
                        >
                            <div className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center text-2xl text-white`}>
                                {action.icon}
                            </div>
                            <span className="font-medium text-gray-200 text-center">
                                {action.customName || action.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Transactions */}
                <div className="lg:col-span-2">
                    <div className="bg-gray-800 rounded-2xl border border-gray-700">
                        <div className="flex items-center justify-between p-5 border-b border-gray-700">
                            <h3 className="font-semibold text-white">সাম্প্রতিক লেনদেন</h3>
                            <Link href="/transactions" className="text-sm hover:underline" style={{ color: '#34D399' }}>
                                সব দেখুন →
                            </Link>
                        </div>
                        <div className="p-4 space-y-3">
                            {recentTransactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${transaction.type === 'sale' || transaction.type === 'payment_in' || transaction.type === 'income'
                                                    ? 'bg-green-500/20'
                                                    : 'bg-red-500/20'
                                                }`}
                                        >
                                            {transaction.type === 'sale' ? '🛒' :
                                                transaction.type === 'payment_in' ? '💰' :
                                                    transaction.type === 'expense' ? '📝' :
                                                        transaction.type === 'purchase' ? '📦' : '💵'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">
                                                {transaction.description}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                {transaction.party?.name && `${transaction.party.name} • `}
                                                {formatDate(transaction.transaction_date)}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`font-semibold ${transaction.type === 'sale' || transaction.type === 'payment_in' || transaction.type === 'income'
                                                ? 'text-green-400'
                                                : 'text-red-400'
                                            }`}
                                    >
                                        {transaction.type === 'sale' || transaction.type === 'payment_in' || transaction.type === 'income'
                                            ? '+'
                                            : '-'}
                                        {formatTaka(transaction.amount)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Alerts */}
                    <div className="bg-gray-800 rounded-2xl border border-gray-700 p-5">
                        <h3 className="font-semibold text-white mb-4">⚠️ সতর্কতা</h3>
                        <div className="space-y-3">
                            {dashboardStats.low_stock_count > 0 && (
                                <Link
                                    href="/products?filter=low_stock"
                                    className="flex items-center gap-3 p-3 bg-yellow-500/10 text-yellow-400 rounded-xl hover:bg-yellow-500/20 transition-colors"
                                >
                                    <span className="text-xl">📦</span>
                                    <div className="flex-1">
                                        <p className="font-medium">{dashboardStats.low_stock_count}টি পণ্য কম</p>
                                        <p className="text-xs opacity-75">স্টক আপডেট করুন</p>
                                    </div>
                                    <span>→</span>
                                </Link>
                            )}
                            {dashboardStats.pending_invoices > 0 && (
                                <Link
                                    href="/invoices?status=pending"
                                    className="flex items-center gap-3 p-3 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-colors"
                                >
                                    <span className="text-xl">🧾</span>
                                    <div className="flex-1">
                                        <p className="font-medium">{dashboardStats.pending_invoices}টি বিল বাকি</p>
                                        <p className="text-xs opacity-75">পেমেন্ট নিন</p>
                                    </div>
                                    <span>→</span>
                                </Link>
                            )}
                            {dashboardStats.low_stock_count === 0 && dashboardStats.pending_invoices === 0 && (
                                <p className="text-gray-400 text-sm text-center py-4">
                                    ✅ কোনো সতর্কতা নেই
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Today's Summary */}
                    <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #006A4E 0%, #004A36 100%)' }}>
                        <h3 className="text-lg font-semibold mb-4">📊 আজকের সারসংক্ষেপ</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="opacity-80">মোট আয়</span>
                                <span className="font-bold">{formatTaka(dashboardStats.today_income)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="opacity-80">মোট খরচ</span>
                                <span className="font-bold">{formatTaka(dashboardStats.today_expense)}</span>
                            </div>
                            <hr className="border-white/20" />
                            <div className="flex justify-between items-center">
                                <span className="font-medium">নীট লাভ</span>
                                <span className="text-xl font-bold">
                                    {formatTaka(dashboardStats.today_income - dashboardStats.today_expense)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
