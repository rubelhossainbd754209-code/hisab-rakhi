import React, { FormEvent, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Button, Input } from '@/Components/Common';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <GuestLayout title="অ্যাকাউন্ট তৈরি করুন">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-elevated p-8 animate-fade-in">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            অ্যাকাউন্ট তৈরি করুন ✨
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            আপনার ব্যবসার ডিজিটাল হিসাব খাতা শুরু করুন
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="আপনার নাম"
                            type="text"
                            placeholder="আপনার পুরো নাম লিখুন"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                            leftIcon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            }
                        />

                        <Input
                            label="মোবাইল নম্বর"
                            type="tel"
                            placeholder="০১XXXXXXXXX"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            error={errors.phone}
                            leftIcon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            }
                        />

                        <Input
                            label="ইমেইল"
                            type="email"
                            placeholder="আপনার ইমেইল দিন"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={errors.email}
                            leftIcon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            }
                        />

                        <Input
                            label="পাসওয়ার্ড"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="শক্তিশালী পাসওয়ার্ড দিন"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={errors.password}
                            helperText="কমপক্ষে ৮ অক্ষর হতে হবে"
                            leftIcon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            }
                            rightIcon={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            }
                        />

                        <Input
                            label="পাসওয়ার্ড নিশ্চিত করুন"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="পুনরায় পাসওয়ার্ড দিন"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            error={errors.password_confirmation}
                            leftIcon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            }
                        />

                        {/* Terms Checkbox */}
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                required
                                className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                আমি{' '}
                                <Link href="/terms" className="text-primary-500 hover:underline">
                                    শর্তাবলী
                                </Link>{' '}
                                এবং{' '}
                                <Link href="/privacy" className="text-primary-500 hover:underline">
                                    গোপনীয়তা নীতি
                                </Link>{' '}
                                পড়েছি এবং সম্মত আছি।
                            </span>
                        </label>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            isLoading={processing}
                        >
                            অ্যাকাউন্ট তৈরি করুন
                        </Button>
                    </form>

                    {/* Login Link */}
                    <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
                        ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
                        <Link
                            href="/login"
                            className="text-primary-500 hover:text-primary-600 font-medium"
                        >
                            লগইন করুন
                        </Link>
                    </p>
                </div>
            </div>
        </GuestLayout>
    );
}
