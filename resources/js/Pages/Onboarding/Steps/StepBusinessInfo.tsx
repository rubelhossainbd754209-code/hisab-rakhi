import React from 'react';
import { Button, Input } from '@/Components/Common';
import type { OnboardingData } from '@/types';

interface StepBusinessInfoProps {
    data: OnboardingData;
    updateData: (updates: Partial<OnboardingData>) => void;
    onNext: () => void;
}

export default function StepBusinessInfo({ data, updateData, onNext }: StepBusinessInfoProps) {
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!data.business_name.trim()) {
            newErrors.business_name = 'ব্যবসার নাম দিন';
        }
        if (!data.business_phone.trim()) {
            newErrors.business_phone = 'মোবাইল নম্বর দিন';
        } else if (!/^01[3-9]\d{8}$/.test(data.business_phone.replace(/\D/g, ''))) {
            newErrors.business_phone = 'সঠিক মোবাইল নম্বর দিন';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) {
            onNext();
        }
    };

    return (
        <div className="animate-slide-up">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                    🏪
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    আপনার ব্যবসার তথ্য দিন
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    এই তথ্য আপনার ড্যাশবোর্ড ও বিলে দেখা যাবে
                </p>
            </div>

            {/* Form */}
            <div className="max-w-md mx-auto space-y-5">
                <Input
                    label="ব্যবসার নাম *"
                    type="text"
                    placeholder="যেমন: রহমান স্টোর"
                    value={data.business_name}
                    onChange={(e) => updateData({ business_name: e.target.value })}
                    error={errors.business_name}
                    leftIcon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    }
                />

                <Input
                    label="মোবাইল নম্বর *"
                    type="tel"
                    placeholder="০১XXXXXXXXX"
                    value={data.business_phone}
                    onChange={(e) => updateData({ business_phone: e.target.value })}
                    error={errors.business_phone}
                    leftIcon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    }
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        ঠিকানা (ঐচ্ছিক)
                    </label>
                    <textarea
                        placeholder="দোকানের ঠিকানা লিখুন..."
                        value={data.business_address}
                        onChange={(e) => updateData({ business_address: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-end mt-8">
                <Button onClick={handleNext} size="lg" rightIcon={<span>→</span>}>
                    পরবর্তী
                </Button>
            </div>
        </div>
    );
}
