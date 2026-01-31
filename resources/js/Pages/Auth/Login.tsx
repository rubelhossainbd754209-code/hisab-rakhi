import React, { FormEvent, useState } from 'react';
import { Link, useForm, Head, usePage } from '@inertiajs/react';
import { Input } from '@/Components/Common';

interface PageProps {
    stats: {
        total_businesses: number;
        total_transactions: number;
    };
}

export default function Login() {
    const { stats } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    // Format number with Bengali numerals
    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K+`;
        }
        return num > 0 ? `${num}+` : '০';
    };

    return (
        <>
            <Head title="লগইন" />
            <div className="min-h-screen flex">
                {/* Left Side - Login Form */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
                    {/* Logo */}
                    <div className="mb-10">
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
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                স্বাগতম! 👋
                            </h1>
                            <p className="text-gray-600 text-lg">
                                আপনার অ্যাকাউন্টে লগইন করুন
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
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

                            <div className="relative">
                                <Input
                                    label="পাসওয়ার্ড"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="আপনার পাসওয়ার্ড দিন"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    error={errors.password}
                                    leftIcon={
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    }
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

                            {/* Remember & Forgot */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                                    />
                                    <span className="text-sm text-gray-600">
                                        মনে রাখুন
                                    </span>
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                                >
                                    পাসওয়ার্ড ভুলে গেছেন?
                                </Link>
                            </div>

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
                                        লগইন হচ্ছে...
                                    </span>
                                ) : 'লগইন করুন'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="my-8 flex items-center gap-4">
                            <div className="flex-1 h-px bg-gray-300" />
                            <span className="text-sm text-gray-500">অথবা</span>
                            <div className="flex-1 h-px bg-gray-300" />
                        </div>

                        {/* Social Login */}
                        <button className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="text-gray-700 font-medium">
                                Google দিয়ে লগইন
                            </span>
                        </button>

                        {/* Register Link */}
                        <p className="mt-8 text-center text-gray-600">
                            অ্যাকাউন্ট নেই?{' '}
                            <Link
                                href="/register"
                                className="text-amber-600 hover:text-amber-700 font-semibold"
                            >
                                ফ্রি অ্যাকাউন্ট খুলুন
                            </Link>
                        </p>

                        {/* Footer */}
                        <p className="mt-10 text-center text-sm text-gray-500">
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
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
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
                            <span className="text-sm font-medium text-gray-700">✓ ফ্রি ট্রায়াল</span>
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-gray-100">
                            <span className="text-sm font-medium text-gray-700">✓ বাংলা সাপোর্ট</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
