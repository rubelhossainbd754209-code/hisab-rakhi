import React, { FormEvent, useState } from 'react';
import { Link, useForm, Head, usePage } from '@inertiajs/react';
import { Input } from '@/Components/Common';

interface PageProps {
    stats: {
        total_businesses: number;
        total_transactions: number;
    };
}

export default function Register() {
    const { stats } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    // Format number
    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K+`;
        }
        return num > 0 ? `${num}+` : '০';
    };

    return (
        <>
            <Head title="অ্যাকাউন্ট তৈরি করুন" />
            <div className="min-h-screen flex">
                {/* Left Side - Register Form */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-10 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 overflow-y-auto">
                    {/* Logo */}
                    <div className="mb-6">
                        <a href="/" className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#006A4E' }}>
                                <span className="text-white text-xl font-bold">হি</span>
                            </div>
                            <div>
                                <span className="text-2xl font-bold text-gray-900">হিসাব রাখি</span>
                                <p className="text-xs text-gray-500">বাংলাদেশের সেরা হিসাব সফটওয়্যার</p>
                            </div>
                        </a>
                    </div>

                    {/* Form Card */}
                    <div className="max-w-md w-full">
                        {/* Header */}
                        <div className="mb-5">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                অ্যাকাউন্ট তৈরি করুন ✨
                            </h1>
                            <p className="text-gray-600">
                                আপনার ব্যবসার ডিজিটাল হিসাব খাতা শুরু করুন
                            </p>
                        </div>

                        {/* Trial Badge */}
                        <div className="mb-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-green-800">৭ দিনের ফ্রি ট্রায়াল</p>
                                    <p className="text-xs text-green-600">কোন ক্রেডিট কার্ড প্রয়োজন নেই</p>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="আপনার নাম"
                                type="text"
                                placeholder="আপনার পুরো নাম লিখুন"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                error={errors.name}
                                leftIcon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                }
                            />

                            <Input
                                label="মোবাইল নম্বর"
                                type="tel"
                                placeholder="০১XXXXXXXXX"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                error={errors.phone}
                                leftIcon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                }
                            />

                            <Input
                                label="ইমেইল"
                                type="email"
                                placeholder="আপনার ইমেইল দিন"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                error={errors.email}
                                leftIcon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                }
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="পাসওয়ার্ড"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="পাসওয়ার্ড"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    error={errors.password}
                                    leftIcon={
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    }
                                />

                                <Input
                                    label="নিশ্চিত করুন"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="পুনরায় দিন"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    error={errors.password_confirmation}
                                    rightIcon={
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="focus:outline-none"
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    }
                                />
                            </div>

                            {/* Terms Checkbox */}
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    required
                                    className="mt-1 w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                                />
                                <span className="text-sm text-gray-600">
                                    আমি{' '}
                                    <Link href="/terms" className="text-amber-600 hover:underline font-medium">
                                        শর্তাবলী
                                    </Link>{' '}
                                    এবং{' '}
                                    <Link href="/privacy" className="text-amber-600 hover:underline font-medium">
                                        গোপনীয়তা নীতি
                                    </Link>{' '}
                                    পড়েছি এবং সম্মত আছি।
                                </span>
                            </label>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-2xl shadow-lg shadow-amber-500/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        অ্যাকাউন্ট তৈরি হচ্ছে...
                                    </span>
                                ) : 'ফ্রি অ্যাকাউন্ট তৈরি করুন'}
                            </button>
                        </form>

                        {/* Login Link */}
                        <p className="mt-5 text-center text-gray-600">
                            ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
                            <Link
                                href="/login"
                                className="text-amber-600 hover:text-amber-700 font-semibold"
                            >
                                লগইন করুন
                            </Link>
                        </p>

                        {/* Footer */}
                        <p className="mt-6 text-center text-sm text-gray-500">
                            © {new Date().getFullYear()} হিসাব রাখি। সর্বস্বত্ব সংরক্ষিত।
                        </p>
                    </div>
                </div>

                {/* Right Side - Image & Stats */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 flex-col items-center justify-center p-8 overflow-hidden">
                    {/* Background Decorations */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-20 left-20 w-32 h-32 bg-amber-300 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-40 right-20 w-48 h-48 bg-orange-300 rounded-full blur-3xl"></div>
                    </div>

                    {/* Top Stats Card - Dynamic */}
                    <div className="absolute top-8 right-8 z-20">
                        <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">{formatNumber(stats?.total_businesses || 500)}</p>
                                    <p className="text-sm text-gray-500">ব্যবসা আমাদের বিশ্বাস করে</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Illustration */}
                    <div className="relative z-10 w-full max-w-lg">
                        <img
                            src="/images/login-bg.png"
                            alt="হিসাব নিকাশ"
                            className="w-full rounded-3xl shadow-2xl"
                        />
                    </div>

                    {/* Bottom Stats Card - Dynamic */}
                    <div className="absolute bottom-24 left-8 z-20">
                        <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">{formatNumber(stats?.total_transactions || 1000)}</p>
                                    <p className="text-sm text-gray-500">লেনদেন সম্পন্ন হয়েছে</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature Badges */}
                    <div className="absolute bottom-8 right-8 flex gap-3 z-20">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-gray-100">
                            <span className="text-sm font-medium text-gray-700">✓ সহজ ব্যবহার</span>
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-gray-100">
                            <span className="text-sm font-medium text-gray-700">✓ ২৪/৭ সাপোর্ট</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
