import { useState } from 'react';

interface Party {
    id: string;
    name: string;
    phone: string | null;
}

interface DueItem {
    name: string;
    quantity: number;
    price: number;
    total: number;
}

interface Due {
    id: string | null;
    party: Party;
    items?: DueItem[];
    total_amount: number;
    paid_amount: number;
    due_amount: number;
    due_date?: string | null;
    notes?: string | null;
    status?: string;
    days_ago?: number;
    created_at?: string | null;
}

interface DueHistoryModalProps {
    due: Due;
    onClose: () => void;
}

export default function DueHistoryModal({ due, onClose }: DueHistoryModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-gray-800 rounded-2xl w-full max-w-lg border border-gray-700 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-5 border-b border-gray-700 bg-gradient-to-r from-purple-600/20 to-indigo-600/20">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            📜 বাকির বিস্তারিত
                        </h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                    {/* Customer Info */}
                    <div className="bg-gray-700/50 rounded-xl p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500/30 to-orange-500/30 flex items-center justify-center text-2xl font-bold text-red-400">
                                {due.party.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">{due.party.name}</h3>
                                {due.party.phone && (
                                    <p className="text-gray-400 text-sm">📱 {due.party.phone}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Amount Summary */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-blue-500/10 rounded-xl p-3 text-center border border-blue-500/20">
                            <p className="text-xs text-blue-300 mb-1">মোট বাকি</p>
                            <p className="text-lg font-bold text-blue-400">৳{due.total_amount.toLocaleString('bn-BD')}</p>
                        </div>
                        <div className="bg-green-500/10 rounded-xl p-3 text-center border border-green-500/20">
                            <p className="text-xs text-green-300 mb-1">আদায়</p>
                            <p className="text-lg font-bold text-green-400">৳{due.paid_amount.toLocaleString('bn-BD')}</p>
                        </div>
                        <div className="bg-red-500/10 rounded-xl p-3 text-center border border-red-500/20">
                            <p className="text-xs text-red-300 mb-1">বকেয়া</p>
                            <p className="text-lg font-bold text-red-400">৳{due.due_amount.toLocaleString('bn-BD')}</p>
                        </div>
                    </div>

                    {/* Date Info */}
                    <div className="bg-gray-700/50 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">📅 বাকির তারিখ:</span>
                            <span className="text-white font-medium">{due.created_at}</span>
                        </div>
                        {due.due_date && (
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">⏰ পরিশোধের নির্ধারিত তারিখ:</span>
                                <span className="text-yellow-400 font-medium">{due.due_date}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">⏳ বাকি বয়স:</span>
                            <span className={`font-medium ${(due.days_ago || 0) >= 30 ? 'text-red-400' : (due.days_ago || 0) >= 7 ? 'text-orange-400' : 'text-gray-300'}`}>
                                {due.days_ago || 0} দিন
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">📊 স্ট্যাটাস:</span>
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${due.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                                due.status === 'partial' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/20 text-red-400'
                                }`}>
                                {due.status === 'paid' ? 'পরিশোধিত' : due.status === 'partial' ? 'আংশিক' : 'বকেয়া'}
                            </span>
                        </div>
                    </div>

                    {/* Products List */}
                    {due.items && due.items.length > 0 && (
                        <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-3">🛒 পণ্য তালিকা</h4>
                            <div className="bg-gray-700/50 rounded-xl overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            <th className="text-left p-3 text-gray-300">পণ্য</th>
                                            <th className="text-center p-3 text-gray-300">পরিমাণ</th>
                                            <th className="text-right p-3 text-gray-300">মূল্য</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {due.items.map((item: DueItem, i: number) => (
                                            <tr key={i} className="border-t border-gray-600">
                                                <td className="p-3 text-white">{item.name}</td>
                                                <td className="p-3 text-center text-gray-300">{item.quantity}</td>
                                                <td className="p-3 text-right text-teal-400">৳{item.total.toLocaleString('bn-BD')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {due.notes && (
                        <div className="bg-gray-700/50 rounded-xl p-4">
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">📝 নোট</h4>
                            <p className="text-gray-400">{due.notes}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-700">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white font-medium hover:bg-gray-600 transition-colors"
                    >
                        বন্ধ করুন
                    </button>
                </div>
            </div>
        </div>
    );
}
