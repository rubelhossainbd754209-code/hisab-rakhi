import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { PageProps } from '@/types';

export default function Settings({ auth }: PageProps) {
    const settingsSections = [
        {
            title: 'ব্যবসার তথ্য',
            icon: '🏪',
            items: [
                { name: 'ব্যবসার নাম ও ঠিকানা', href: '/settings/business' },
                { name: 'লোগো পরিবর্তন', href: '/settings/logo' },
                { name: 'বিল টেমপ্লেট', href: '/settings/invoice-template' },
            ]
        },
        {
            title: 'অ্যাকাউন্ট',
            icon: '👤',
            items: [
                { name: 'প্রোফাইল সেটিংস', href: '/profile' },
                { name: 'পাসওয়ার্ড পরিবর্তন', href: '/settings/password' },
                { name: 'নোটিফিকেশন', href: '/settings/notifications' },
            ]
        },
        {
            title: 'মডিউল সেটিংস',
            icon: '⚙️',
            items: [
                { name: 'একটিভ মডিউল', href: '/settings/modules' },
                { name: 'ড্যাশবোর্ড কাস্টমাইজ', href: '/settings/dashboard' },
                { name: 'শর্টকাট', href: '/settings/shortcuts' },
            ]
        },
        {
            title: 'ডেটা',
            icon: '💾',
            items: [
                { name: 'ডেটা এক্সপোর্ট', href: '/settings/export' },
                { name: 'ব্যাকআপ', href: '/settings/backup' },
            ]
        },
    ];

    return (
        <DashboardLayout title="সেটিংস">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">সেটিংস</h1>
                <p className="text-gray-400">অ্যাপ্লিকেশন ও অ্যাকাউন্ট সেটিংস</p>
            </div>

            {/* Settings Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {settingsSections.map(section => (
                    <div key={section.title} className="bg-gray-800 rounded-2xl border border-gray-700 p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl">{section.icon}</span>
                            <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                        </div>
                        <div className="space-y-2">
                            {section.items.map(item => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-700 transition-colors group"
                                >
                                    <span className="text-gray-300 group-hover:text-white">{item.name}</span>
                                    <span className="text-gray-500 group-hover:text-gray-300">→</span>
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Danger Zone */}
            <div className="mt-8 bg-red-500/10 rounded-2xl border border-red-500/20 p-5">
                <h2 className="text-lg font-semibold text-red-400 mb-4">⚠️ বিপজ্জনক অঞ্চল</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                        সব ডেটা মুছে ফেলুন
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                        অ্যাকাউন্ট ডিলিট করুন
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
