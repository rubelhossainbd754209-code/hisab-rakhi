import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import type { Category, Template, OnboardingData, PageProps } from '@/types';
import { Button } from '@/Components/Common';

// Onboarding Steps
import StepBusinessInfo from './Steps/StepBusinessInfo';
import StepCategorySelect from './Steps/StepCategorySelect';
import StepLogoSelect from './Steps/StepLogoSelect';
import StepTemplateSelect from './Steps/StepTemplateSelect';
import StepReview from './Steps/StepReview';

interface OnboardingIndexProps {
    categories: Category[];
    templates: Template[];
    logoLibrary: Array<{ id: string; url: string; name: string }>;
}

const steps = [
    { id: 1, name: 'ব্যবসার তথ্য', icon: '📝' },
    { id: 2, name: 'ক্যাটাগরি', icon: '📁' },
    { id: 3, name: 'লোগো', icon: '🎨' },
    { id: 4, name: 'টেমপ্লেট', icon: '📋' },
    { id: 5, name: 'সম্পন্ন', icon: '✅' },
];

export default function OnboardingIndex({ categories, templates, logoLibrary }: OnboardingIndexProps) {
    const { auth } = usePage<PageProps>().props;
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<OnboardingData>({
        business_name: '',
        business_phone: auth.user?.phone || '',
        business_address: '',
        category_id: '',
        template_id: '',
        logo: null,
        selected_modules: [],
    });

    const updateFormData = (updates: Partial<OnboardingData>) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    };

    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        const submitData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value instanceof File) {
                submitData.append(key, value);
            } else if (Array.isArray(value)) {
                value.forEach((v) => submitData.append(`${key}[]`, v));
            } else if (value !== null) {
                submitData.append(key, value);
            }
        });

        router.post('/onboarding/complete', submitData, {
            onSuccess: () => {
                router.visit('/dashboard');
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    const filteredTemplates = templates.filter(
        (t) => t.category_id === formData.category_id
    );

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <StepBusinessInfo
                        data={formData}
                        updateData={updateFormData}
                        onNext={nextStep}
                    />
                );
            case 2:
                return (
                    <StepCategorySelect
                        categories={categories}
                        selectedId={formData.category_id}
                        onSelect={(id) => updateFormData({ category_id: id, template_id: '' })}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                );
            case 3:
                return (
                    <StepLogoSelect
                        logoLibrary={logoLibrary}
                        currentLogo={formData.logo}
                        onSelect={(logo) => updateFormData({ logo })}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                );
            case 4:
                return (
                    <StepTemplateSelect
                        templates={filteredTemplates}
                        selectedId={formData.template_id}
                        onSelect={(id, modules) =>
                            updateFormData({ template_id: id, selected_modules: modules })
                        }
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                );
            case 5:
                return (
                    <StepReview
                        data={formData}
                        categories={categories}
                        templates={templates}
                        onSubmit={handleSubmit}
                        onBack={prevStep}
                        isSubmitting={isSubmitting}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Head title="ব্যবসা সেটআপ" />
            <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                {/* Header */}
                <header className="py-6 px-4">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                                <span className="text-white text-xl font-bold">হি</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                হিসাব রাখি
                            </span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            ধাপ {currentStep} / {steps.length}
                        </span>
                    </div>
                </header>

                {/* Progress Steps */}
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`
                                            w-12 h-12 rounded-full flex items-center justify-center text-xl
                                            transition-all duration-300
                                            ${step.id < currentStep
                                                ? 'bg-green-500 text-white'
                                                : step.id === currentStep
                                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                            }
                                        `}
                                    >
                                        {step.id < currentStep ? '✓' : step.icon}
                                    </div>
                                    <span
                                        className={`
                                            mt-2 text-xs font-medium hidden sm:block
                                            ${step.id <= currentStep
                                                ? 'text-gray-900 dark:text-white'
                                                : 'text-gray-400 dark:text-gray-500'
                                            }
                                        `}
                                    >
                                        {step.name}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`
                                            flex-1 h-1 mx-2 rounded-full transition-all duration-300
                                            ${step.id < currentStep
                                                ? 'bg-green-500'
                                                : 'bg-gray-200 dark:bg-gray-700'
                                            }
                                        `}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-elevated p-6 sm:p-8 animate-fade-in">
                        {renderStep()}
                    </div>
                </div>
            </div>
        </>
    );
}
