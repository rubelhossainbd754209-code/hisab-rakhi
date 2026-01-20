import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { PageProps } from '@/types';

export default function Reports({ auth }: PageProps) {
    const formatTaka = (amount: number) => '৳ ' + amount.toLocaleString('bn-BD');

    const reportCards = [
        { id: '1', name: 'আয়-ব্যয় রিপোর্ট', icon: '📊', description: 'দৈনিক, সাপ্তাহিক, মাসিক আয়-ব্যয়', href: '/reports/income-expense' },
        { id: '2', name: 'পার্টি লেজার', icon: '👥', description: 'কাস্টমার ও সাপ্লায়ারের লেনদেন', href: '/reports/party-ledger' },
        { id: '3', name: 'স্টক রিপোর্ট', icon: '📦', description: 'পণ্যের মজুদ ও মূল্য', href: '/reports/stock' },
        { id: '4', name: 'বিক্রয় রিপোর্ট', icon: '🛒', description: 'পণ্য ও তারিখ অনুযায়ী বিক্রয়', href: '/reports/sales' },
        { id: '5', name: 'ক্যাশ সামারি', icon: '💰', description: 'নগদ লেনদেনের সারসংক্ষেপ', href: '/reports/cash' },
        { id: '6', name: 'লাভ-ক্ষতি', icon: '📈', description: 'মাসিক ও বার্ষিক লাভ-ক্ষতি', href: '/reports/profit-loss' },
    ];

    return (
        <DashboardLayout title="রিপোর্ট">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">রিপোর্ট</h1>
                <p className="text-gray-400">ব্যবসার সকল রিপোর্ট দেখুন</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">এই মাসের আয়</p>
                    <p className="text-2xl font-bold text-green-400">{formatTaka(125000)}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">এই মাসের ব্যয়</p>
                    <p className="text-2xl font-bold text-red-400">{formatTaka(85000)}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">নীট লাভ</p>
                    <p className="text-2xl font-bold text-blue-400">{formatTaka(40000)}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">মার্জিন</p>
                    <p className="text-2xl font-bold text-purple-400">32%</p>
                </div>
            </div>

            {/* Report Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportCards.map(report => (
                    <a
                        key={report.id}
                        href={report.href}
                        className="bg-gray-800 rounded-2xl border border-gray-700 p-5 hover:border-gray-600 transition-all hover:-translate-y-1"
                    >
                        <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center text-3xl mb-4">
                            {report.icon}
                        </div>
                        <h3 className="font-semibold text-white text-lg mb-1">{report.name}</h3>
                        <p className="text-gray-400 text-sm">{report.description}</p>
                    </a>
                ))}
            </div>
        </DashboardLayout>
    );
}
