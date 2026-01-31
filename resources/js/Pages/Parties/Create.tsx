import { useForm, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { PageProps, Party } from '@/types';

interface CreateProps extends PageProps {
    party?: Party;
}

export default function CreateParty({ party }: CreateProps) {
    const isEditing = !!party;

    const { data, setData, post, put, processing, errors } = useForm({
        name: party?.name || '',
        phone: party?.phone || '',
        email: party?.email || '',
        address: party?.address || '',
        type: party?.type || 'customer',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/parties/${party.id}`);
        } else {
            post('/parties');
        }
    };

    return (
        <DashboardLayout title={isEditing ? 'এডিট করুন' : 'নতুন গ্রাহক/সাপ্লায়ার'}>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/parties"
                        className="text-gray-400 hover:text-white mb-2 inline-block transition-colors"
                    >
                        ← ফিরে যান
                    </Link>
                    <h1 className="text-2xl font-bold text-white">
                        {isEditing ? 'গ্রাহক/সাপ্লায়ার এডিট করুন' : 'নতুন গ্রাহক/সাপ্লায়ার যোগ করুন'}
                    </h1>
                    <p className="text-gray-400">
                        {isEditing ? 'তথ্য পরিবর্তন করুন' : 'গ্রাহক বা সাপ্লায়ারের তথ্য দিন'}
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl">
                    <form onSubmit={submit} className="space-y-6">

                        {/* Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                ধরন <span className="text-red-400">*</span>
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { key: 'customer', label: 'গ্রাহক', icon: '👤', color: 'blue' },
                                    { key: 'supplier', label: 'সাপ্লায়ার', icon: '🏭', color: 'purple' },
                                    { key: 'both', label: 'উভয়', icon: '🔄', color: 'teal' },
                                ].map(type => (
                                    <button
                                        key={type.key}
                                        type="button"
                                        onClick={() => setData('type', type.key)}
                                        className={`p-4 rounded-xl border-2 transition-all text-center ${data.type === type.key
                                                ? type.color === 'blue'
                                                    ? 'border-blue-500 bg-blue-500/20'
                                                    : type.color === 'purple'
                                                        ? 'border-purple-500 bg-purple-500/20'
                                                        : 'border-teal-500 bg-teal-500/20'
                                                : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                                            }`}
                                    >
                                        <span className="text-2xl block mb-1">{type.icon}</span>
                                        <span className="text-white font-medium">{type.label}</span>
                                    </button>
                                ))}
                            </div>
                            {errors.type && <p className="text-red-400 text-sm mt-1">{errors.type}</p>}
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                নাম <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
                                placeholder="নাম লিখুন..."
                                required
                            />
                            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                মোবাইল নম্বর
                            </label>
                            <input
                                type="tel"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
                                placeholder="01XXXXXXXXX"
                            />
                            {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                ইমেইল (ঐচ্ছিক)
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
                                placeholder="email@example.com"
                            />
                            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                ঠিকানা (ঐচ্ছিক)
                            </label>
                            <textarea
                                value={data.address}
                                onChange={e => setData('address', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
                                placeholder="সম্পূর্ণ ঠিকানা..."
                            />
                            {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-700">
                            <Link
                                href="/parties"
                                className="px-6 py-3 rounded-xl bg-gray-700 text-white hover:bg-gray-600 font-medium transition-all"
                            >
                                বাতিল
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-bold shadow-lg shadow-teal-500/30 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'সেভ হচ্ছে...' : (isEditing ? 'আপডেট করুন' : 'সেভ করুন')}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
