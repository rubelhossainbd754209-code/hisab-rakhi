import React, { useState } from 'react';
import { Button } from '@/Components/Common';
import type { Template, TemplateModule } from '@/types';

interface StepTemplateSelectProps {
    templates: Template[];
    selectedId: string;
    onSelect: (id: string, modules: string[]) => void;
    onNext: () => void;
    onBack: () => void;
}

// Default templates if none provided
const defaultTemplates: Template[] = [
    {
        id: 't1',
        category_id: '1',
        name_bn: 'সাধারণ দোকান',
        description: 'দৈনিক আয়-ব্যয়, পার্টি হিসাব ও স্টক',
        modules: [
            { id: 'm1', name_bn: 'দৈনিক হিসাব', icon: '📅', is_default: true, is_required: true, sort_order: 1 },
            { id: 'm2', name_bn: 'পার্টি হিসাব', icon: '👥', is_default: true, is_required: true, sort_order: 2 },
            { id: 'm3', name_bn: 'পণ্য মজুদ', icon: '📦', is_default: true, is_required: false, sort_order: 3 },
            { id: 'm4', name_bn: 'বিল তৈরি', icon: '🧾', is_default: true, is_required: false, sort_order: 4 },
            { id: 'm5', name_bn: 'রিপোর্ট', icon: '📊', is_default: true, is_required: false, sort_order: 5 },
        ],
        settings: {},
        is_active: true,
        created_at: '',
        updated_at: '',
    },
    {
        id: 't2',
        category_id: '1',
        name_bn: 'প্রিমিয়াম দোকান',
        description: 'সব ফিচার + বারকোড + SMS রিমাইন্ডার',
        modules: [
            { id: 'm1', name_bn: 'দৈনিক হিসাব', icon: '📅', is_default: true, is_required: true, sort_order: 1 },
            { id: 'm2', name_bn: 'পার্টি হিসাব', icon: '👥', is_default: true, is_required: true, sort_order: 2 },
            { id: 'm3', name_bn: 'পণ্য মজুদ', icon: '📦', is_default: true, is_required: false, sort_order: 3 },
            { id: 'm4', name_bn: 'বিল তৈরি', icon: '🧾', is_default: true, is_required: false, sort_order: 4 },
            { id: 'm5', name_bn: 'রিপোর্ট', icon: '📊', is_default: true, is_required: false, sort_order: 5 },
            { id: 'm6', name_bn: 'বারকোড স্ক্যান', icon: '📱', is_default: true, is_required: false, sort_order: 6 },
            { id: 'm7', name_bn: 'SMS রিমাইন্ডার', icon: '📲', is_default: false, is_required: false, sort_order: 7 },
        ],
        settings: {},
        is_active: true,
        created_at: '',
        updated_at: '',
    },
];

export default function StepTemplateSelect({
    templates,
    selectedId,
    onSelect,
    onNext,
    onBack,
}: StepTemplateSelectProps) {
    const displayTemplates = templates.length > 0 ? templates : defaultTemplates;
    const [error, setError] = useState('');
    const [selectedModules, setSelectedModules] = useState<string[]>([]);

    const selectedTemplate = displayTemplates.find((t) => t.id === selectedId);

    const handleTemplateSelect = (template: Template) => {
        const defaultModules = template.modules
            .filter((m) => m.is_default || m.is_required)
            .map((m) => m.id);
        setSelectedModules(defaultModules);
        onSelect(template.id, defaultModules);
        setError('');
    };

    const handleModuleToggle = (moduleId: string, isRequired: boolean) => {
        if (isRequired) return; // Can't toggle required modules

        const newModules = selectedModules.includes(moduleId)
            ? selectedModules.filter((m) => m !== moduleId)
            : [...selectedModules, moduleId];

        setSelectedModules(newModules);
        if (selectedId) {
            onSelect(selectedId, newModules);
        }
    };

    const handleNext = () => {
        if (!selectedId) {
            setError('অনুগ্রহ করে একটি টেমপ্লেট নির্বাচন করুন');
            return;
        }
        setError('');
        onNext();
    };

    return (
        <div className="animate-slide-up">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                    📋
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    ড্যাশবোর্ড টেমপ্লেট নির্বাচন করুন
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    আপনার চাহিদা অনুযায়ী টেমপ্লেট ও মডিউল বেছে নিন
                </p>
            </div>

            {/* Template Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {displayTemplates.map((template) => (
                    <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className={`
                            text-left p-6 rounded-2xl border-2 transition-all duration-200
                            hover:shadow-card hover:-translate-y-1
                            ${selectedId === template.id
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                            }
                        `}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {template.name_bn}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {template.description}
                                </p>
                            </div>
                            {selectedId === template.id && (
                                <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Modules Preview */}
                        <div className="flex flex-wrap gap-2">
                            {template.modules.slice(0, 5).map((module) => (
                                <span
                                    key={module.id}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"
                                >
                                    <span>{module.icon}</span>
                                    <span>{module.name_bn}</span>
                                </span>
                            ))}
                            {template.modules.length > 5 && (
                                <span className="text-xs text-gray-400 dark:text-gray-500 self-center">
                                    +{template.modules.length - 5} আরও
                                </span>
                            )}
                        </div>
                    </button>
                ))}
            </div>

            {/* Module Customization */}
            {selectedTemplate && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                        🔧 মডিউল কাস্টমাইজ করুন
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        আপনার প্রয়োজনীয় মডিউল সিলেক্ট করুন (ড্র্যাগ করে সাজাতে পারবেন)
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {selectedTemplate.modules.map((module) => (
                            <label
                                key={module.id}
                                className={`
                                    flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                                    ${selectedModules.includes(module.id)
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                        : 'border-gray-200 dark:border-gray-600 hover:border-primary-300'
                                    }
                                    ${module.is_required ? 'opacity-75 cursor-not-allowed' : ''}
                                `}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedModules.includes(module.id)}
                                    onChange={() => handleModuleToggle(module.id, module.is_required)}
                                    disabled={module.is_required}
                                    className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                                />
                                <span className="text-xl">{module.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate block">
                                        {module.name_bn}
                                    </span>
                                    {module.is_required && (
                                        <span className="text-xs text-gray-400">আবশ্যক</span>
                                    )}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <p className="text-center text-red-500 mt-4">{error}</p>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
                <Button onClick={onBack} variant="ghost" size="lg" leftIcon={<span>←</span>}>
                    পেছনে
                </Button>
                <Button onClick={handleNext} size="lg" rightIcon={<span>→</span>}>
                    পরবর্তী
                </Button>
            </div>
        </div>
    );
}
