import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import type { PageProps } from '@/types';

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
}

interface TemplateConfig {
    colors: {
        primary: string;
        secondary: string;
        accent: string;
    };
    terminology: Record<string, string>;
    modules: string[];
    features?: string[];
    default_categories?: string[];
}

interface Template {
    id: number;
    name: string;
    slug: string;
    thumbnail: string | null;
    description: string | null;
    is_default: boolean;
    is_active: boolean;
    category: Category;
    config: TemplateConfig;
    businesses_count: number;
}

interface TemplatesPageProps extends PageProps {
    templates: Template[];
    categories: Category[];
}

export default function TemplatesIndex({ templates, categories }: TemplatesPageProps) {
    const { flash } = usePage().props as any;
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

    const filteredTemplates = selectedCategory === 'all'
        ? templates
        : templates.filter(t => t.category.slug === selectedCategory);

    const handleToggleActive = (template: Template) => {
        router.post(`/admin/templates/${template.id}/toggle-active`);
    };

    return (
        <AdminLayout title="টেমপ্লেট ম্যানেজমেন্ট">
            {/* Flash Messages */}
            {flash?.success && (
                <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400">
                    ✅ {flash.success}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">🎨 টেমপ্লেট ম্যানেজমেন্ট</h1>
                    <p className="text-gray-400 mt-1">ব্যবসার টেমপ্লেট কাস্টমাইজ ও ম্যানেজ করুন</p>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${selectedCategory === 'all'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                >
                    সব ({templates.length})
                </button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.slug)}
                        className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-2 ${selectedCategory === category.slug
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                    >
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                    </button>
                ))}
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                    <div
                        key={template.id}
                        className={`bg-gray-800 rounded-2xl border overflow-hidden transition-all hover:border-green-500/50 ${template.is_active ? 'border-gray-700' : 'border-red-500/30 opacity-60'
                            }`}
                    >
                        {/* Template Preview Header */}
                        <div
                            className="h-32 relative"
                            style={{
                                background: `linear-gradient(135deg, ${template.config.colors.primary}40, ${template.config.colors.secondary}30)`
                            }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                                    style={{ backgroundColor: template.config.colors.primary + '30' }}
                                >
                                    {template.category.icon}
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="absolute top-3 right-3">
                                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${template.is_active
                                        ? 'bg-green-500/80 text-white'
                                        : 'bg-red-500/80 text-white'
                                    }`}>
                                    {template.is_active ? '✓ সক্রিয়' : 'নিষ্ক্রিয়'}
                                </span>
                            </div>

                            {/* Color Swatches */}
                            <div className="absolute bottom-3 left-3 flex gap-1">
                                <div
                                    className="w-5 h-5 rounded-full border-2 border-white/50"
                                    style={{ backgroundColor: template.config.colors.primary }}
                                    title="Primary Color"
                                />
                                <div
                                    className="w-5 h-5 rounded-full border-2 border-white/50"
                                    style={{ backgroundColor: template.config.colors.secondary }}
                                    title="Secondary Color"
                                />
                                <div
                                    className="w-5 h-5 rounded-full border-2 border-white/50"
                                    style={{ backgroundColor: template.config.colors.accent }}
                                    title="Accent Color"
                                />
                            </div>
                        </div>

                        {/* Template Info */}
                        <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="font-semibold text-white">{template.name}</h3>
                                    <p className="text-sm text-gray-500">{template.category.name}</p>
                                </div>
                            </div>

                            {template.description && (
                                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{template.description}</p>
                            )}

                            {/* Modules Pills */}
                            <div className="flex flex-wrap gap-1 mb-3">
                                {template.config.modules.slice(0, 4).map((module) => (
                                    <span
                                        key={module}
                                        className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs"
                                    >
                                        {module}
                                    </span>
                                ))}
                                {template.config.modules.length > 4 && (
                                    <span className="px-2 py-0.5 bg-gray-700 text-gray-400 rounded text-xs">
                                        +{template.config.modules.length - 4}
                                    </span>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                <span>🏪 {template.businesses_count} ব্যবসা</span>
                                <span>📦 {template.config.modules.length} মডিউল</span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPreviewTemplate(template)}
                                    className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-xl text-sm hover:bg-blue-500/30 transition-colors"
                                >
                                    👁️ প্রিভিউ
                                </button>
                                <Link
                                    href={`/admin/templates/${template.id}`}
                                    className="flex-1 px-3 py-2 bg-green-500/20 text-green-400 rounded-xl text-sm hover:bg-green-500/30 transition-colors text-center"
                                >
                                    ✏️ এডিট
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredTemplates.length === 0 && (
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
                    <div className="text-5xl mb-4">🎨</div>
                    <h3 className="text-xl font-semibold text-white mb-2">কোনো টেমপ্লেট নেই</h3>
                    <p className="text-gray-400">এই ক্যাটাগরিতে টেমপ্লেট পাওয়া যায়নি</p>
                </div>
            )}

            {/* Preview Modal */}
            {previewTemplate && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div
                            className="p-6 border-b border-gray-700"
                            style={{
                                background: `linear-gradient(135deg, ${previewTemplate.config.colors.primary}20, ${previewTemplate.config.colors.secondary}10)`
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                                        style={{ backgroundColor: previewTemplate.config.colors.primary }}
                                    >
                                        {previewTemplate.category.icon}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{previewTemplate.name}</h2>
                                        <p className="text-gray-400">{previewTemplate.category.name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setPreviewTemplate(null)}
                                    className="text-gray-400 hover:text-white text-2xl"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Colors */}
                                <div className="bg-gray-800 rounded-xl p-4">
                                    <h3 className="font-semibold text-white mb-3">🎨 কালার স্কিম</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-lg"
                                                style={{ backgroundColor: previewTemplate.config.colors.primary }}
                                            />
                                            <div>
                                                <p className="text-sm text-gray-400">Primary</p>
                                                <p className="text-white font-mono text-sm">{previewTemplate.config.colors.primary}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-lg"
                                                style={{ backgroundColor: previewTemplate.config.colors.secondary }}
                                            />
                                            <div>
                                                <p className="text-sm text-gray-400">Secondary</p>
                                                <p className="text-white font-mono text-sm">{previewTemplate.config.colors.secondary}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-lg"
                                                style={{ backgroundColor: previewTemplate.config.colors.accent }}
                                            />
                                            <div>
                                                <p className="text-sm text-gray-400">Accent</p>
                                                <p className="text-white font-mono text-sm">{previewTemplate.config.colors.accent}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Modules */}
                                <div className="bg-gray-800 rounded-xl p-4">
                                    <h3 className="font-semibold text-white mb-3">📦 মডিউল সমূহ</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {previewTemplate.config.modules.map((module) => (
                                            <span
                                                key={module}
                                                className="px-3 py-1.5 rounded-lg text-sm font-medium"
                                                style={{
                                                    backgroundColor: previewTemplate.config.colors.primary + '30',
                                                    color: previewTemplate.config.colors.primary
                                                }}
                                            >
                                                ✓ {module}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Terminology */}
                                {Object.keys(previewTemplate.config.terminology || {}).length > 0 && (
                                    <div className="bg-gray-800 rounded-xl p-4">
                                        <h3 className="font-semibold text-white mb-3">📝 টার্মিনোলজি</h3>
                                        <div className="space-y-2">
                                            {Object.entries(previewTemplate.config.terminology).map(([key, value]) => (
                                                <div key={key} className="flex justify-between text-sm">
                                                    <span className="text-gray-400">{key}</span>
                                                    <span className="text-white">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Default Categories */}
                                {previewTemplate.config.default_categories && previewTemplate.config.default_categories.length > 0 && (
                                    <div className="bg-gray-800 rounded-xl p-4">
                                        <h3 className="font-semibold text-white mb-3">📁 ডিফল্ট ক্যাটাগরি</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {previewTemplate.config.default_categories.map((cat) => (
                                                <span
                                                    key={cat}
                                                    className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm"
                                                >
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-gray-700 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setPreviewTemplate(null)}
                                className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600"
                            >
                                বন্ধ করুন
                            </button>
                            <Link
                                href={`/admin/templates/${previewTemplate.id}`}
                                className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600"
                            >
                                ✏️ এডিট করুন
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
