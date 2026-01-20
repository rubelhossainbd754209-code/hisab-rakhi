import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import type { PageProps, User } from '@/types';

interface UsersPageProps extends PageProps {
    users?: User[];
    filter?: string;
}

export default function UsersIndex({ auth, users = [], filter }: UsersPageProps) {
    const [activeFilter, setActiveFilter] = useState(filter || 'all');
    const [searchQuery, setSearchQuery] = useState('');

    // Demo users
    const demoUsers = users.length > 0 ? users : [
        { id: 1, name: 'রহিম সাহেব', email: 'rahim@example.com', phone: '01712345678', role: 'user', is_approved: false, is_active: true, created_at: '2026-01-16T10:00:00' },
        { id: 2, name: 'করিম মিয়া', email: 'karim@example.com', phone: '01812345678', role: 'user', is_approved: true, is_active: true, created_at: '2026-01-15T14:00:00' },
        { id: 3, name: 'সালমা বেগম', email: 'salma@example.com', phone: '01912345678', role: 'user', is_approved: false, is_active: true, created_at: '2026-01-15T09:00:00' },
        { id: 4, name: 'জামাল উদ্দিন', email: 'jamal@example.com', phone: '01612345678', role: 'user', is_approved: true, is_active: false, created_at: '2026-01-14T16:00:00' },
        { id: 5, name: 'ফাতেমা খাতুন', email: 'fatema@example.com', phone: '01512345678', role: 'user', is_approved: true, is_active: true, created_at: '2026-01-14T11:00:00' },
    ];

    const filteredUsers = demoUsers.filter((user: any) => {
        const matchesFilter = activeFilter === 'all' ||
            (activeFilter === 'pending' && !user.is_approved) ||
            (activeFilter === 'approved' && user.is_approved) ||
            (activeFilter === 'inactive' && !user.is_active);
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone?.includes(searchQuery);
        return matchesFilter && matchesSearch;
    });

    const handleApprove = (userId: number) => {
        if (confirm('এই ব্যবহারকারীকে অনুমোদন দিতে চান?')) {
            router.post(`/admin/users/${userId}/approve`);
        }
    };

    const handleReject = (userId: number) => {
        if (confirm('এই ব্যবহারকারীকে প্রত্যাখ্যান করতে চান?')) {
            router.post(`/admin/users/${userId}/reject`);
        }
    };

    const handleToggleActive = (userId: number, currentStatus: boolean) => {
        const action = currentStatus ? 'নিষ্ক্রিয়' : 'সক্রিয়';
        if (confirm(`এই ব্যবহারকারীকে ${action} করতে চান?`)) {
            router.post(`/admin/users/${userId}/toggle-active`);
        }
    };

    return (
        <AdminLayout title="ব্যবহারকারী ম্যানেজমেন্ট">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">ব্যবহারকারী</h1>
                    <p className="text-gray-400">সকল ব্যবহারকারী দেখুন ও পরিচালনা করুন</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
                    <p className="text-2xl font-bold text-white">{demoUsers.length}</p>
                    <p className="text-sm text-gray-400">মোট</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
                    <p className="text-2xl font-bold text-yellow-400">{demoUsers.filter((u: any) => !u.is_approved).length}</p>
                    <p className="text-sm text-gray-400">অপেক্ষমান</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
                    <p className="text-2xl font-bold text-green-400">{demoUsers.filter((u: any) => u.is_approved).length}</p>
                    <p className="text-sm text-gray-400">অনুমোদিত</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
                    <p className="text-2xl font-bold text-red-400">{demoUsers.filter((u: any) => !u.is_active).length}</p>
                    <p className="text-sm text-gray-400">নিষ্ক্রিয়</p>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="নাম, ইমেইল বা ফোন দিয়ে খুঁজুন..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500"
                    />
                </div>
                <div className="flex gap-2">
                    {[
                        { key: 'all', label: 'সব' },
                        { key: 'pending', label: 'অপেক্ষমান' },
                        { key: 'approved', label: 'অনুমোদিত' },
                        { key: 'inactive', label: 'নিষ্ক্রিয়' },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveFilter(tab.key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilter === tab.key
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-900/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">ব্যবহারকারী</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">যোগাযোগ</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">স্ট্যাটাস</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">রেজিস্ট্রেশন</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredUsers.map((user: any) => (
                                <tr key={user.id} className="hover:bg-gray-700/30">
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-white font-semibold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.role}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <p className="text-white text-sm">{user.email}</p>
                                        <p className="text-gray-500 text-xs">{user.phone}</p>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${user.is_approved
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {user.is_approved ? '✓ অনুমোদিত' : '⏳ অপেক্ষমান'}
                                            </span>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${user.is_active
                                                    ? 'bg-blue-500/20 text-blue-400'
                                                    : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                {user.is_active ? '● সক্রিয়' : '○ নিষ্ক্রিয়'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-gray-400 text-sm">
                                        {new Date(user.created_at).toLocaleDateString('bn-BD')}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {!user.is_approved && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(user.id)}
                                                        className="px-3 py-1.5 rounded-lg bg-green-500 text-white text-sm hover:bg-green-600"
                                                    >
                                                        অনুমোদন
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(user.id)}
                                                        className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30"
                                                    >
                                                        বাতিল
                                                    </button>
                                                </>
                                            )}
                                            {user.is_approved && (
                                                <button
                                                    onClick={() => handleToggleActive(user.id, user.is_active)}
                                                    className={`px-3 py-1.5 rounded-lg text-sm ${user.is_active
                                                            ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                                        }`}
                                                >
                                                    {user.is_active ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                                                </button>
                                            )}
                                            <Link
                                                href={`/admin/users/${user.id}`}
                                                className="px-3 py-1.5 rounded-lg bg-gray-700 text-gray-300 text-sm hover:bg-gray-600"
                                            >
                                                বিস্তারিত
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
