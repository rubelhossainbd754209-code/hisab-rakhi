import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import type { PageProps } from '@/types';

interface UserInfo {
    id: number;
    name: string;
    email: string;
    phone?: string;
    is_approved: boolean;
    is_active: boolean;
    profile_image?: string;
    created_at: string;
    created_date?: string;
}

interface GrowthData {
    date: string;
    day: string;
    count: number;
}

interface SystemStatus {
    server: string;
    database: string;
    cloudinary: string;
    cloudinary_name?: string;
    version: string;
    php_version: string;
    laravel_version: string;
}

interface AdminDashboardProps extends PageProps {
    stats: {
        total_users: number;
        pending_users: number;
        approved_users: number;
        active_users: number;
        inactive_users: number;
        today_users: number;
        week_users: number;
        month_users: number;
    };
    user_growth: GrowthData[];
    recent_users: UserInfo[];
    pending_approvals: UserInfo[];
    system_status: SystemStatus;
}

export default function AdminDashboard({
    auth,
    stats,
    user_growth,
    recent_users,
    pending_approvals,
    system_status
}: AdminDashboardProps) {
    const { flash } = usePage().props as any;

    const handleQuickApprove = (userId: number) => {
        router.post(`/admin/users/${userId}/quick-approve`);
    };

    // Calculate max for chart
    const maxCount = Math.max(...user_growth.map(d => d.count), 1);

    return (
        <AdminLayout title="অ্যাডমিন ড্যাশবোর্ড">
            {/* Flash Messages */}
            {flash?.success && (
                <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400">
                    ✅ {flash.success}
                </div>
            )}

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">স্বাগতম, {auth.user?.name}! 👋</h1>
                <p className="text-gray-400">সিস্টেম ওভারভিউ ও ম্যানেজমেন্ট</p>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Total Users */}
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl p-5 border border-blue-500/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-300">মোট ব্যবহারকারী</p>
                            <p className="text-3xl font-bold text-white mt-1">{stats.total_users}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center text-2xl">
                            👥
                        </div>
                    </div>
                    <div className="mt-3 text-xs text-blue-400">
                        এই মাসে: <span className="font-semibold">+{stats.month_users}</span>
                    </div>
                </div>

                {/* Pending Approval */}
                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/10 rounded-xl p-5 border border-yellow-500/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-yellow-300">অনুমোদন অপেক্ষায়</p>
                            <p className="text-3xl font-bold text-yellow-400 mt-1">{stats.pending_users}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-500/30 rounded-xl flex items-center justify-center text-2xl">
                            ⏳
                        </div>
                    </div>
                    <Link href="/admin/users?filter=pending" className="mt-3 text-xs text-yellow-400 hover:underline block">
                        সব দেখুন →
                    </Link>
                </div>

                {/* Active Users */}
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-xl p-5 border border-green-500/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-300">সক্রিয় ব্যবহারকারী</p>
                            <p className="text-3xl font-bold text-green-400 mt-1">{stats.active_users}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center text-2xl">
                            ✅
                        </div>
                    </div>
                    <div className="mt-3 text-xs text-green-400">
                        অনুমোদিত: {stats.approved_users}
                    </div>
                </div>

                {/* Today Stats */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-xl p-5 border border-purple-500/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-purple-300">আজ নতুন</p>
                            <p className="text-3xl font-bold text-purple-400 mt-1">{stats.today_users}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center text-2xl">
                            📈
                        </div>
                    </div>
                    <div className="mt-3 text-xs text-purple-400">
                        এই সপ্তাহে: +{stats.week_users}
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - 2/3 width */}
                <div className="lg:col-span-2 space-y-6">
                    {/* User Growth Chart */}
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                        <h3 className="font-semibold text-white mb-4">📊 ব্যবহারকারী বৃদ্ধি (গত ৭ দিন)</h3>
                        <div className="flex items-end justify-between gap-2 h-40">
                            {user_growth.map((day, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center">
                                    <div className="w-full flex flex-col items-center justify-end h-32">
                                        <span className="text-xs text-gray-400 mb-1">{day.count}</span>
                                        <div
                                            className="w-full max-w-[40px] bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-lg transition-all duration-300"
                                            style={{
                                                height: `${Math.max((day.count / maxCount) * 100, 5)}%`,
                                                minHeight: '8px'
                                            }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500 mt-2">{day.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Registrations */}
                    <div className="bg-gray-800 rounded-xl border border-gray-700">
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <h3 className="font-semibold text-white">🆕 সাম্প্রতিক রেজিস্ট্রেশন</h3>
                            <Link href="/admin/users" className="text-sm text-green-400 hover:underline">
                                সব দেখুন →
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-700">
                            {recent_users.slice(0, 5).map((user) => (
                                <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-700/30">
                                    <div className="flex items-center gap-3">
                                        {user.profile_image ? (
                                            <img
                                                src={user.profile_image}
                                                alt={user.name}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-white font-semibold">
                                                {user.name.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-white">{user.name}</p>
                                            <p className="text-sm text-gray-400">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">{user.created_at}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.is_approved
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {user.is_approved ? '✅' : '⏳'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {recent_users.length === 0 && (
                                <div className="p-8 text-center text-gray-500">
                                    কোনো ব্যবহারকারী নেই
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - 1/3 width */}
                <div className="space-y-6">
                    {/* Pending Approvals */}
                    <div className="bg-gray-800 rounded-xl border border-yellow-500/30">
                        <div className="p-4 border-b border-gray-700 bg-yellow-500/10">
                            <h3 className="font-semibold text-yellow-400 flex items-center gap-2">
                                ⚠️ অনুমোদন প্রয়োজন
                                {pending_approvals.length > 0 && (
                                    <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                                        {pending_approvals.length}
                                    </span>
                                )}
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-700">
                            {pending_approvals.map((user) => (
                                <div key={user.id} className="p-3">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-400 text-sm font-semibold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-white text-sm truncate">{user.name}</p>
                                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">{user.created_at}</span>
                                        <button
                                            onClick={() => handleQuickApprove(user.id)}
                                            className="px-3 py-1 rounded-lg bg-green-500 text-white text-xs hover:bg-green-600 transition-colors"
                                        >
                                            ✓ অনুমোদন
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {pending_approvals.length === 0 && (
                                <div className="p-6 text-center text-gray-500 text-sm">
                                    ✅ কোনো অপেক্ষমান অনুরোধ নেই
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                        <h3 className="font-semibold text-white mb-3">⚡ দ্রুত কাজ</h3>
                        <div className="space-y-2">
                            <Link
                                href="/admin/users"
                                className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                            >
                                <span>👥</span>
                                <span>সব ব্যবহারকারী</span>
                            </Link>
                            <Link
                                href="/admin/cloudinary"
                                className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
                            >
                                <span>☁️</span>
                                <span>Cloudinary সেটিংস</span>
                            </Link>
                            <Link
                                href="/admin/settings"
                                className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-700 transition-colors"
                            >
                                <span>⚙️</span>
                                <span>সিস্টেম সেটিংস</span>
                            </Link>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-4">
                        <h3 className="font-semibold text-white mb-3">🖥️ সিস্টেম স্ট্যাটাস</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">সার্ভার</span>
                                <span className="flex items-center gap-1 text-green-400">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    অনলাইন
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">ডাটাবেস</span>
                                <span className="text-green-400">সংযুক্ত</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Cloudinary</span>
                                <span className={system_status.cloudinary === 'configured' ? 'text-green-400' : 'text-yellow-400'}>
                                    {system_status.cloudinary === 'configured' ? '✅ কনফিগার্ড' : '⚠️ সেটআপ নেই'}
                                </span>
                            </div>
                            <hr className="border-gray-700" />
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">ভার্সন</span>
                                <span className="text-white font-mono">{system_status.version}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Laravel</span>
                                <span className="text-gray-300 font-mono text-xs">{system_status.laravel_version}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
