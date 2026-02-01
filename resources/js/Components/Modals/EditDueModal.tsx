import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

interface Product {
    id: string;
    name: string;
    sku: string | null;
    selling_price: number;
    stock: number;
    unit: string;
}

interface DueItem {
    type: 'product' | 'custom';
    product_id?: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
}

interface Party {
    id: string;
    name: string;
    phone: string | null;
}

interface Due {
    id: string | null;
    party: Party;
    items: DueItem[];
    total_amount: number;
    paid_amount: number;
    due_amount: number;
    due_date: string | null;
    notes?: string;
}

interface EditDueModalProps {
    due: Due;
    products: Product[];
    onClose: () => void;
}

export default function EditDueModal({ due, products, onClose }: EditDueModalProps) {
    const [items, setItems] = useState<DueItem[]>(due.items || []);
    const [productSearch, setProductSearch] = useState('');
    const [showProductDropdown, setShowProductDropdown] = useState(false);
    const [customItemName, setCustomItemName] = useState('');
    const [customItemAmount, setCustomItemAmount] = useState('');
    const [dueDate, setDueDate] = useState(due.due_date || '');
    const [notes, setNotes] = useState(due.notes || '');
    const [processing, setProcessing] = useState(false);

    const filteredProducts = productSearch
        ? products.filter(p =>
            p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
            p.sku?.toLowerCase().includes(productSearch.toLowerCase())
        ).slice(0, 5)
        : [];

    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

    const addProduct = (product: Product) => {
        const existing = items.find(i => i.product_id === product.id);
        if (existing) {
            setItems(items.map(i =>
                i.product_id === product.id
                    ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.price }
                    : i
            ));
        } else {
            setItems([...items, {
                type: 'product',
                product_id: product.id,
                name: product.name,
                quantity: 1,
                price: product.selling_price,
                total: product.selling_price,
            }]);
        }
        setProductSearch('');
        setShowProductDropdown(false);
    };

    const addCustomItem = () => {
        if (!customItemName || !customItemAmount) return;
        setItems([...items, {
            type: 'custom',
            name: customItemName,
            quantity: 1,
            price: parseFloat(customItemAmount),
            total: parseFloat(customItemAmount),
        }]);
        setCustomItemName('');
        setCustomItemAmount('');
    };

    const updateItemQuantity = (index: number, quantity: number) => {
        if (quantity <= 0) {
            setItems(items.filter((_, i) => i !== index));
        } else {
            setItems(items.map((item, i) =>
                i === index ? { ...item, quantity, total: quantity * item.price } : item
            ));
        }
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!due.id || items.length === 0) return;

        setProcessing(true);
        router.put(`/dues/${due.id}`, {
            items,
            total_amount: totalAmount,
            due_date: dueDate || null,
            notes: notes || null,
        }, {
            onSuccess: () => onClose(),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-gray-800 rounded-2xl w-full max-w-lg border border-gray-700 shadow-2xl my-4">
                {/* Header */}
                <div className="p-5 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">✏️ বাকি এডিট করুন</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
                    </div>
                    <p className="text-gray-400 mt-1">{due.party.name}</p>
                </div>

                <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                    {/* Product Search */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">পণ্য যোগ করুন</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="🔍 পণ্য খুঁজুন..."
                                value={productSearch}
                                onChange={(e) => {
                                    setProductSearch(e.target.value);
                                    setShowProductDropdown(true);
                                }}
                                onFocus={() => setShowProductDropdown(true)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                            />
                            {showProductDropdown && filteredProducts.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-gray-700 border border-gray-600 rounded-xl overflow-hidden z-10 shadow-xl">
                                    {filteredProducts.map(product => (
                                        <button
                                            key={product.id}
                                            onClick={() => addProduct(product)}
                                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-600 transition-colors text-left"
                                        >
                                            <span className="text-white">{product.name}</span>
                                            <span className="text-teal-400">৳{product.selling_price}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Custom Item */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="কাস্টম আইটেম নাম"
                            value={customItemName}
                            onChange={(e) => setCustomItemName(e.target.value)}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:border-teal-500"
                        />
                        <input
                            type="number"
                            placeholder="৳ টাকা"
                            value={customItemAmount}
                            onChange={(e) => setCustomItemAmount(e.target.value)}
                            className="w-28 px-3 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:border-teal-500"
                        />
                        <button
                            onClick={addCustomItem}
                            disabled={!customItemName || !customItemAmount}
                            className="px-4 py-2.5 rounded-xl bg-teal-500 text-white font-medium hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            +
                        </button>
                    </div>

                    {/* Items List */}
                    {items.length > 0 && (
                        <div className="bg-gray-700/50 rounded-xl p-3 space-y-2">
                            {items.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">{item.type === 'product' ? '📦' : '📝'}</span>
                                        <span className="text-white text-sm">{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateItemQuantity(index, item.quantity - 1)}
                                            className="w-7 h-7 rounded-lg bg-gray-600 text-white hover:bg-gray-500"
                                        >
                                            -
                                        </button>
                                        <span className="text-white w-6 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateItemQuantity(index, item.quantity + 1)}
                                            className="w-7 h-7 rounded-lg bg-gray-600 text-white hover:bg-gray-500"
                                        >
                                            +
                                        </button>
                                        <span className="text-teal-400 text-sm w-20 text-right">৳{item.total.toLocaleString()}</span>
                                        <button
                                            onClick={() => removeItem(index)}
                                            className="text-red-400 hover:text-red-300 ml-1"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">বাকি পরিশোধের তারিখ (ঐচ্ছিক)</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-teal-500"
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">নোট (ঐচ্ছিক)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="অতিরিক্ত তথ্য..."
                            rows={2}
                            className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:border-teal-500 resize-none"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400">মোট বাকি:</span>
                        <span className="text-2xl font-bold text-red-400">৳{Number(totalAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={processing}
                            className="flex-1 px-4 py-3 rounded-xl bg-gray-700 text-white font-medium hover:bg-gray-600 transition-colors"
                        >
                            বাতিল
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={processing || items.length === 0}
                            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50"
                        >
                            {processing ? '⏳ আপডেট হচ্ছে...' : '✅ আপডেট করুন'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
