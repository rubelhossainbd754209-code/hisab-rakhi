import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

interface Business {
    id: number;
    name: string;
    slug: string;
    phone?: string;
    owner?: {
        name: string;
        email: string;
    };
    category?: string;
    category_icon?: string;
    subscription?: {
        id: number;
        plan: string;
        is_trial: boolean;
        expires_at: string;
        expires_at_raw: string;
        days_remaining: number;
        status: string;
        is_unlimited: boolean;
    };
    status: string;
    created_at: string;
}

interface Plan {
    id: number;
    name: string;
    duration_days: number;
    is_trial: boolean;
}

interface Props {
    businesses: {
        data: Business[];
        current_page: number;
        last_page: number;
        total: number;
    };
    stats: {
        total_businesses: number;
        active_trials: number;
        premium_subscriptions: number;
        expired: number;
    };
    filter?: string;
    search?: string;
    plans: Plan[];
}

export default function SubscriptionIndex({ businesses, stats, filter, search, plans }: Props) {
    const [searchQuery, setSearchQuery] = useState(search || '');
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
    const [modalType, setModalType] = useState<'extend' | 'assign' | null>(null);
    const [daysToAdd, setDaysToAdd] = useState(30);
    const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
    const [customDuration, setCustomDuration] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/subscriptions', { search: searchQuery, filter }, { preserveState: true });
    };

    const handleFilter = (newFilter: string) => {
        router.get('/admin/subscriptions', { filter: newFilter, search: searchQuery }, { preserveState: true });
    };

    const openExtendModal = (business: Business) => {
        setSelectedBusiness(business);
        setModalType('extend');
        setDaysToAdd(30);
    };

    const openAssignModal = (business: Business) => {
        setSelectedBusiness(business);
        setModalType('assign');
        setSelectedPlanId(plans.length > 0 ? plans[0].id : null);
        setCustomDuration(null);
    };

    const closeModal = () => {
        setSelectedBusiness(null);
        setModalType(null);
    };

    const handleExtend = (action: 'add' | 'subtract') => {
        if (!selectedBusiness) return;
        setProcessing(true);
        router.post(`/admin/subscriptions/business/${selectedBusiness.id}/extend`, {
            days: daysToAdd,
            action: action,
        }, {
            onFinish: () => {
                setProcessing(false);
                closeModal();
            }
        });
    };

    const handleSetUnlimited = (business: Business) => {
        if (confirm(`"${business.name}" বিজনেসকে আনলিমিটেড সাবস্ক্রিপশন দিতে চান?`)) {
            router.post(`/admin/subscriptions/business/${business.id}/unlimited`);
        }
    };

    const handleRevoke = (business: Business) => {
        if (confirm(`"${business.name}" এর সাবস্ক্রিপশন বাতিল করতে চান?`)) {
            router.post(`/admin/subscriptions/business/${business.id}/revoke`);
        }
    };

    const handleAssignPlan = () => {
        if (!selectedBusiness || !selectedPlanId) return;
        setProcessing(true);
        router.post(`/admin/subscriptions/business/${selectedBusiness.id}/assign`, {
            plan_id: selectedPlanId,
            duration_days: customDuration,
        }, {
            onFinish: () => {
                setProcessing(false);
                closeModal();
            }
        });
    };

    const getStatusBadge = (business: Business) => {
        if (business.subscription?.is_unlimited) {
            return <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">♾️ আনলিমিটেড</span>;
        }
        switch (business.status) {
            case 'trial':
                return <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-medium">🎁 ট্রায়াল</span>;
            case 'premium':
                return <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">⭐ প্রিমিয়াম</span>;
            case 'expired':
                return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">⛔ মেয়াদোত্তীর্ণ</span>;
            case 'grace':
                return <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium">⏳ গ্রেস</span>;
            default:
                return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium">❓ নেই</span>;
        }
    };

    return (
        <AdminLayout>
            <Head title="সাবস্ক্রিপশন ম্যানেজমেন্ট" />

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">সাবস্ক্রিপশন ম্যানেজমেন্ট</h1>
                <p className="text-gray-400">সকল বিজনেসের সাবস্ক্রিপশন দেখুন ও পরিচালনা করুন</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">মোট বিজনেস</p>
                    <p className="text-2xl font-bold text-white">{stats.total_businesses}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">ট্রায়াল</p>
                    <p className="text-2xl font-bold text-amber-400">{stats.active_trials}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">প্রিমিয়াম</p>
                    <p className="text-2xl font-bold text-emerald-400">{stats.premium_subscriptions}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">মেয়াদোত্তীর্ণ</p>
                    <p className="text-2xl font-bold text-red-400">{stats.expired}</p>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="বিজনেস বা মালিকের নাম/ইমেইল খুঁজুন..."
                                className="w-full px-4 py-2.5 pl-10 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        </div>
                    </form>

                    {/* Filter Buttons */}
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => handleFilter('')}
                            className={`px-4 py-2 rounded-xl text-sm transition-colors ${!filter ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                            সব
                        </button>
                        <button
                            onClick={() => handleFilter('trial')}
                            className={`px-4 py-2 rounded-xl text-sm transition-colors ${filter === 'trial' ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                            ট্রায়াল
                        </button>
                        <button
                            onClick={() => handleFilter('premium')}
                            className={`px-4 py-2 rounded-xl text-sm transition-colors ${filter === 'premium' ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                            প্রিমিয়াম
                        </button>
                        <button
                            onClick={() => handleFilter('unlimited')}
                            className={`px-4 py-2 rounded-xl text-sm transition-colors ${filter === 'unlimited' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                            আনলিমিটেড
                        </button>
                        <button
                            onClick={() => handleFilter('expired')}
                            className={`px-4 py-2 rounded-xl text-sm transition-colors ${filter === 'expired' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                            মেয়াদোত্তীর্ণ
                        </button>
                    </div>
                </div>
            </div>

            {/* Business List */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-700/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">বিজনেস</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">মালিক</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">স্ট্যাটাস</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">প্ল্যান</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">মেয়াদ</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {businesses.data.map((business) => (
                                <tr key={business.id} className="hover:bg-gray-700/30">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-lg">
                                                {business.category_icon || '🏪'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{business.name}</p>
                                                <p className="text-xs text-gray-400">{business.category || 'অন্যান্য'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {business.owner ? (
                                            <div>
                                                <p className="text-white text-sm">{business.owner.name}</p>
                                                <p className="text-xs text-gray-400">{business.owner.email}</p>
                                            </div>
                                        ) : (
                                            <span className="text-gray-500">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {getStatusBadge(business)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-white text-sm">
                                            {business.subscription?.plan || '-'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {business.subscription?.is_unlimited ? (
                                            <span className="text-purple-400 text-sm">♾️ আনলিমিটেড</span>
                                        ) : business.subscription ? (
                                            <div>
                                                <p className="text-white text-sm">{business.subscription.expires_at}</p>
                                                <p className={`text-xs ${business.subscription.days_remaining <= 3 ? 'text-red-400' : 'text-gray-400'}`}>
                                                    {business.subscription.days_remaining > 0
                                                        ? `${business.subscription.days_remaining} দিন বাকি`
                                                        : 'মেয়াদোত্তীর্ণ'
                                                    }
                                                </p>
                                            </div>
                                        ) : (
                                            <span className="text-gray-500">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-1">
                                            {/* Extend/Reduce */}
                                            {business.subscription && !business.subscription.is_unlimited && (
                                                <button
                                                    onClick={() => openExtendModal(business)}
                                                    className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                                                    title="সময় বাড়ান/কমান"
                                                >
                                                    ⏱️
                                                </button>
                                            )}

                                            {/* Set Unlimited */}
                                            {!business.subscription?.is_unlimited && (
                                                <button
                                                    onClick={() => handleSetUnlimited(business)}
                                                    className="p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
                                                    title="আনলিমিটেড করুন"
                                                >
                                                    ♾️
                                                </button>
                                            )}

                                            {/* Assign Plan */}
                                            <button
                                                onClick={() => openAssignModal(business)}
                                                className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                                                title="প্ল্যান দিন"
                                            >
                                                🎁
                                            </button>

                                            {/* Revoke */}
                                            {business.subscription && (
                                                <button
                                                    onClick={() => handleRevoke(business)}
                                                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                                    title="সাবস্ক্রিপশন বাতিল করুন"
                                                >
                                                    ⛔
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {businesses.last_page > 1 && (
                    <div className="px-4 py-3 border-t border-gray-700 flex items-center justify-between">
                        <p className="text-sm text-gray-400">
                            মোট {businesses.total} বিজনেস
                        </p>
                        <div className="flex gap-2">
                            {Array.from({ length: businesses.last_page }, (_, i) => i + 1).map((page) => (
                                <Link
                                    key={page}
                                    href={`/admin/subscriptions?page=${page}&filter=${filter || ''}&search=${searchQuery}`}
                                    className={`px-3 py-1 rounded-lg text-sm ${page === businesses.current_page
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                >
                                    {page}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Extend Modal */}
            {modalType === 'extend' && selectedBusiness && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            ⏱️ সাবস্ক্রিপশন সময় পরিবর্তন
                        </h3>
                        <p className="text-gray-400 mb-4">{selectedBusiness.name}</p>

                        <div className="mb-4">
                            <label className="block text-sm text-gray-300 mb-2">দিন সংখ্যা</label>
                            <input
                                type="number"
                                value={daysToAdd}
                                onChange={(e) => setDaysToAdd(parseInt(e.target.value) || 0)}
                                min={1}
                                max={365}
                                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={() => setDaysToAdd(7)}
                                className="px-3 py-1 bg-gray-700 rounded-lg text-sm text-gray-300 hover:bg-gray-600"
                            >
                                +৭ দিন
                            </button>
                            <button
                                onClick={() => setDaysToAdd(15)}
                                className="px-3 py-1 bg-gray-700 rounded-lg text-sm text-gray-300 hover:bg-gray-600"
                            >
                                +১৫ দিন
                            </button>
                            <button
                                onClick={() => setDaysToAdd(30)}
                                className="px-3 py-1 bg-gray-700 rounded-lg text-sm text-gray-300 hover:bg-gray-600"
                            >
                                +৩০ দিন
                            </button>
                            <button
                                onClick={() => setDaysToAdd(90)}
                                className="px-3 py-1 bg-gray-700 rounded-lg text-sm text-gray-300 hover:bg-gray-600"
                            >
                                +৯০ দিন
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => handleExtend('add')}
                                disabled={processing}
                                className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                            >
                                ➕ {daysToAdd} দিন বাড়ান
                            </button>
                            <button
                                onClick={() => handleExtend('subtract')}
                                disabled={processing}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                ➖ {daysToAdd} দিন কমান
                            </button>
                        </div>

                        <button
                            onClick={closeModal}
                            className="w-full mt-3 px-4 py-2.5 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 transition-colors"
                        >
                            বাতিল
                        </button>
                    </div>
                </div>
            )}

            {/* Assign Plan Modal */}
            {modalType === 'assign' && selectedBusiness && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            🎁 প্ল্যান নির্ধারণ করুন
                        </h3>
                        <p className="text-gray-400 mb-4">{selectedBusiness.name}</p>

                        <div className="mb-4">
                            <label className="block text-sm text-gray-300 mb-2">প্ল্যান নির্বাচন করুন</label>
                            <select
                                value={selectedPlanId || ''}
                                onChange={(e) => {
                                    const planId = parseInt(e.target.value);
                                    setSelectedPlanId(planId);
                                    const plan = plans.find(p => p.id === planId);
                                    setCustomDuration(plan?.duration_days || null);
                                }}
                                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                {plans.map(plan => (
                                    <option key={plan.id} value={plan.id}>
                                        {plan.name} ({plan.duration_days} দিন) {plan.is_trial ? '- ট্রায়াল' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm text-gray-300 mb-2">কাস্টম মেয়াদ (ঐচ্ছিক)</label>
                            <input
                                type="number"
                                value={customDuration || ''}
                                onChange={(e) => setCustomDuration(parseInt(e.target.value) || null)}
                                placeholder="ডিফল্ট মেয়াদ ব্যবহার হবে"
                                min={1}
                                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleAssignPlan}
                                disabled={processing || !selectedPlanId}
                                className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                            >
                                ✅ প্ল্যান দিন
                            </button>
                            <button
                                onClick={closeModal}
                                className="flex-1 px-4 py-2.5 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 transition-colors"
                            >
                                বাতিল
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
