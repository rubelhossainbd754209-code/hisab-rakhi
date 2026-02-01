import { useState } from 'react';
import { router } from '@inertiajs/react';

interface Party {
    id: string;
    name: string;
    phone: string | null;
}

interface Due {
    id: string | null;
    party: Party;
    due_amount: number;
    is_party_balance?: boolean;
}

interface CollectDueModalProps {
    due: Due;
    onClose: () => void;
}

export default function CollectDueModal({ due, onClose }: CollectDueModalProps) {
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<string>('cash');
    const [notes, setNotes] = useState('');
    const [processing, setProcessing] = useState(false);

    const quickAmounts = [500, 1000, 2000, due.due_amount];

    const handleSubmit = () => {
        if (!amount || parseFloat(amount) <= 0) return;

        setProcessing(true);

        const url = due.is_party_balance || !due.id
            ? `/dues/party/${due.party.id}/collect`
            : `/dues/${due.id}/collect`;

        router.post(url, {
            amount: parseFloat(amount),
            payment_method: paymentMethod,
            notes: notes || null,
        }, {
            onSuccess: () => onClose(),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl">
                {/* Header */}
                <div className="p-5 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">💰 বাকি আদায়</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
                    </div>
                    <p className="text-gray-400 mt-1">{due.party.name}</p>
                </div>

                <div className="p-5 space-y-4">
                    {/* Due Amount Display */}
                    <div className="text-center py-4 bg-red-500/10 rounded-xl border border-red-500/20">
                        <p className="text-gray-400 text-sm">মোট বাকি</p>
                        <p className="text-3xl font-bold text-red-400">৳{due.due_amount.toLocaleString('bn-BD')}</p>
                    </div>

                    {/* Amount Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">আদায় পরিমাণ</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">৳</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                                max={due.due_amount}
                                className="w-full pl-10 pr-4 py-4 rounded-xl bg-gray-700 border border-gray-600 text-white text-xl font-bold placeholder-gray-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                            />
                        </div>
                    </div>

                    {/* Quick Amount Buttons */}
                    <div className="flex flex-wrap gap-2">
                        {quickAmounts.map((amt, i) => (
                            <button
                                key={i}
                                onClick={() => setAmount(amt.toString())}
                                className={`px-4 py-2 rounded-xl font-medium transition-colors ${parseFloat(amount) === amt
                                        ? 'bg-teal-500 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                            >
                                {i === quickAmounts.length - 1 ? 'সব আদায়' : `৳${amt.toLocaleString()}`}
                            </button>
                        ))}
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">পেমেন্ট মেথড</label>
                        <div className="grid grid-cols-5 gap-2">
                            {[
                                { key: 'cash', label: '💵', name: 'নগদ' },
                                { key: 'bkash', label: '🅱️', name: 'বিকাশ' },
                                { key: 'nagad', label: '🟠', name: 'নগদ' },
                                { key: 'rocket', label: '🚀', name: 'রকেট' },
                                { key: 'bank', label: '🏦', name: 'ব্যাংক' },
                            ].map(method => (
                                <button
                                    key={method.key}
                                    onClick={() => setPaymentMethod(method.key)}
                                    className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${paymentMethod === method.key
                                            ? 'bg-teal-500 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                >
                                    <span className="text-xl">{method.label}</span>
                                    <span className="text-xs">{method.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">নোট (ঐচ্ছিক)</label>
                        <input
                            type="text"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="অতিরিক্ত তথ্য..."
                            className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:border-teal-500"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-700 flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={processing}
                        className="flex-1 px-4 py-3 rounded-xl bg-gray-700 text-white font-medium hover:bg-gray-600 transition-colors"
                    >
                        বাতিল
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={processing || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > due.due_amount}
                        className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            '⏳ প্রসেসিং...'
                        ) : (
                            <>✅ আদায় করুন</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
