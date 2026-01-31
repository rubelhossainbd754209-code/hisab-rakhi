import React, { useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { PageProps, Product } from '@/types';

interface CreateProps extends PageProps {
    product?: Product;
}

export default function Create({ auth, product }: CreateProps) {
    const isEditing = !!product;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: product?.name || '',
        sku: product?.sku || '',
        barcode: product?.barcode || '',
        selling_price: product?.selling_price || '',
        purchase_price: product?.purchase_price || '',
        stock: product?.stock || '',
        alert_quantity: product?.alert_quantity || '',
        unit: product?.unit || 'pcs',
        description: product?.description || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/products/${product.id}`);
        } else {
            post('/products');
        }
    };

    return (
        <DashboardLayout title={isEditing ? 'পণ্য এডিট করুন' : 'নতুন পণ্য যুক্ত করুন'}>
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link
                            href="/products"
                            className="text-gray-400 hover:text-white mb-2 inline-block transition-colors"
                        >
                            ← ফিরে যান
                        </Link>
                        <h1 className="text-2xl font-bold text-white">
                            {isEditing ? 'পণ্য এডিট করুন' : 'নতুন পণ্য যুক্ত করুন'}
                        </h1>
                        <p className="text-gray-400">
                            {isEditing ? 'পণ্যের তথ্য পরিবর্তন করুন' : 'দোকানের নতুন পণ্য বা সেবা যুক্ত করুন'}
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl">
                    <form onSubmit={submit} className="space-y-6">

                        {/* Basic Info Section */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-teal-400 border-b border-gray-700 pb-2 mb-4">
                                প্রাথমিক তথ্য
                            </h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    পণ্যের নাম <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
                                    placeholder="উদাহরণ: মিনিকেট চাল"
                                    required
                                />
                                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    ইউনিট / একক
                                </label>
                                <select
                                    value={data.unit}
                                    onChange={e => setData('unit', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-500 outline-none transition-all"
                                >
                                    <option value="pcs">পিস (Pcs)</option>
                                    <option value="kg">কেজি (Kg)</option>
                                    <option value="liter">লিটার (Liter)</option>
                                    <option value="box">বক্স (Box)</option>
                                    <option value="packet">প্যাকেট (Packet)</option>
                                    <option value="dozen">ডজন (Dozen)</option>
                                    <option value="gm">গ্রাম (Gm)</option>
                                </select>
                            </div>
                        </div>

                        {/* Pricing & Stock Section */}
                        <div className="space-y-4 pt-4">
                            <h2 className="text-lg font-semibold text-teal-400 border-b border-gray-700 pb-2 mb-4">
                                দাম ও মজুদ
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        ক্রয় মূল্য (টাকা)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.purchase_price}
                                        onChange={e => setData('purchase_price', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-500 outline-none transition-all"
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        বিক্রয় মূল্য (টাকা) <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={data.selling_price}
                                        onChange={e => setData('selling_price', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-500 outline-none transition-all"
                                        placeholder="0.00"
                                        step="0.01"
                                        required
                                    />
                                    {errors.selling_price && <p className="text-red-400 text-sm mt-1">{errors.selling_price}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        বর্তমান স্টক <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={data.stock}
                                        onChange={e => setData('stock', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-500 outline-none transition-all"
                                        placeholder="0"
                                        step="0.01"
                                        required
                                    />
                                    {errors.stock && <p className="text-red-400 text-sm mt-1">{errors.stock}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        লো স্টক অ্যালার্ট
                                    </label>
                                    <input
                                        type="number"
                                        value={data.alert_quantity}
                                        onChange={e => setData('alert_quantity', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-500 outline-none transition-all"
                                        placeholder="এই সংখ্যার নিচে নামলে সতর্ক করবে"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </div>



                        {/* Actions */}
                        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-700">
                            <Link
                                href="/products"
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
