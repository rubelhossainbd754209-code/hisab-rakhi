import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import type { PageProps } from '@/types';

interface CloudinaryAccount {
    id: number;
    name: string;
    cloud_name: string;
    api_key_masked: string;
    is_active: boolean;
    created_at: string;
}

interface CloudinaryPageProps extends PageProps {
    accounts: CloudinaryAccount[];
}

export default function CloudinaryIndex({ auth, accounts }: CloudinaryPageProps) {
    const { flash } = usePage().props as any;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<CloudinaryAccount | null>(null);
    const [isTestingConnection, setIsTestingConnection] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        cloud_name: '',
        api_key: '',
        api_secret: '',
    });

    const openAddModal = () => {
        setEditingAccount(null);
        setFormData({ name: '', cloud_name: '', api_key: '', api_secret: '' });
        setTestResult(null);
        setIsModalOpen(true);
    };

    const openEditModal = (account: CloudinaryAccount) => {
        setEditingAccount(account);
        setFormData({
            name: account.name,
            cloud_name: account.cloud_name,
            api_key: '',
            api_secret: '',
        });
        setTestResult(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAccount(null);
        setTestResult(null);
    };

    const handleTestConnection = async () => {
        if (!formData.cloud_name || !formData.api_key || !formData.api_secret) {
            setTestResult({ success: false, message: 'সব ক্রেডেনশিয়াল দিন।' });
            return;
        }

        setIsTestingConnection(true);
        setTestResult(null);

        try {
            const response = await fetch('/admin/cloudinary/test-connection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    cloud_name: formData.cloud_name,
                    api_key: formData.api_key,
                    api_secret: formData.api_secret,
                }),
            });

            const data = await response.json();
            setTestResult({ success: data.success, message: data.message });
        } catch (error) {
            setTestResult({ success: false, message: 'সংযোগ পরীক্ষা ব্যর্থ।' });
        } finally {
            setIsTestingConnection(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (editingAccount) {
            router.put(`/admin/cloudinary/${editingAccount.id}`, formData, {
                onSuccess: () => {
                    closeModal();
                    setIsSubmitting(false);
                },
                onError: () => setIsSubmitting(false),
            });
        } else {
            router.post('/admin/cloudinary', formData, {
                onSuccess: () => {
                    closeModal();
                    setIsSubmitting(false);
                },
                onError: () => setIsSubmitting(false),
            });
        }
    };

    const handleActivate = (account: CloudinaryAccount) => {
        if (account.is_active) return;
        router.post(`/admin/cloudinary/${account.id}/activate`);
    };

    const handleDelete = (account: CloudinaryAccount) => {
        if (account.is_active) {
            alert('সক্রিয় অ্যাকাউন্ট মুছে ফেলা যাবে না।');
            return;
        }
        if (confirm(`"${account.name}" অ্যাকাউন্ট মুছে ফেলতে চান?`)) {
            router.delete(`/admin/cloudinary/${account.id}`);
        }
    };

    return (
        <AdminLayout title="Cloudinary সেটিংস">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">☁️ Cloudinary অ্যাকাউন্ট</h1>
                    <p className="text-gray-400 mt-1">ফাইল আপলোডের জন্য Cloudinary অ্যাকাউন্ট ম্যানেজ করুন</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium flex items-center gap-2"
                >
                    <span>➕</span>
                    <span>নতুন অ্যাকাউন্ট</span>
                </button>
            </div>

            {/* Flash Messages */}
            {flash?.success && (
                <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400">
                    ✅ {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
                    ❌ {flash.error}
                </div>
            )}

            {/* Accounts List */}
            {accounts.length === 0 ? (
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
                    <div className="text-5xl mb-4">☁️</div>
                    <h3 className="text-xl font-semibold text-white mb-2">কোনো অ্যাকাউন্ট নেই</h3>
                    <p className="text-gray-400 mb-6">ফাইল আপলোডের জন্য একটি Cloudinary অ্যাকাউন্ট যোগ করুন</p>
                    <button
                        onClick={openAddModal}
                        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium"
                    >
                        ➕ প্রথম অ্যাকাউন্ট যোগ করুন
                    </button>
                </div>
            ) : (
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">অ্যাকাউন্ট</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Cloud Name</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">API Key</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">স্টেটাস</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">তৈরি</th>
                                <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {accounts.map((account) => (
                                <tr key={account.id} className="hover:bg-gray-700/30">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${account.is_active ? 'bg-green-500/20' : 'bg-gray-700'
                                                }`}>
                                                ☁️
                                            </div>
                                            <span className="font-medium text-white">{account.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 font-mono text-sm">
                                        {account.cloud_name}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 font-mono text-sm">
                                        {account.api_key_masked}
                                    </td>
                                    <td className="px-6 py-4">
                                        {account.is_active ? (
                                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                                                ✅ সক্রিয়
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-gray-700 text-gray-400 rounded-full text-sm">
                                                নিষ্ক্রিয়
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {account.created_at}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {!account.is_active && (
                                                <button
                                                    onClick={() => handleActivate(account)}
                                                    className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm"
                                                >
                                                    সক্রিয় করুন
                                                </button>
                                            )}
                                            <button
                                                onClick={() => openEditModal(account)}
                                                className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm"
                                            >
                                                ✏️ এডিট
                                            </button>
                                            {!account.is_active && (
                                                <button
                                                    onClick={() => handleDelete(account)}
                                                    className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm"
                                                >
                                                    🗑️
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <h4 className="font-medium text-blue-400 mb-2">ℹ️ তথ্য</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                    <li>• একটি সময়ে শুধু একটি অ্যাকাউন্ট সক্রিয় থাকতে পারে</li>
                    <li>• সক্রিয় অ্যাকাউন্টে সব ফাইল আপলোড হবে</li>
                    <li>• API credentials Cloudinary Dashboard থেকে পাবেন</li>
                </ul>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b border-gray-700">
                            <h3 className="text-xl font-bold text-white">
                                {editingAccount ? '✏️ অ্যাকাউন্ট এডিট' : '➕ নতুন অ্যাকাউন্ট'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-white">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    অ্যাকাউন্টের নাম
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="যেমন: Primary Account"
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Cloud Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.cloud_name}
                                    onChange={(e) => setFormData({ ...formData, cloud_name: e.target.value })}
                                    placeholder="your-cloud-name"
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    API Key {editingAccount && <span className="text-gray-500">(পরিবর্তন করতে চাইলে দিন)</span>}
                                </label>
                                <input
                                    type="text"
                                    value={formData.api_key}
                                    onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                                    placeholder="123456789012345"
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                                    required={!editingAccount}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    API Secret {editingAccount && <span className="text-gray-500">(পরিবর্তন করতে চাইলে দিন)</span>}
                                </label>
                                <input
                                    type="password"
                                    value={formData.api_secret}
                                    onChange={(e) => setFormData({ ...formData, api_secret: e.target.value })}
                                    placeholder="••••••••••••••••••••"
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                                    required={!editingAccount}
                                />
                            </div>

                            {/* Test Connection Result */}
                            {testResult && (
                                <div className={`p-4 rounded-xl ${testResult.success
                                    ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                                    : 'bg-red-500/20 border border-red-500/30 text-red-400'
                                    }`}>
                                    {testResult.message}
                                </div>
                            )}

                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleTestConnection}
                                    disabled={isTestingConnection}
                                    className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium disabled:opacity-50"
                                >
                                    {isTestingConnection ? '🔄 পরীক্ষা হচ্ছে...' : '🔌 সংযোগ পরীক্ষা'}
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium disabled:opacity-50"
                                >
                                    {isSubmitting ? '⏳ সেভ হচ্ছে...' : editingAccount ? '💾 আপডেট করুন' : '💾 সেভ করুন'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
