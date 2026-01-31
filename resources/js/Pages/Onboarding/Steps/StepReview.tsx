import React from 'react';
import { Button } from '@/Components/Common';
import type { OnboardingData, Category, Template } from '@/types';

interface StepReviewProps {
    data: OnboardingData;
    categories: Category[];
    templates: Template[];
    onSubmit: () => void;
    onBack: () => void;
    isSubmitting: boolean;
}

export default function StepReview({
    data,
    categories,
    templates,
    onSubmit,
    onBack,
    isSubmitting,
}: StepReviewProps) {
    const selectedCategory = categories.find((c) => c.id === data.category_id);
    const selectedTemplate = templates.find((t) => t.id === data.template_id);

    const getLogo = () => {
        if (!data.logo) return null;
        if (typeof data.logo === 'string') {
            return data.logo.length <= 4 ? data.logo : null; // Emoji
        }
        return URL.createObjectURL(data.logo);
    };

    const logoDisplay = getLogo();
    const isEmoji = typeof data.logo === 'string' && data.logo.length <= 4;

    return (
        <div className="animate-slide-up">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                    ✅
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    সব কিছু ঠিক আছে?
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    আপনার দেওয়া তথ্য পর্যালোচনা করুন এবং নিশ্চিত করুন
                </p>
            </div>

            {/* Business Preview Card */}
            <div className="max-w-lg mx-auto bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl p-6 text-white mb-8 shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                    {/* Logo */}
                    <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center overflow-hidden">
                        {logoDisplay ? (
                            isEmoji ? (
                                <span className="text-4xl">{logoDisplay}</span>
                            ) : (
                                <img src={logoDisplay} alt="" className="w-full h-full object-cover" />
                            )
                        ) : (
                            <span className="text-3xl font-bold">
                                {data.business_name.charAt(0)}
                            </span>
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">{data.business_name}</h3>
                        <p className="text-primary-100">{selectedCategory?.name_bn}</p>
                    </div>
                </div>

                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                        <span className="text-lg">📱</span>
                        <span>{data.business_phone || 'মোবাইল যোগ করা হয়নি'}</span>
                    </div>
                    {data.business_address && (
                        <div className="flex items-center gap-3">
                            <span className="text-lg">📍</span>
                            <span>{data.business_address}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto mb-8">
                {/* Category */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{selectedCategory?.icon}</span>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">ক্যাটাগরি</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {selectedCategory?.name_bn}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Template */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">📋</span>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">টেমপ্লেট</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {selectedTemplate?.name_bn}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Selected Modules */}
            {data.selected_modules.length > 0 && selectedTemplate && (
                <div className="max-w-lg mx-auto bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-5 mb-8">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        নির্বাচিত মডিউল ({data.selected_modules.length}টি)
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {(selectedTemplate.modules || [])
                            .filter((m) => data.selected_modules.includes(m.id))
                            .map((module) => (
                                <span
                                    key={module.id}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-gray-600 rounded-full text-sm shadow-sm"
                                >
                                    <span>{module.icon}</span>
                                    <span>{module.name_bn}</span>
                                </span>
                            ))}
                    </div>
                </div>
            )}

            {/* Action Info */}
            <div className="max-w-lg mx-auto text-center mb-8">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    🎉 "সেটআপ সম্পন্ন করুন" ক্লিক করলে আপনার ড্যাশবোর্ড তৈরি হয়ে যাবে
                </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between max-w-lg mx-auto">
                <Button
                    onClick={onBack}
                    variant="ghost"
                    size="lg"
                    leftIcon={<span>←</span>}
                    disabled={isSubmitting}
                >
                    পেছনে
                </Button>
                <Button
                    onClick={onSubmit}
                    size="lg"
                    isLoading={isSubmitting}
                    rightIcon={!isSubmitting ? <span>🚀</span> : undefined}
                >
                    {isSubmitting ? 'তৈরি হচ্ছে...' : 'সেটআপ সম্পন্ন করুন'}
                </Button>
            </div>
        </div>
    );
}
