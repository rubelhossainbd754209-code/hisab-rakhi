import { Head, Link } from '@inertiajs/react';
import WebsiteLayout from '@/Layouts/WebsiteLayout';

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
}

interface PricingPageProps {
    plans: Plan[];
}

export default function Pricing({ plans }: PricingPageProps) {
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

    const getFeatureLabel = (feature: string) => {
        const labels: Record<string, string> = {
            'inventory': '📦 ইনভেন্টরি ম্যানেজমেন্ট',
            'sales': '💰 বিক্রয় ম্যানেজমেন্ট',
            'purchases': '🛒 ক্রয় ম্যানেজমেন্ট',
            'credit': '📝 বাকি হিসাব',
            'expenses': '💸 খরচ ট্র্যাকিং',
            'parties': '👥 পার্টি/কাস্টমার',
            'reports': '📊 রিপোর্ট ও বিশ্লেষণ',
            'invoices': '🧾 ইনভয়েস জেনারেশন',
            'barcode': '📱 বারকোড স্ক্যানিং',
            'multi_unit': '📏 মাল্টি-ইউনিট',
            'priority_support': '⚡ প্রায়োরিটি সাপোর্ট',
            'data_backup': '💾 ডাটা ব্যাকআপ',
        };
        return labels[feature] || feature;
    };

    // Separate trial and paid plans
    const trialPlan = plans.find(p => p.is_trial);
    const paidPlans = plans.filter(p => !p.is_trial);

    return (
        <WebsiteLayout title="মূল্য তালিকা - হিসাব রাখি">
            <div className="bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 min-h-screen">
                {/* Hero Section */}
                <section className="py-16 px-4 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            সহজ ও সাশ্রয়ী <span className="text-green-400">মূল্য তালিকা</span>
                        </h1>
                        <p className="text-xl text-gray-400 mb-8">
                            আপনার ব্যবসার জন্য সেরা প্ল্যান বেছে নিন।
                            <span className="text-green-400 font-semibold"> ১৫ দিনের ফ্রি ট্রায়াল</span> দিয়ে শুরু করুন!
                        </p>

                        {/* Trust Badges */}
                        <div className="flex items-center justify-center gap-6 text-gray-500">
                            <div className="flex items-center gap-2">
                                <span>✓</span>
                                <span>কোনো ক্রেডিট কার্ড নয়</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>✓</span>
                                <span>যেকোনো সময় বাতিল</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>✓</span>
                                <span>২৪/৭ সাপোর্ট</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Cards */}
                <section className="py-12 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Free Trial Card */}
                            {trialPlan && (
                                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900 rounded-3xl border border-gray-700 p-8 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>

                                    <div className="mb-6">
                                        <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm rounded-full">
                                            🎁 ফ্রি ট্রায়াল
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-2">{trialPlan.name}</h3>
                                    <p className="text-gray-400 text-sm mb-6">{trialPlan.description}</p>

                                    <div className="mb-6">
                                        <span className="text-5xl font-bold text-white">৳০</span>
                                        <span className="text-gray-400">/{trialPlan.duration_days} দিন</span>
                                    </div>

                                    <Link
                                        href="/register"
                                        className="block w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-center font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all mb-8"
                                    >
                                        ফ্রি ট্রায়াল শুরু করুন
                                    </Link>

                                    <div className="space-y-3">
                                        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">যা পাবেন:</p>
                                        {trialPlan.features?.map((feature) => (
                                            <div key={feature} className="flex items-center gap-3 text-gray-300">
                                                <span className="text-cyan-400">✓</span>
                                                <span>{getFeatureLabel(feature)}</span>
                                            </div>
                                        ))}
                                        {trialPlan.limits && (
                                            <>
                                                <div className="pt-2 mt-2 border-t border-gray-700">
                                                    <p className="text-gray-500 text-xs">সীমাবদ্ধতা:</p>
                                                    <p className="text-gray-400 text-sm">
                                                        সর্বোচ্চ {trialPlan.limits.max_products} পণ্য
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Monthly Plan */}
                            {paidPlans.find(p => p.billing_cycle === 'monthly') && (
                                <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/5 rounded-3xl border-2 border-amber-500/50 p-8 relative overflow-hidden transform hover:scale-105 transition-transform">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-yellow-500"></div>
                                    <div className="absolute top-6 right-4">
                                        <span className="px-3 py-1 bg-amber-500 text-black text-sm font-bold rounded-full">
                                            ⭐ জনপ্রিয়
                                        </span>
                                    </div>

                                    <div className="mb-6">
                                        <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-sm rounded-full">
                                            💎 প্রিমিয়াম
                                        </span>
                                    </div>

                                    {(() => {
                                        const monthly = paidPlans.find(p => p.billing_cycle === 'monthly');
                                        if (!monthly) return null;
                                        return (
                                            <>
                                                <h3 className="text-2xl font-bold text-white mb-2">{monthly.name}</h3>
                                                <p className="text-gray-400 text-sm mb-6">{monthly.description}</p>

                                                <div className="mb-6">
                                                    <span className="text-5xl font-bold text-amber-400">{formatPrice(monthly.price)}</span>
                                                    <span className="text-gray-400">/মাস</span>
                                                </div>

                                                <Link
                                                    href="/register"
                                                    className="block w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-center font-bold rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all mb-8"
                                                >
                                                    এখনই কিনুন
                                                </Link>

                                                <div className="space-y-3">
                                                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">সব কিছু অন্তর্ভুক্ত:</p>
                                                    {monthly.features?.map((feature) => (
                                                        <div key={feature} className="flex items-center gap-3 text-gray-300">
                                                            <span className="text-amber-400">✓</span>
                                                            <span>{getFeatureLabel(feature)}</span>
                                                        </div>
                                                    ))}
                                                    {monthly.limits && (
                                                        <div className="pt-2 mt-2 border-t border-gray-700">
                                                            <p className="text-amber-400 text-sm font-semibold">
                                                                🚀 {monthly.limits.max_products} পণ্য পর্যন্ত
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            )}

                            {/* Yearly Plan */}
                            {paidPlans.find(p => p.billing_cycle === 'yearly') && (
                                <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/5 rounded-3xl border border-emerald-500/30 p-8 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500"></div>
                                    <div className="absolute top-6 right-4">
                                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-semibold rounded-full">
                                            🎉 ২ মাস ফ্রি
                                        </span>
                                    </div>

                                    <div className="mb-6">
                                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-full">
                                            💎 প্রিমিয়াম প্লাস
                                        </span>
                                    </div>

                                    {(() => {
                                        const yearly = paidPlans.find(p => p.billing_cycle === 'yearly');
                                        if (!yearly) return null;
                                        return (
                                            <>
                                                <h3 className="text-2xl font-bold text-white mb-2">{yearly.name}</h3>
                                                <p className="text-gray-400 text-sm mb-6">{yearly.description}</p>

                                                <div className="mb-2">
                                                    <span className="text-5xl font-bold text-emerald-400">{formatPrice(yearly.price)}</span>
                                                    <span className="text-gray-400">/বছর</span>
                                                </div>
                                                <p className="text-emerald-400 text-sm mb-6">
                                                    মাসে মাত্র ৳{Math.round(yearly.price / 12).toLocaleString()}
                                                </p>

                                                <Link
                                                    href="/register"
                                                    className="block w-full py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-center font-semibold rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all mb-8"
                                                >
                                                    সেরা মূল্যে কিনুন
                                                </Link>

                                                <div className="space-y-3">
                                                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">সব কিছু + অতিরিক্ত:</p>
                                                    {yearly.features?.map((feature) => (
                                                        <div key={feature} className="flex items-center gap-3 text-gray-300">
                                                            <span className="text-emerald-400">✓</span>
                                                            <span>{getFeatureLabel(feature)}</span>
                                                        </div>
                                                    ))}
                                                    {yearly.limits && (
                                                        <div className="pt-2 mt-2 border-t border-gray-700">
                                                            <p className="text-emerald-400 text-sm font-semibold">
                                                                ♾️ আনলিমিটেড পণ্য
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16 px-4 border-t border-gray-800">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-white text-center mb-12">
                            সাধারণ জিজ্ঞাসা
                        </h2>

                        <div className="space-y-6">
                            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    ফ্রি ট্রায়ালে কী কী পাব?
                                </h3>
                                <p className="text-gray-400">
                                    ফ্রি ট্রায়ালে আপনি সব বেসিক ফিচার ব্যবহার করতে পারবেন। ১৫ দিন পর প্রিমিয়াম প্ল্যানে আপগ্রেড করতে হবে।
                                </p>
                            </div>

                            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    কীভাবে পেমেন্ট করব?
                                </h3>
                                <p className="text-gray-400">
                                    বিকাশ, নগদ, রকেট অথবা যেকোনো ব্যাংক কার্ড দিয়ে পেমেন্ট করতে পারবেন।
                                </p>
                            </div>

                            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    আমার ডাটা কি নিরাপদ?
                                </h3>
                                <p className="text-gray-400">
                                    হ্যাঁ, আপনার সব ডাটা এনক্রিপ্টেড এবং সিকিউর সার্ভারে সংরক্ষিত থাকে। বাৎসরিক প্ল্যানে অটোমেটিক ব্যাকআপ সুবিধা পাবেন।
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl p-12 border border-green-500/30">
                            <h2 className="text-3xl font-bold text-white mb-4">
                                এখনই শুরু করুন! 🚀
                            </h2>
                            <p className="text-gray-400 mb-8">
                                ১৫ দিনের ফ্রি ট্রায়াল দিয়ে আজই আপনার ব্যবসার হিসাব-নিকাশ সহজ করুন।
                            </p>
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all"
                            >
                                <span>ফ্রি ট্রায়াল শুরু করুন</span>
                                <span>→</span>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </WebsiteLayout>
    );
}
