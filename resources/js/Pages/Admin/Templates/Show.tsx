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

interface Module {
    id: string;
    name: string;
    icon: string;
    description: string;
}

interface Feature {
    id: string;
    name: string;
    description: string;
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
}

interface TemplateShowProps extends PageProps {
    template: Template;
    available_modules: Module[];
    available_features: Feature[];
}

export default function TemplateShow({ template, available_modules, available_features }: TemplateShowProps) {
    const { flash } = usePage().props as any;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<'modules' | 'colors' | 'terminology' | 'features'>('modules');

    const [config, setConfig] = useState<TemplateConfig>(template.config);
    const [formData, setFormData] = useState({
        name: template.name,
        description: template.description || '',
    });

    const toggleModule = (moduleId: string) => {
        const modules = config.modules.includes(moduleId)
            ? config.modules.filter(m => m !== moduleId)
            : [...config.modules, moduleId];
        setConfig({ ...config, modules });
    };

    const toggleFeature = (featureId: string) => {
        const features = config.features || [];
        const newFeatures = features.includes(featureId)
            ? features.filter(f => f !== featureId)
            : [...features, featureId];
        setConfig({ ...config, features: newFeatures });
    };

    const updateColor = (key: 'primary' | 'secondary' | 'accent', value: string) => {
        setConfig({
            ...config,
            colors: { ...config.colors, [key]: value }
        });
    };

    const updateTerminology = (key: string, value: string) => {
        setConfig({
            ...config,
            terminology: { ...config.terminology, [key]: value }
        });
    };

    const handleSave = () => {
        setIsSubmitting(true);
        router.put(`/admin/templates/${template.id}`, {
            name: formData.name,
            description: formData.description,
            config: config,
        }, {
            onSuccess: () => setIsSubmitting(false),
            onError: () => setIsSubmitting(false),
        });
    };

    const tabs = [
        { id: 'modules', name: '📦 মডিউল', count: config.modules.length },
        { id: 'colors', name: '🎨 কালার' },
        { id: 'terminology', name: '📝 টার্মিনোলজি' },
        { id: 'features', name: '⚡ ফিচার', count: config.features?.length || 0 },
    ];

    return (
        <AdminLayout title={`${template.name} - এডিট`}>
            {/* Flash Messages */}
            {flash?.success && (
                <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400">
                    ✅ {flash.success}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/templates"
                        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400"
                    >
                        ←
                    </Link>
                    <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: config.colors.primary }}
                    >
                        {template.category.icon}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{template.name}</h1>
                        <p className="text-gray-400">{template.category.name}</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium disabled:opacity-50 flex items-center gap-2"
                >
                    {isSubmitting ? '⏳' : '💾'} সেভ করুন
                </button>
            </div>

            {/* Basic Info */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-6">
                <h2 className="font-semibold text-white mb-4">📝 বেসিক তথ্য</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">টেমপ্লেটের নাম</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">বিবরণ</label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === tab.id
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                    >
                        {tab.name}
                        {tab.count !== undefined && (
                            <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-700'
                                }`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                {/* Modules Tab */}
                {activeTab === 'modules' && (
                    <div>
                        <h2 className="font-semibold text-white mb-4">📦 মডিউল সিলেক্ট করুন</h2>
                        <p className="text-gray-400 text-sm mb-6">এই টেমপ্লেটে কোন কোন ফিচার থাকবে সিলেক্ট করুন</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {available_modules.map((module) => {
                                const isActive = config.modules.includes(module.id);
                                return (
                                    <button
                                        key={module.id}
                                        onClick={() => toggleModule(module.id)}
                                        className={`p-4 rounded-xl border text-left transition-all ${isActive
                                                ? 'border-green-500 bg-green-500/10'
                                                : 'border-gray-700 bg-gray-700/30 hover:border-gray-600'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-2xl">{module.icon}</span>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isActive
                                                    ? 'border-green-500 bg-green-500'
                                                    : 'border-gray-600'
                                                }`}>
                                                {isActive && <span className="text-white text-xs">✓</span>}
                                            </div>
                                        </div>
                                        <h3 className={`font-medium ${isActive ? 'text-green-400' : 'text-white'}`}>
                                            {module.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">{module.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Colors Tab */}
                {activeTab === 'colors' && (
                    <div>
                        <h2 className="font-semibold text-white mb-4">🎨 কালার স্কিম</h2>
                        <p className="text-gray-400 text-sm mb-6">টেমপ্লেটের রঙ কাস্টমাইজ করুন</p>

                        {/* Color Preview */}
                        <div
                            className="h-32 rounded-xl mb-6 flex items-center justify-center"
                            style={{
                                background: `linear-gradient(135deg, ${config.colors.primary}, ${config.colors.secondary})`
                            }}
                        >
                            <div className="text-center">
                                <div
                                    className="w-16 h-16 rounded-xl mx-auto mb-2 flex items-center justify-center text-2xl"
                                    style={{ backgroundColor: config.colors.accent }}
                                >
                                    {template.category.icon}
                                </div>
                                <p className="text-white font-semibold">প্রিভিউ</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Primary Color */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Primary Color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={config.colors.primary}
                                        onChange={(e) => updateColor('primary', e.target.value)}
                                        className="w-12 h-12 rounded-lg cursor-pointer border-0"
                                    />
                                    <input
                                        type="text"
                                        value={config.colors.primary}
                                        onChange={(e) => updateColor('primary', e.target.value)}
                                        className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>

                            {/* Secondary Color */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Secondary Color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={config.colors.secondary}
                                        onChange={(e) => updateColor('secondary', e.target.value)}
                                        className="w-12 h-12 rounded-lg cursor-pointer border-0"
                                    />
                                    <input
                                        type="text"
                                        value={config.colors.secondary}
                                        onChange={(e) => updateColor('secondary', e.target.value)}
                                        className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>

                            {/* Accent Color */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Accent Color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={config.colors.accent}
                                        onChange={(e) => updateColor('accent', e.target.value)}
                                        className="w-12 h-12 rounded-lg cursor-pointer border-0"
                                    />
                                    <input
                                        type="text"
                                        value={config.colors.accent}
                                        onChange={(e) => updateColor('accent', e.target.value)}
                                        className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Terminology Tab */}
                {activeTab === 'terminology' && (
                    <div>
                        <h2 className="font-semibold text-white mb-4">📝 টার্মিনোলজি</h2>
                        <p className="text-gray-400 text-sm mb-6">এই টেমপ্লেটে ব্যবহৃত শব্দগুলো কাস্টমাইজ করুন</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(config.terminology).map(([key, value]) => (
                                <div key={key} className="flex items-center gap-3">
                                    <span className="w-32 text-gray-400 text-sm">{key}</span>
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => updateTerminology(key, e.target.value)}
                                        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            ))}
                        </div>

                        {Object.keys(config.terminology).length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                কোনো টার্মিনোলজি সেট করা নেই
                            </div>
                        )}
                    </div>
                )}

                {/* Features Tab */}
                {activeTab === 'features' && (
                    <div>
                        <h2 className="font-semibold text-white mb-4">⚡ অতিরিক্ত ফিচার</h2>
                        <p className="text-gray-400 text-sm mb-6">এই টেমপ্লেটে কোন অতিরিক্ত ফিচার থাকবে</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {available_features.map((feature) => {
                                const isActive = config.features?.includes(feature.id);
                                return (
                                    <button
                                        key={feature.id}
                                        onClick={() => toggleFeature(feature.id)}
                                        className={`p-4 rounded-xl border text-left transition-all ${isActive
                                                ? 'border-purple-500 bg-purple-500/10'
                                                : 'border-gray-700 bg-gray-700/30 hover:border-gray-600'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-lg">⚡</span>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isActive
                                                    ? 'border-purple-500 bg-purple-500'
                                                    : 'border-gray-600'
                                                }`}>
                                                {isActive && <span className="text-white text-xs">✓</span>}
                                            </div>
                                        </div>
                                        <h3 className={`font-medium ${isActive ? 'text-purple-400' : 'text-white'}`}>
                                            {feature.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
