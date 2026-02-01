import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';

interface Party {
    id: string;
    name: string;
    phone: string | null;
}

interface DueItem {
    name: string;
    quantity: number;
    total: number;
}

interface Due {
    id: string | null;
    party: Party;
    items: DueItem[];
    due_amount: number;
    is_party_balance?: boolean;
}

interface ShareDueModalProps {
    due: Due;
    onClose: () => void;
}

export default function ShareDueModal({ due, onClose }: ShareDueModalProps) {
    const { auth } = usePage<PageProps>().props;
    const [message, setMessage] = useState('');
    const [copied, setCopied] = useState(false);

    // Generate message on mount
    useEffect(() => {
        const businessName = auth.business?.name || 'আমার দোকান';
        let msg = `🏪 ${businessName}\n`;
        msg += `─────────────────────\n`;
        msg += `প্রিয় ${due.party.name},\n\n`;
        msg += `আপনার বাকি: ৳${due.due_amount.toLocaleString('bn-BD')}\n\n`;

        if (due.items && due.items.length > 0) {
            msg += `পণ্য তালিকা:\n`;
            due.items.forEach(item => {
                msg += `• ${item.name}`;
                if (item.quantity > 1) {
                    msg += ` x${item.quantity}`;
                }
                msg += ` = ৳${item.total.toLocaleString()}\n`;
            });
            msg += `\n`;
        }

        msg += `দয়া করে বাকি পরিশোধ করুন।\nধন্যবাদ! 🙏`;

        setMessage(msg);
    }, [due, auth.business?.name]);

    const shareViaWhatsApp = () => {
        const phone = due.party.phone?.replace(/[^0-9]/g, '');
        const encodedMessage = encodeURIComponent(message);
        const url = phone
            ? `https://wa.me/88${phone}?text=${encodedMessage}`
            : `https://wa.me/?text=${encodedMessage}`;
        window.open(url, '_blank');
    };

    const shareViaMessenger = () => {
        // Messenger share via clipboard since direct message isn't supported
        copyToClipboard();
        alert('মেসেজ কপি হয়েছে! এখন Messenger এ পেস্ট করুন।');
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl">
                {/* Header */}
                <div className="p-5 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">📤 বাকির হিসাব শেয়ার</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
                    </div>
                    <p className="text-gray-400 mt-1">{due.party.name}</p>
                </div>

                <div className="p-5 space-y-4">
                    {/* Message Preview */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">মেসেজ প্রিভিউ</label>
                        <div className="bg-gray-700 rounded-xl p-4 text-sm text-gray-300 whitespace-pre-line max-h-60 overflow-y-auto border border-gray-600">
                            {message}
                        </div>
                    </div>

                    {/* Share Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={shareViaWhatsApp}
                            className="w-full px-4 py-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition-colors flex items-center justify-center gap-3"
                        >
                            <span className="text-2xl">📱</span>
                            WhatsApp এ পাঠান
                        </button>

                        <button
                            onClick={shareViaMessenger}
                            className="w-full px-4 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center justify-center gap-3"
                        >
                            <span className="text-2xl">💬</span>
                            Messenger এ পাঠান
                        </button>

                        <button
                            onClick={copyToClipboard}
                            className="w-full px-4 py-4 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors flex items-center justify-center gap-3"
                        >
                            <span className="text-2xl">{copied ? '✅' : '📋'}</span>
                            {copied ? 'কপি হয়েছে!' : 'কপি করুন'}
                        </button>
                    </div>

                    {/* Phone Info */}
                    {due.party.phone && (
                        <div className="text-center text-sm text-gray-500">
                            📞 {due.party.phone}
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
