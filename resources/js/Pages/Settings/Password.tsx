import { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Input, Button } from '@/Components/Common';

export default function Password() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [success, setSuccess] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/settings/password', {
            onSuccess: () => {
                reset();
                setSuccess(true);
                setTimeout(() => setSuccess(false), 5000);
            },
        });
    };

    return (
        <DashboardLayout title="পাসওয়ার্ড পরিবর্তন">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/settings"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4"
                    >
                        <span>←</span>
                        <span>সেটিংসে ফিরুন</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-white">🔐 পাসওয়ার্ড পরিবর্তন করুন</h1>
                    <p className="text-gray-400 mt-1">আপনার অ্যাকাউন্টের নিরাপত্তার জন্য পাসওয়ার্ড আপডেট করুন</p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 bg-green-500/20 border border-green-500 rounded-xl p-4 text-green-400 flex items-center gap-3">
                        <span className="text-xl">✅</span>
                        <span>পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                    <div className="space-y-5">
                        {/* Current Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                বর্তমান পাসওয়ার্ড
                            </label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    value={data.current_password}
                                    onChange={(e) => setData('current_password', e.target.value)}
                                    placeholder="আপনার বর্তমান পাসওয়ার্ড দিন"
                                    className={`w-full px-4 py-3 bg-gray-900 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 pr-12 ${errors.current_password ? 'border-red-500' : 'border-gray-700'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showCurrentPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {errors.current_password && (
                                <p className="text-red-400 text-sm mt-1">{errors.current_password}</p>
                            )}
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                নতুন পাসওয়ার্ড
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="নতুন পাসওয়ার্ড দিন (কমপক্ষে ৮ অক্ষর)"
                                    className={`w-full px-4 py-3 bg-gray-900 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 pr-12 ${errors.password ? 'border-red-500' : 'border-gray-700'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showNewPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm New Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                নতুন পাসওয়ার্ড নিশ্চিত করুন
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="নতুন পাসওয়ার্ড আবার দিন"
                                    className={`w-full px-4 py-3 bg-gray-900 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 pr-12 ${errors.password_confirmation ? 'border-red-500' : 'border-gray-700'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showConfirmPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {errors.password_confirmation && (
                                <p className="text-red-400 text-sm mt-1">{errors.password_confirmation}</p>
                            )}
                        </div>

                        {/* Password Tips */}
                        <div className="bg-gray-700/30 rounded-xl p-4">
                            <p className="text-sm font-medium text-gray-300 mb-2">💡 পাসওয়ার্ড তৈরির টিপস:</p>
                            <ul className="text-xs text-gray-400 space-y-1 pl-4">
                                <li>• কমপক্ষে ৮ অক্ষরের হতে হবে</li>
                                <li>• বড় ও ছোট হাতের অক্ষর মিলিয়ে ব্যবহার করুন</li>
                                <li>• সংখ্যা এবং বিশেষ চিহ্ন (!@#$) যোগ করুন</li>
                                <li>• পুরাতন পাসওয়ার্ড বা সহজ শব্দ এড়িয়ে চলুন</li>
                            </ul>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-4 mt-8">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 px-6 py-3 text-white font-medium rounded-xl transition-all disabled:opacity-50"
                            style={{ backgroundColor: '#006A4E' }}
                        >
                            {processing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    পরিবর্তন হচ্ছে...
                                </span>
                            ) : '🔐 পাসওয়ার্ড পরিবর্তন করুন'}
                        </button>
                        <Link
                            href="/settings"
                            className="px-6 py-3 bg-gray-700 text-gray-300 font-medium rounded-xl hover:bg-gray-600 transition-colors"
                        >
                            বাতিল
                        </Link>
                    </div>
                </form>

                {/* Security Notice */}
                <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-amber-400 text-sm">
                    <p className="flex items-start gap-2">
                        <span className="text-lg">⚠️</span>
                        <span>
                            পাসওয়ার্ড পরিবর্তন করলে আপনার সব ডিভাইস থেকে নতুন পাসওয়ার্ড দিয়ে লগইন করতে হবে।
                        </span>
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}
