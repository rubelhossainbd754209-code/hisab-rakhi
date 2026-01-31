import { Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import type { PageProps } from '@/types';

interface ExpiryInfo {
    has_subscription: boolean;
    status: string;
    plan_name?: string;
    is_trial?: boolean;
    days_remaining?: number;
    is_in_grace?: boolean;
    grace_days_remaining?: number;
    message: string;
}

interface ExpiredPageProps extends PageProps {
    business: {
        id: number;
        name: string;
        slug: string;
    };
    expiry_info: ExpiryInfo;
}

export default function SubscriptionExpired({ business, expiry_info }: ExpiredPageProps) {

    return (
        <>
            <Head title="সাবস্ক্রিপশন শেষ - হিসাব রাখি" />
            <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
                <div className="w-full max-w-4xl">
                    {/* Expired Notice */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-red-500/20 rounded-full mb-6">
                            <span className="text-5xl">⏰</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {expiry_info.is_trial ? 'ফ্রি ট্রায়াল শেষ!' : 'সাবস্ক্রিপশন মেয়াদ শেষ!'}
                        </h1>
                        <p className="text-gray-400 text-lg mb-4">
                            "{business.name}" এর {expiry_info.is_trial ? 'ফ্রি ট্রায়াল' : 'সাবস্ক্রিপশন'} এর মেয়াদ শেষ হয়ে গেছে।
                        </p>

                        {expiry_info.is_in_grace && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-xl text-yellow-400">
                                <span>⚠️</span>
                                <span>গ্রেস পিরিয়ড: আর {expiry_info.grace_days_remaining} দিন সময় আছে</span>
                            </div>
                        )}
                    </div>

                    {/* What you can't do */}
                    <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-8">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span>🚫</span>
                            <span>এই মুহূর্তে আপনি পারবেন না:</span>
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                                <span className="text-2xl block mb-2">📦</span>
                                <span className="text-sm text-gray-400">পণ্য যোগ</span>
                            </div>
                            <div className="text-center p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                                <span className="text-2xl block mb-2">💰</span>
                                <span className="text-sm text-gray-400">বিক্রি করা</span>
                            </div>
                            <div className="text-center p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                                <span className="text-2xl block mb-2">📝</span>
                                <span className="text-sm text-gray-400">বাকি লেখা</span>
                            </div>
                            <div className="text-center p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                                <span className="text-2xl block mb-2">📊</span>
                                <span className="text-sm text-gray-400">রিপোর্ট দেখা</span>
                            </div>
                        </div>
                    </div>

                    {/* Upgrade Options */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-white text-center mb-6">
                            💎 প্রিমিয়াম প্ল্যান বেছে নিন
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Monthly Plan */}
                            <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/10 rounded-2xl border-2 border-amber-500/50 p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-bl-xl">
                                    জনপ্রিয়
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-white">মাসিক প্ল্যান</h3>
                                    <p className="text-gray-400 text-sm">প্রতি মাসে পেমেন্ট করুন</p>
                                </div>
                                <div className="mb-4">
                                    <span className="text-4xl font-bold text-amber-400">৳২৯৯</span>
                                    <span className="text-gray-400">/মাস</span>
                                </div>
                                <ul className="space-y-2 mb-6 text-sm">
                                    <li className="flex items-center gap-2 text-gray-300">
                                        <span className="text-green-400">✓</span>
                                        সব ফিচার আনলিমিটেড
                                    </li>
                                    <li className="flex items-center gap-2 text-gray-300">
                                        <span className="text-green-400">✓</span>
                                        ৫০০ পণ্য পর্যন্ত
                                    </li>
                                    <li className="flex items-center gap-2 text-gray-300">
                                        <span className="text-green-400">✓</span>
                                        বারকোড স্ক্যানিং
                                    </li>
                                </ul>
                                <button className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl transition-colors">
                                    এখনই কিনুন
                                </button>
                            </div>

                            {/* Yearly Plan */}
                            <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/10 rounded-2xl border border-emerald-500/30 p-6">
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-white">বাৎসরিক প্ল্যান</h3>
                                    <p className="text-gray-400 text-sm">২ মাস বিনামূল্যে!</p>
                                </div>
                                <div className="mb-4">
                                    <span className="text-4xl font-bold text-emerald-400">৳২,৪৯৯</span>
                                    <span className="text-gray-400">/বছর</span>
                                </div>
                                <ul className="space-y-2 mb-6 text-sm">
                                    <li className="flex items-center gap-2 text-gray-300">
                                        <span className="text-green-400">✓</span>
                                        সব ফিচার আনলিমিটেড
                                    </li>
                                    <li className="flex items-center gap-2 text-gray-300">
                                        <span className="text-green-400">✓</span>
                                        আনলিমিটেড পণ্য
                                    </li>
                                    <li className="flex items-center gap-2 text-gray-300">
                                        <span className="text-green-400">✓</span>
                                        ডাটা ব্যাকআপ
                                    </li>
                                    <li className="flex items-center gap-2 text-gray-300">
                                        <span className="text-green-400">✓</span>
                                        প্রায়োরিটি সাপোর্ট
                                    </li>
                                </ul>
                                <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors">
                                    এখনই কিনুন
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Help */}
                    <div className="text-center">
                        <p className="text-gray-400 mb-4">
                            পেমেন্ট বা সাবস্ক্রিপশন বিষয়ে কোনো প্রশ্ন?
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <a
                                href="tel:+8801XXXXXXXXX"
                                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 transition-colors"
                            >
                                <span>📞</span>
                                <span>কল করুন</span>
                            </a>
                            <a
                                href="https://wa.me/8801XXXXXXXXX"
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-xl text-white transition-colors"
                            >
                                <span>💬</span>
                                <span>WhatsApp</span>
                            </a>
                        </div>
                    </div>

                    {/* Back to Profile */}
                    <div className="text-center mt-8">
                        <Link
                            href="/profile"
                            className="text-gray-500 hover:text-gray-300 text-sm"
                        >
                            ← প্রোফাইলে ফিরে যান
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
