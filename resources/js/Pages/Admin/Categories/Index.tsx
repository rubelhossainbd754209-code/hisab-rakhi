import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import type { PageProps } from '@/types';

interface Template {
    id: number;
    name: string;
    slug: string;
    thumbnail: string | null;
    is_default: boolean;
    is_active: boolean;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
    image: string | null;
    description: string | null;
    is_active: boolean;
    sort_order: number;
    templates_count: number;
    templates: Template[];
}

interface CategoriesPageProps extends PageProps {
    categories: Category[];
}

export default function CategoriesIndex({ categories }: CategoriesPageProps) {
    const { flash } = usePage().props as any;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        icon: '📊',
        description: '',
    });

    const emojiOptions = ['🏪', '💊', '📱', '🍽️', '🔧', '🕌', '👕', '🌾', '🚗', '📊', '🏠', '💼', '🎓', '🏥', '✂️'];

    const openAddModal = () => {
        setEditingCategory(null);
        setFormData({ name: '', icon: '📊', description: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            icon: category.icon,
            description: category.description || '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (editingCategory) {
            router.put(`/admin/categories/${editingCategory.id}`, formData, {
                onSuccess: () => { closeModal(); setIsSubmitting(false); },
                onError: () => setIsSubmitting(false),
            });
        } else {
            router.post('/admin/categories', formData, {
                onSuccess: () => { closeModal(); setIsSubmitting(false); },
                onError: () => setIsSubmitting(false),
            });
        }
    };

    const handleToggleActive = (category: Category) => {
        router.post(`/admin/categories/${category.id}/toggle-active`);
    };

    const handleDelete = (category: Category) => {
        if (confirm(`"${category.name}" ক্যাটাগরি মুছে ফেলতে চান?`)) {
            router.delete(`/admin/categories/${category.id}`);
        }
    };

    return (
        <AdminLayout title="ক্যাটাগরি ম্যানেজমেন্ট">
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

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">📁 ব্যবসার ক্যাটাগরি</h1>
                    <p className="text-gray-400 mt-1">ব্যবসার ধরন অনুযায়ী ক্যাটাগরি ম্যানেজ করুন</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium flex items-center gap-2"
                >
                    <span>➕</span>
                    <span>নতুন ক্যাটাগরি</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">মোট ক্যাটাগরি</p>
                    <p className="text-2xl font-bold text-white">{categories.length}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">সক্রিয় ক্যাটাগরি</p>
                    <p className="text-2xl font-bold text-green-400">{categories.filter(c => c.is_active).length}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">মোট টেমপ্লেট</p>
                    <p className="text-2xl font-bold text-blue-400">{categories.reduce((sum, c) => sum + c.templates_count, 0)}</p>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className={`bg-gray-800 rounded-xl border p-5 transition-all hover:border-green-500/50 ${category.is_active ? 'border-gray-700' : 'border-red-500/30 opacity-60'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-2xl">
                                    {category.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{category.name}</h3>
                                    <p className="text-sm text-gray-500">{category.slug}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${category.is_active
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}>
                                {category.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                            </span>
                        </div>

                        {category.description && (
                            <p className="text-sm text-gray-400 mb-3 line-clamp-2">{category.description}</p>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                            <span className="text-sm text-gray-500">
                                🎨 {category.templates_count} টেমপ্লেট
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleToggleActive(category)}
                                    className={`p-2 rounded-lg text-sm ${category.is_active
                                            ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                                            : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                        }`}
                                    title={category.is_active ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                                >
                                    {category.is_active ? '⏸️' : '▶️'}
                                </button>
                                <button
                                    onClick={() => openEditModal(category)}
                                    className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                                    title="এডিট"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleDelete(category)}
                                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                    title="মুছুন"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
                    <div className="text-5xl mb-4">📁</div>
                    <h3 className="text-xl font-semibold text-white mb-2">কোনো ক্যাটাগরি নেই</h3>
                    <p className="text-gray-400 mb-6">প্রথম ক্যাটাগরি যোগ করুন</p>
                    <button
                        onClick={openAddModal}
                        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium"
                    >
                        ➕ ক্যাটাগরি যোগ করুন
                    </button>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b border-gray-700">
                            <h3 className="text-xl font-bold text-white">
                                {editingCategory ? '✏️ ক্যাটাগরি এডিট' : '➕ নতুন ক্যাটাগরি'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-white text-xl">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    ক্যাটাগরির নাম *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="যেমন: মুদি দোকান"
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    আইকন
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {emojiOptions.map((emoji) => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, icon: emoji })}
                                            className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${formData.icon === emoji
                                                    ? 'bg-green-500 scale-110'
                                                    : 'bg-gray-700 hover:bg-gray-600'
                                                }`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    বিবরণ
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="এই ক্যাটাগরি সম্পর্কে সংক্ষিপ্ত বিবরণ..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium"
                                >
                                    বাতিল
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium disabled:opacity-50"
                                >
                                    {isSubmitting ? '⏳ সেভ হচ্ছে...' : '💾 সেভ করুন'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
