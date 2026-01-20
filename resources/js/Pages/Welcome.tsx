import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/Common';

export default function Welcome() {
    const features = [
        {
            icon: '📊',
            title: 'সহজ হিসাব',
            description: 'মোবাইল থেকেই আপনার ব্যবসার দৈনিক আয়-ব্যয়ের হিসাব রাখুন সহজে।',
        },
        {
            icon: '👥',
            title: 'পার্টি ম্যানেজমেন্ট',
            description: 'কাস্টমার ও সাপ্লায়ারদের বাকি হিসাব সংরক্ষণ ও ট্র্যাক করুন।',
        },
        {
            icon: '📦',
            title: 'স্টক ব্যবস্থাপনা',
            description: 'পণ্যের মজুদ, ক্রয়-বিক্রয় মূল্য এবং স্টক অ্যালার্ট পান।',
        },
        {
            icon: '🧾',
            title: 'বিল/চালান',
            description: 'সুন্দর বিল তৈরি করুন এবং WhatsApp এ পাঠান মুহূর্তেই।',
        },
        {
            icon: '📈',
            title: 'রিপোর্ট ও এনালাইসিস',
            description: 'লাভ-ক্ষতি, দৈনিক/মাসিক রিপোর্ট দেখুন চার্ট সহ।',
        },
        {
            icon: '🔒',
            title: 'নিরাপদ ডেটা',
            description: 'আপনার সকল তথ্য ক্লাউডে নিরাপদে সংরক্ষিত থাকে।',
        },
    ];

    const businessTypes = [
        { icon: '🛒', name: 'মুদি দোকান' },
        { icon: '👗', name: 'পোশাক' },
        { icon: '🍕', name: 'রেস্টুরেন্ট' },
        { icon: '💊', name: 'ফার্মেসি' },
        { icon: '🔧', name: 'সার্ভিস' },
        { icon: '📦', name: 'পাইকারি' },
    ];

    return (
        <>
            <Head title="আপনার ব্যবসার ডিজিটাল হিসাব খাতা" />
            <div className="min-h-screen bg-white dark:bg-gray-900">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                                    <span className="text-white text-xl font-bold">হি</span>
                                </div>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    হিসাব করি
                                </span>
                            </Link>

                            {/* Navigation */}
                            <nav className="hidden md:flex items-center gap-8">
                                <a href="#features" className="text-gray-600 hover:text-primary-500 dark:text-gray-300 transition-colors">
                                    বৈশিষ্ট্য
                                </a>
                                <a href="#business-types" className="text-gray-600 hover:text-primary-500 dark:text-gray-300 transition-colors">
                                    ব্যবসার ধরন
                                </a>
                                <a href="#pricing" className="text-gray-600 hover:text-primary-500 dark:text-gray-300 transition-colors">
                                    মূল্য
                                </a>
                            </nav>

                            {/* Auth Buttons */}
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-gray-600 hover:text-primary-500 dark:text-gray-300 transition-colors"
                                >
                                    লগইন
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary-500/30"
                                >
                                    ফ্রি শুরু করুন
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                        <div className="text-center max-w-4xl mx-auto">
                            <span className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium mb-6">
                                🎉 সম্পূর্ণ বাংলায় • ফ্রি ব্যবহার করুন
                            </span>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                                আপনার ব্যবসার
                                <span className="text-gradient bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                                    {' '}ডিজিটাল{' '}
                                </span>
                                হিসাব খাতা
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                                টালি খাতার ঝামেলা ভুলে যান। মোবাইল থেকেই আপনার ব্যবসার সকল হিসাব-নিকাশ করুন সহজ বাংলায়।
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    href="/register"
                                    className="w-full sm:w-auto px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-semibold text-lg transition-all shadow-xl shadow-primary-500/30 hover:-translate-y-1"
                                >
                                    ফ্রি অ্যাকাউন্ট খুলুন ✨
                                </Link>
                                <a
                                    href="#demo"
                                    className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold text-lg transition-all hover:border-primary-500 hover:text-primary-500"
                                >
                                    ডেমো দেখুন 👀
                                </a>
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-2">
                                    <span className="text-lg">✅</span> কোনো ক্রেডিট কার্ড লাগবে না
                                </span>
                                <span className="flex items-center gap-2">
                                    <span className="text-lg">📱</span> মোবাইল ফ্রেন্ডলি
                                </span>
                                <span className="flex items-center gap-2">
                                    <span className="text-lg">🇧🇩</span> সম্পূর্ণ বাংলায়
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                আপনার ব্যবসার জন্য সব কিছু
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                হিসাব করি অ্যাপে আছে আপনার ব্যবসা পরিচালনার জন্য প্রয়োজনীয় সকল টুলস
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-3xl mb-6">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Business Types Section */}
                <section id="business-types" className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                সব ধরনের ব্যবসার জন্য
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                আপনার ব্যবসার ধরন অনুযায়ী তৈরি টেমপ্লেট বেছে নিন
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                            {businessTypes.map((type, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300 text-center group cursor-pointer hover:-translate-y-1"
                                >
                                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                                        {type.icon}
                                    </div>
                                    <p className="font-medium text-gray-700 dark:text-gray-300">
                                        {type.name}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-10">
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium"
                            >
                                আরও দেখুন
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-600">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            আজই শুরু করুন - সম্পূর্ণ ফ্রি!
                        </h2>
                        <p className="text-xl text-primary-100 mb-8">
                            হাজারো ব্যবসায়ী ইতিমধ্যে হিসাব করি ব্যবহার করছেন
                        </p>
                        <Link
                            href="/register"
                            className="inline-block px-8 py-4 bg-white text-primary-600 rounded-2xl font-semibold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                        >
                            ফ্রি অ্যাকাউন্ট খুলুন 🚀
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-gray-400 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                                    <span className="text-white text-xl font-bold">হি</span>
                                </div>
                                <span className="text-lg font-bold text-white">হিসাব করি</span>
                            </div>
                            <p className="text-sm">
                                © {new Date().getFullYear()} হিসাব করি। সর্বস্বত্ব সংরক্ষিত।
                            </p>
                            <div className="flex items-center gap-6">
                                <a href="#" className="hover:text-white transition-colors">গোপনীয়তা নীতি</a>
                                <a href="#" className="hover:text-white transition-colors">শর্তাবলী</a>
                                <a href="#" className="hover:text-white transition-colors">যোগাযোগ</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
