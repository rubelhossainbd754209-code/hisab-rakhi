import React, { useState, useRef } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { PageProps, User } from '@/types';

interface ProfilePageProps extends PageProps {
    user: User;
}

export default function Profile({ auth, user }: ProfilePageProps) {
    const { flash } = usePage().props as any;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data, setData, put, processing, errors } = useForm({
        name: user?.name || auth.user?.name || '',
        phone: user?.phone || '',
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/profile');
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put('/profile/password', {
            onSuccess: () => {
                passwordForm.reset();
            },
        });
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload
        setIsUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        router.post('/profile/image', formData, {
            forceFormData: true,
            onSuccess: () => {
                setIsUploading(false);
                setPreviewUrl(null);
            },
            onError: () => {
                setIsUploading(false);
                setPreviewUrl(null);
            },
        });
    };

    const handleRemoveImage = () => {
        if (confirm('প্রোফাইল ছবি মুছে ফেলতে চান?')) {
            router.delete('/profile/image');
        }
    };

    const profileImage = previewUrl || user?.profile_image || auth.user?.profile_image;
    const userName = user?.name || auth.user?.name || 'User';
    const userEmail = user?.email || auth.user?.email || '';

    return (
        <DashboardLayout title="প্রোফাইল">
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
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">প্রোফাইল</h1>
                <p className="text-gray-400">আপনার প্রোফাইল তথ্য আপডেট করুন</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card with Image Upload */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 text-center">
                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />

                    {/* Profile Image */}
                    <div className="relative inline-block">
                        <div
                            onClick={handleImageClick}
                            className={`w-28 h-28 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold cursor-pointer overflow-hidden border-4 border-gray-700 hover:border-green-500 transition-colors ${isUploading ? 'opacity-50' : ''}`}
                            style={{ backgroundColor: profileImage ? 'transparent' : '#006A4E' }}
                        >
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt={userName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                userName.charAt(0).toUpperCase()
                            )}
                        </div>

                        {/* Upload loading indicator */}
                        {isUploading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}

                        {/* Camera icon overlay */}
                        <div
                            onClick={handleImageClick}
                            className="absolute bottom-3 right-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors"
                        >
                            <span className="text-white text-sm">📷</span>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-white">{userName}</h2>
                    <p className="text-gray-400 mb-4">{userEmail}</p>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={handleImageClick}
                            disabled={isUploading}
                            className="px-4 py-2 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            {isUploading ? '⏳ আপলোড হচ্ছে...' : '📷 ছবি পরিবর্তন'}
                        </button>
                        {profileImage && !previewUrl && (
                            <button
                                onClick={handleRemoveImage}
                                className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                🗑️ ছবি মুছুন
                            </button>
                        )}
                    </div>

                    <p className="text-xs text-gray-500 mt-4">
                        সর্বোচ্চ ৫MB, JPG/PNG
                    </p>
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-2 bg-gray-800 rounded-2xl border border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">প্রোফাইল তথ্য</h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">নাম</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-700 border-0 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                            />
                            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">ইমেইল</label>
                            <input
                                type="email"
                                value={userEmail}
                                disabled
                                className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border-0 text-gray-400 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-1">ইমেইল পরিবর্তন করা যাবে না</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">মোবাইল</label>
                            <input
                                type="tel"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                placeholder="০১XXXXXXXXX"
                                className="w-full px-4 py-3 rounded-xl bg-gray-700 border-0 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-3 rounded-xl text-white font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: '#006A4E' }}
                        >
                            {processing ? '⏳ সেভ হচ্ছে...' : '💾 সেভ করুন'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Password Change Section */}
            <div className="mt-6 bg-gray-800 rounded-2xl border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🔒 পাসওয়ার্ড পরিবর্তন</h3>
                <p className="text-gray-400 mb-4">আপনার অ্যাকাউন্ট সুরক্ষিত রাখতে শক্তিশালী পাসওয়ার্ড ব্যবহার করুন।</p>

                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">বর্তমান পাসওয়ার্ড</label>
                        <input
                            type="password"
                            value={passwordForm.data.current_password}
                            onChange={e => passwordForm.setData('current_password', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-700 border-0 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                        />
                        {passwordForm.errors.current_password && (
                            <p className="text-red-400 text-sm mt-1">{passwordForm.errors.current_password}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">নতুন পাসওয়ার্ড</label>
                        <input
                            type="password"
                            value={passwordForm.data.password}
                            onChange={e => passwordForm.setData('password', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-700 border-0 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                        />
                        {passwordForm.errors.password && (
                            <p className="text-red-400 text-sm mt-1">{passwordForm.errors.password}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">নতুন পাসওয়ার্ড (পুনরায়)</label>
                        <input
                            type="password"
                            value={passwordForm.data.password_confirmation}
                            onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-700 border-0 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={passwordForm.processing}
                        className="px-6 py-3 rounded-xl bg-gray-700 text-white font-medium hover:bg-gray-600 transition-colors disabled:opacity-50"
                    >
                        {passwordForm.processing ? '⏳ পরিবর্তন হচ্ছে...' : '🔐 পাসওয়ার্ড পরিবর্তন করুন'}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}
