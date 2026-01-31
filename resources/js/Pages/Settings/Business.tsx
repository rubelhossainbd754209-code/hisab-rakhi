import React, { useState, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { PageProps, Business } from '@/types';

interface BusinessSettingsProps extends PageProps {
    business: Business;
}

export default function BusinessSettings({ auth, business }: BusinessSettingsProps) {
    const [logoPreview, setLogoPreview] = useState<string | null>(
        business.logo ? (business.logo.startsWith('http') ? business.logo : `/storage/${business.logo}`) : null
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, put, processing, errors } = useForm({
        name: business.name || '',
        phone: business.phone || '',
        address: business.address || '',
        logo: null as File | null,
    });

    const isPremium = auth.business?.is_premium;
    const isTrial = auth.business?.is_trial;

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('phone', data.phone);
        formData.append('address', data.address);
        if (data.logo) {
            formData.append('logo', data.logo);
        }
        formData.append('_method', 'PUT');

        // @ts-ignore
        put('/settings/business', {
            forceFormData: true,
        });
    };

    return (
        <DashboardLayout title="ব্যবসার তথ্য">
            <Head title="ব্যবসার তথ্য - সেটিংস" />

            {/* Breadcrumb */}
            <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Link href="/settings" className="hover:text-white">সেটিংস</Link>
                    <span>→</span>
                    <span className="text-white">ব্যবসার তথ্য</span>
                </div>
                <h1 className="text-2xl font-bold text-white mt-2">ব্যবসার তথ্য</h1>
                <p className="text-gray-400">আপনার ব্যবসায় প্রতিষ্ঠানের তথ্য পরিবর্তন করুন</p>
            </div>

            {/* Premium Notice for Free Users */}
            {!isPremium && !isTrial && (
                <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">⭐</span>
                        <div>
                            <h3 className="text-amber-400 font-semibold">প্রিমিয়াম ফিচার</h3>
                            <p className="text-amber-300/80 text-sm">
                                ব্যবসার নাম ও লোগো পরিবর্তন করতে প্রিমিয়াম প্ল্যানে আপগ্রেড করুন।
                            </p>
                            <Link
                                href="/settings?tab=subscription"
                                className="mt-2 inline-flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300"
                            >
                                🚀 আপগ্রেড করুন →
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Business Logo */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        🏪 ব্যবসার লোগো
                    </h2>

                    <div className="flex items-center gap-6">
                        {/* Logo Preview */}
                        <div className="relative">
                            <div className="w-24 h-24 rounded-2xl bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-gray-600">
                                {logoPreview ? (
                                    <img
                                        src={logoPreview}
                                        alt="Business Logo"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-4xl text-gray-400">
                                        {business.name?.charAt(0) || '🏪'}
                                    </span>
                                )}
                            </div>
                            {isPremium && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute -bottom-2 -right-2 p-2 bg-emerald-600 rounded-full text-white hover:bg-emerald-700 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        <div className="flex-1">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleLogoChange}
                                accept="image/*"
                                className="hidden"
                                disabled={!isPremium}
                            />
                            {isPremium ? (
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
                                    >
                                        📷 লোগো পরিবর্তন করুন
                                    </button>
                                    <p className="text-xs text-gray-400 mt-2">
                                        সর্বোচ্চ 2MB, JPG, PNG বা GIF
                                    </p>
                                </div>
                            ) : (
                                <div className="text-gray-400 text-sm">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700 rounded-lg text-xs">
                                        🔒 শুধুমাত্র প্রিমিয়াম
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    {errors.logo && (
                        <p className="mt-2 text-sm text-red-400">{errors.logo}</p>
                    )}
                </div>

                {/* Business Info */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        📝 ব্যবসার তথ্য
                    </h2>

                    <div className="space-y-4">
                        {/* Business Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                ব্যবসার নাম <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="আপনার ব্যবসার নাম"
                                    className={`w-full px-4 py-3 bg-gray-700 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${!isPremium ? 'cursor-not-allowed opacity-60' : 'border-gray-600'
                                        }`}
                                    disabled={!isPremium}
                                    required
                                />
                                {!isPremium && (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                        🔒
                                    </span>
                                )}
                            </div>
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                            )}
                            {isPremium && (
                                <p className="mt-1 text-xs text-gray-400">
                                    এই নাম ড্যাশবোর্ড এবং ইনভয়েসে দেখাবে
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                ফোন নম্বর
                            </label>
                            <input
                                type="tel"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                placeholder="০১৭XXXXXXXX"
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                            )}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                ঠিকানা
                            </label>
                            <textarea
                                value={data.address}
                                onChange={e => setData('address', e.target.value)}
                                placeholder="আপনার দোকান/ব্যবসার ঠিকানা"
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                            />
                            {errors.address && (
                                <p className="mt-1 text-sm text-red-400">{errors.address}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-400">
                                এই ঠিকানা ইনভয়েস প্রিন্টে দেখাবে
                            </p>
                        </div>
                    </div>
                </div>

                {/* Subscription Status Card */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        💳 সাবস্ক্রিপশন স্ট্যাটাস
                    </h2>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                {isPremium && (
                                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
                                        ⭐ প্রিমিয়াম
                                    </span>
                                )}
                                {isTrial && (
                                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium">
                                        🎁 ট্রায়াল ({auth.business?.days_remaining} দিন বাকি)
                                    </span>
                                )}
                                {!isPremium && !isTrial && (
                                    <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium">
                                        ⚠️ কোনো সাবস্ক্রিপশন নেই
                                    </span>
                                )}
                            </div>
                            {auth.business?.plan_name && (
                                <p className="text-gray-400 text-sm mt-1">
                                    প্ল্যান: {auth.business.plan_name}
                                </p>
                            )}
                        </div>

                        {!isPremium && (
                            <Link
                                href="/settings?tab=subscription"
                                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
                            >
                                🚀 আপগ্রেড করুন
                            </Link>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between pt-4">
                    <Link
                        href="/settings"
                        className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                    >
                        ← বাতিল
                    </Link>

                    <button
                        type="submit"
                        disabled={processing || !isPremium}
                        className={`px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${isPremium
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {processing ? (
                            <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                সংরক্ষণ হচ্ছে...
                            </>
                        ) : (
                            <>
                                💾 সংরক্ষণ করুন
                            </>
                        )}
                    </button>
                </div>
            </form>
        </DashboardLayout>
    );
}
