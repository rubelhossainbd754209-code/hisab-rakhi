import React from 'react';
import { Button } from '@/Components/Common';
import type { Category } from '@/types';

interface StepCategorySelectProps {
    categories: Category[];
    selectedId: string;
    onSelect: (id: string) => void;
    onNext: () => void;
    onBack: () => void;
}

// Default categories if none provided
const defaultCategories: Category[] = [
    { id: '1', name_bn: 'মুদি দোকান', icon: '🛒', description: 'মুদি, কাঁচাবাজার ও দৈনন্দিন পণ্য', color: '#4CAF50', is_active: true, sort_order: 1, created_at: '', updated_at: '' },
    { id: '2', name_bn: 'পোশাক ব্যবসা', icon: '👗', description: 'কাপড়, জামা-কাপড় ও ফ্যাশন', color: '#E91E63', is_active: true, sort_order: 2, created_at: '', updated_at: '' },
    { id: '3', name_bn: 'রেস্টুরেন্ট', icon: '🍕', description: 'খাবার দোকান, ক্যাফে ও রেস্তোরাঁ', color: '#FF9800', is_active: true, sort_order: 3, created_at: '', updated_at: '' },
    { id: '4', name_bn: 'ফার্মেসি', icon: '💊', description: 'ওষুধের দোকান ও স্বাস্থ্য পণ্য', color: '#2196F3', is_active: true, sort_order: 4, created_at: '', updated_at: '' },
    { id: '5', name_bn: 'ইলেকট্রনিক্স', icon: '📱', description: 'মোবাইল, কম্পিউটার ও ইলেকট্রনিক্স', color: '#9C27B0', is_active: true, sort_order: 5, created_at: '', updated_at: '' },
    { id: '6', name_bn: 'সার্ভিস ব্যবসা', icon: '🔧', description: 'সেবা প্রদান ও মেরামত', color: '#795548', is_active: true, sort_order: 6, created_at: '', updated_at: '' },
    { id: '7', name_bn: 'পাইকারি ব্যবসা', icon: '📦', description: 'পাইকারি বিক্রয় ও ডিস্ট্রিবিউশন', color: '#607D8B', is_active: true, sort_order: 7, created_at: '', updated_at: '' },
    { id: '8', name_bn: 'কৃষি ব্যবসা', icon: '🚜', description: 'কৃষি পণ্য ও সার-বীজ', color: '#8BC34A', is_active: true, sort_order: 8, created_at: '', updated_at: '' },
    { id: '9', name_bn: 'হার্ডওয়্যার', icon: '🔨', description: 'নির্মাণ সামগ্রী ও হার্ডওয়্যার', color: '#FF5722', is_active: true, sort_order: 9, created_at: '', updated_at: '' },
    { id: '10', name_bn: 'অন্যান্য', icon: '➕', description: 'অন্য যেকোনো ব্যবসা', color: '#9E9E9E', is_active: true, sort_order: 10, created_at: '', updated_at: '' },
];

export default function StepCategorySelect({
    categories,
    selectedId,
    onSelect,
    onNext,
    onBack,
}: StepCategorySelectProps) {
    const displayCategories = categories.length > 0 ? categories : defaultCategories;
    const [error, setError] = React.useState('');

    const handleNext = () => {
        if (!selectedId) {
            setError('অনুগ্রহ করে একটি ক্যাটাগরি নির্বাচন করুন');
            return;
        }
        setError('');
        onNext();
    };

    return (
        <div className="animate-slide-up">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-accent-100 dark:bg-accent-900/30 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                    📁
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    আপনার ব্যবসার ধরন নির্বাচন করুন
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    আপনার ব্যবসার জন্য উপযুক্ত ক্যাটাগরি বেছে নিন
                </p>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {displayCategories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => {
                            onSelect(category.id);
                            setError('');
                        }}
                        className={`
                            relative p-4 rounded-2xl border-2 transition-all duration-200
                            flex flex-col items-center text-center group
                            hover:shadow-card hover:-translate-y-1
                            ${selectedId === category.id
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                            }
                        `}
                    >
                        {/* Checkmark */}
                        {selectedId === category.id && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}

                        {/* Icon */}
                        <div
                            className={`
                                w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-3
                                transition-transform group-hover:scale-110
                            `}
                            style={{ backgroundColor: `${category.color}20` }}
                        >
                            {category.icon}
                        </div>

                        {/* Name */}
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                            {category.name_bn}
                        </span>

                        {/* Description */}
                        {category.description && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                {category.description}
                            </span>
                        )}
                    </button>
                ))}
            </div>

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
