import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import type { PageProps } from '@/types';

interface Plan {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    duration_days: number;
    billing_cycle: string;
    features: string[] | null;
    limits: Record<string, any> | null;
    is_trial: boolean;
    is_popular: boolean;
    is_active: boolean;
    sort_order: number;
}

interface PlansPageProps extends PageProps {
    plans: Plan[];
    settings: Record<string, string>;
}

export default function AdminPlans({ plans, settings }: PlansPageProps) {
    const { flash } = usePage().props as any;
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [settingsForm, setSettingsForm] = useState({
        trial_duration_days: settings.trial_duration_days || '15',
        grace_period_days: settings.grace_period_days || '3',
        show_trial_warning_days: settings.show_trial_warning_days || '3',
    });

    const [planForm, setPlanForm] = useState({
        name: '',
        description: '',
        price: 0,
        duration_days: 30,
        is_active: true,
        is_popular: false,
    });

    const openEditPlan = (plan: Plan) => {
        setEditingPlan(plan);
        setPlanForm({
            name: plan.name,
            description: plan.description || '',
            price: plan.price,
            duration_days: plan.duration_days,
            is_active: plan.is_active,
            is_popular: plan.is_popular,
        });
    };

    const handleUpdatePlan = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPlan) return;

        setIsSubmitting(true);
        router.put(`/admin/subscriptions/plans/${editingPlan.id}`, planForm, {
            onSuccess: () => { setEditingPlan(null); setIsSubmitting(false); },
            onError: () => setIsSubmitting(false),
        });
    };

    const handleUpdateSettings = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        router.post('/admin/subscriptions/settings', settingsForm, {
            onSuccess: () => { setShowSettings(false); setIsSubmitting(false); },
            onError: () => setIsSubmitting(false),
        });
    };

    const formatPrice = (price: number) => {
        if (price === 0) return 'বিনামূল্যে';
        return `৳${price.toLocaleString()}`;
    };

    const getBillingText = (cycle: string) => {
        switch (cycle) {
            case 'monthly': return '/মাস';
            case 'yearly': return '/বছর';
            default: return '';
        }
    };

    return (
        <AdminLayout title="সাবস্ক্রিপশন প্ল্যান">
            {/* Flash Messages */}
            {flash?.success && (
                <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400">
                    ✅ {flash.success}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">💳 সাবস্ক্রিপশন প্ল্যান</h1>
                    <p className="text-gray-400 mt-1">প্ল্যান ম্যানেজ ও সেটিংস কনফিগার করুন</p>
                </div>
                <button
                    onClick={() => setShowSettings(true)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl flex items-center gap-2"
                >
                    <span>⚙️</span>
                    <span>সেটিংস</span>
                </button>
            </div>

            {/* Current Settings */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm mb-1">ট্রায়াল সময়কাল</p>
                    <p className="text-2xl font-bold text-white">{settings.trial_duration_days || 15} দিন</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm mb-1">গ্রেস পিরিয়ড</p>
                    <p className="text-2xl font-bold text-white">{settings.grace_period_days || 3} দিন</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm mb-1">সতর্কতা দেখাবে</p>
                    <p className="text-2xl font-bold text-white">{settings.show_trial_warning_days || 3} দিন আগে</p>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`bg-gray-800 rounded-2xl border overflow-hidden ${plan.is_popular ? 'border-amber-500' : 'border-gray-700'
                            } ${!plan.is_active ? 'opacity-50' : ''}`}
                    >
                        {plan.is_popular && (
                            <div className="bg-amber-500 text-black text-center text-sm font-semibold py-1">
                                ⭐ জনপ্রিয়
                            </div>
                        )}

                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                    <p className="text-gray-400 text-sm">{plan.duration_days} দিন</p>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-xs ${plan.is_trial
                                        ? 'bg-cyan-500/20 text-cyan-400'
                                        : 'bg-green-500/20 text-green-400'
                                    }`}>
                                    {plan.is_trial ? 'ট্রায়াল' : 'প্রিমিয়াম'}
                                </span>
                            </div>

                            <div className="mb-4">
                                <span className="text-3xl font-bold text-white">{formatPrice(plan.price)}</span>
                                <span className="text-gray-400">{getBillingText(plan.billing_cycle)}</span>
                            </div>

                            {plan.description && (
                                <p className="text-sm text-gray-400 mb-4">{plan.description}</p>
                            )}

                            {plan.features && plan.features.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 mb-2">ফিচার সমূহ:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {plan.features.slice(0, 5).map((feature) => (
                                            <span
                                                key={feature}
                                                className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                        {plan.features.length > 5 && (
                                            <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded text-xs">
                                                +{plan.features.length - 5}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => openEditPlan(plan)}
                                    className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-xl text-sm hover:bg-blue-500/30"
                                >
                                    ✏️ এডিট
                                </button>
                                <span className={`px-3 py-2 rounded-xl text-sm ${plan.is_active
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-red-500/20 text-red-400'
                                    }`}>
                                    {plan.is_active ? '✓ সক্রিয়' : '✗ নিষ্ক্রিয়'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Plan Modal */}
            {editingPlan && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-lg">
                        <div className="p-6 border-b border-gray-700">
                            <h3 className="text-xl font-bold text-white">✏️ প্ল্যান এডিট: {editingPlan.name}</h3>
                        </div>
                        <form onSubmit={handleUpdatePlan} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">নাম</label>
                                <input
                                    type="text"
                                    value={planForm.name}
                                    onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">বিবরণ</label>
                                <textarea
                                    value={planForm.description}
                                    onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">মূল্য (৳)</label>
                                    <input
                                        type="number"
                                        value={planForm.price}
                                        onChange={(e) => setPlanForm({ ...planForm, price: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">সময়কাল (দিন)</label>
                                    <input
                                        type="number"
                                        value={planForm.duration_days}
                                        onChange={(e) => setPlanForm({ ...planForm, duration_days: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={planForm.is_active}
                                        onChange={(e) => setPlanForm({ ...planForm, is_active: e.target.checked })}
                                        className="w-5 h-5 rounded"
                                    />
                                    <span className="text-gray-300">সক্রিয়</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={planForm.is_popular}
                                        onChange={(e) => setPlanForm({ ...planForm, is_popular: e.target.checked })}
                                        className="w-5 h-5 rounded"
                                    />
                                    <span className="text-gray-300">জনপ্রিয়</span>
                                </label>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingPlan(null)}
                                    className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-xl"
                                >
                                    বাতিল
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl disabled:opacity-50"
                                >
                                    {isSubmitting ? '⏳ সেভ হচ্ছে...' : '💾 সেভ করুন'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md">
                        <div className="p-6 border-b border-gray-700">
                            <h3 className="text-xl font-bold text-white">⚙️ সাবস্ক্রিপশন সেটিংস</h3>
                        </div>
                        <form onSubmit={handleUpdateSettings} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">ট্রায়াল সময়কাল (দিন)</label>
                                <input
                                    type="number"
                                    value={settingsForm.trial_duration_days}
                                    onChange={(e) => setSettingsForm({ ...settingsForm, trial_duration_days: e.target.value })}
                                    min="1"
                                    max="90"
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">গ্রেস পিরিয়ড (দিন)</label>
                                <input
                                    type="number"
                                    value={settingsForm.grace_period_days}
                                    onChange={(e) => setSettingsForm({ ...settingsForm, grace_period_days: e.target.value })}
                                    min="0"
                                    max="30"
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">সাবস্ক্রিপশন শেষ হওয়ার পর অতিরিক্ত সময়</p>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">সতর্কতা দেখাবে (দিন আগে)</label>
                                <input
                                    type="number"
                                    value={settingsForm.show_trial_warning_days}
                                    onChange={(e) => setSettingsForm({ ...settingsForm, show_trial_warning_days: e.target.value })}
                                    min="1"
                                    max="14"
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowSettings(false)}
                                    className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-xl"
                                >
                                    বাতিল
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl disabled:opacity-50"
                                >
                                    {isSubmitting ? '⏳ সেভ হচ্ছে...' : '💾 সেভ করুন'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
