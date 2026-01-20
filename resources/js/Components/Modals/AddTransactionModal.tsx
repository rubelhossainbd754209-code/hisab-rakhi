import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import type { Party } from '@/types';

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    parties?: Party[];
}

type TransactionType = 'sale' | 'purchase' | 'payment_in' | 'payment_out' | 'expense' | 'income';

const transactionTypes: { key: TransactionType; label: string; icon: string; color: string }[] = [
    { key: 'sale', label: 'বিক্রি', icon: '🛒', color: 'bg-green-500' },
    { key: 'purchase', label: 'কেনা', icon: '📦', color: 'bg-blue-500' },
    { key: 'payment_in', label: 'বাকি আদায়', icon: '💰', color: 'bg-teal-500' },
    { key: 'payment_out', label: 'বাকি পরিশোধ', icon: '💸', color: 'bg-orange-500' },
    { key: 'expense', label: 'খরচ', icon: '📝', color: 'bg-red-500' },
    { key: 'income', label: 'আয়', icon: '💵', color: 'bg-emerald-500' },
];

export default function AddTransactionModal({ isOpen, onClose, parties = [] }: AddTransactionModalProps) {
    const [step, setStep] = useState<'type' | 'details'>('type');
    const [selectedType, setSelectedType] = useState<TransactionType | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        type: '' as TransactionType,
        amount: '',
        description: '',
        party_id: '',
        transaction_date: new Date().toISOString().split('T')[0],
    });

    const handleTypeSelect = (type: TransactionType) => {
        setSelectedType(type);
        setData('type', type);
        setStep('details');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/transactions', {
            onSuccess: () => {
                reset();
                setStep('type');
                setSelectedType(null);
                onClose();
            },
        });
    };

    const handleClose = () => {
        reset();
        setStep('type');
        setSelectedType(null);
        onClose();
    };

    if (!isOpen) return null;

    const selectedTypeInfo = transactionTypes.find(t => t.key === selectedType);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

            {/* Modal */}
            <div className="relative bg-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-scale-in shadow-2xl border border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        {step === 'details' && (
                            <button
                                onClick={() => setStep('type')}
                                className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400"
                            >
                                ←
                            </button>
                        )}
                        <h2 className="text-lg font-semibold text-white">
                            {step === 'type' ? 'নতুন লেনদেন' : selectedTypeInfo?.label}
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-lg hover:bg-gray-700 text-gray-400"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-5">
                    {step === 'type' ? (
                        <div className="grid grid-cols-2 gap-3">
                            {transactionTypes.map(type => (
                                <button
                                    key={type.key}
                                    onClick={() => handleTypeSelect(type.key)}
                                    className="flex flex-col items-center gap-3 p-5 rounded-xl border border-gray-700 hover:border-gray-600 hover:bg-gray-700/50 transition-all"
                                >
                                    <div className={`w-14 h-14 ${type.color} rounded-xl flex items-center justify-center text-2xl`}>
                                        {type.icon}
                                    </div>
                                    <span className="font-medium text-white">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    পরিমাণ (টাকা) <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">৳</span>
                                    <input
                                        type="number"
                                        value={data.amount}
                                        onChange={e => setData('amount', e.target.value)}
                                        placeholder="0"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-700 border-0 text-white text-xl font-semibold placeholder-gray-500"
                                        required
                                        autoFocus
                                    />
                                </div>
                                {errors.amount && <p className="text-red-400 text-sm mt-1">{errors.amount}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    বিবরণ
                                </label>
                                <input
                                    type="text"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    placeholder="যেমন: নগদ বিক্রি, দোকান ভাড়া..."
                                    className="w-full px-4 py-3 rounded-xl bg-gray-700 border-0 text-white placeholder-gray-500"
                                />
                            </div>

                            {/* Party (for payment types) */}
                            {['payment_in', 'payment_out', 'sale', 'purchase'].includes(selectedType || '') && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        পার্টি
                                    </label>
                                    <select
                                        value={data.party_id}
                                        onChange={e => setData('party_id', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-700 border-0 text-white"
                                    >
                                        <option value="">পার্টি নির্বাচন করুন (ঐচ্ছিক)</option>
                                        {parties.map(party => (
                                            <option key={party.id} value={party.id}>
                                                {party.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    তারিখ
                                </label>
                                <input
                                    type="date"
                                    value={data.transaction_date}
                                    onChange={e => setData('transaction_date', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-700 border-0 text-white"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing || !data.amount}
                                className="w-full py-3 rounded-xl text-white font-semibold disabled:opacity-50 transition-colors"
                                style={{ backgroundColor: '#006A4E' }}
                            >
                                {processing ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
